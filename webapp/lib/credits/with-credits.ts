import { procedureBuilder } from '@/lib/orpc/base'
import { Errors } from '@/lib/orpc/errors'
import type { ORPCUser } from '@/lib/orpc/context'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'
import { CREDIT_CONFIG } from './config'

interface ConsumeResult {
  success: boolean
  balance: number
  needed?: number
  allocation?: number
  error?: string
}

async function resolvePlan(supabase: SupabaseClient): Promise<string> {
  const { data } = await supabase.auth.getSession()
  const claims = data.session?.user?.app_metadata ?? {}
  return typeof claims.plan === 'string' ? claims.plan : 'starter'
}

export function withCredits(opts: { type: string; cost: number }) {
  return procedureBuilder
    .$context<{ user: ORPCUser; supabase: SupabaseClient }>()
    .middleware(async ({ context, next }) => {
      const creditConfig = CREDIT_CONFIG[opts.type]
      if (!creditConfig) throw Errors.internal(`Unknown credit type: ${opts.type}`)

      const plan = await resolvePlan(context.supabase)
      const allocation = creditConfig.allocations[plan]
      if (allocation === undefined) {
        throw Errors.forbidden(`No credit allocation for plan: ${plan}`)
      }

      // consume_credits/refund_credits RPCs are GRANTed to service_role only
      const adminClient = createAdminClient()
      const { data, error } = await adminClient.rpc('consume_credits', {
        p_user_id: context.user.id,
        p_credit_type: opts.type,
        p_cost: opts.cost,
        p_allocation: allocation,
        p_period: creditConfig.period,
      })
      if (error) { console.error("[credits] operation failed:", error); throw Errors.internal("Operation failed") }

      const result = data as ConsumeResult
      if (!result.success) {
        throw Errors.forbidden(
          `Insufficient credits: need ${opts.cost}, have ${result.balance}`
        )
      }

      try {
        return await next({
          context: {
            creditsConsumed: opts.cost,
            creditsRemaining: result.balance,
          },
        })
      } catch (err) {
        // Automatic refund on handler failure — uses admin client (service_role)
        const refundClient = createAdminClient()
        await refundClient.rpc('refund_credits', {
          p_user_id: context.user.id,
          p_credit_type: opts.type,
          p_amount: opts.cost,
        })
        throw err
      }
    })
}
