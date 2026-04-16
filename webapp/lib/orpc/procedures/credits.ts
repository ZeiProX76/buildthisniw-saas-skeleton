import { protectedProcedure } from '../base'
import { Errors } from '../errors'
import { CREDIT_CONFIG, isUnlimited } from '@/lib/credits/config'

interface BalanceRow {
  credit_type: string
  balance: number
  allocation: number
  period: string
  period_start: string
}

/**
 * Get current user's credit balances for all configured credit types.
 * Resolves plan from JWT claims, merges CREDIT_CONFIG with DB balance rows.
 */
export const getBalance = protectedProcedure
  .route({ method: 'GET', path: '/protected/credits/balance' })
  .handler(async ({ context }) => {
  if (!context.user) throw Errors.unauthorized()

  // Resolve plan from JWT claims
  const { data: sessionData } = await context.supabase.auth.getSession()
  const claims = sessionData.session?.user?.app_metadata ?? {}
  const plan = typeof claims.plan === 'string' ? claims.plan : 'starter'

  // Build result from config, enriched with current DB balances
  const result = await Promise.all(
    Object.entries(CREDIT_CONFIG).map(async ([creditType, config]) => {
      const allocation = config.allocations[plan] ?? 0
      if (allocation === 0) return null

      // Query current period balance from DB
      const periodStart = getPeriodStart(config.period)
      const { data } = await context.supabase
        .from('credit_balances')
        .select('balance, allocation, period, period_start')
        .eq('user_id', context.user!.id)
        .eq('credit_type', creditType)
        .eq('period_start', periodStart)
        .single<BalanceRow>()

      return {
        creditType,
        balance: data?.balance ?? allocation,
        allocation,
        period: config.period,
        periodStart: data?.period_start ?? null,
      }
    })
  )

  return result.filter((r): r is NonNullable<typeof r> => r !== null)
})

function getPeriodStart(period: string): string {
  const now = new Date()
  switch (period) {
    case 'day':
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString()
    case 'week': {
      const day = now.getUTCDay()
      const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1) // Monday
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), diff)).toISOString()
    }
    case 'month':
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString()
    default:
      return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString()
  }
}

export const creditsRouter = {
  getBalance,
}
