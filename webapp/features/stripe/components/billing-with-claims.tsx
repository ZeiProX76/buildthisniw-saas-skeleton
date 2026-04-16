import { createClient } from '@/lib/supabase/server'
import { getPlan } from '@/lib/auth/utils'
import { BillingPage } from './billing-page'

export async function BillingWithClaims() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims = (data?.claims ?? {}) as Record<string, unknown>

  return <BillingPage currentPlan={getPlan(claims)} />
}
