import { createClient } from '@/lib/supabase/client'

/**
 * Force-refresh the JWT so custom_access_token_hook re-runs.
 * After a Stripe payment, the `plan` claim in the JWT is stale.
 * Calling refreshSession() issues a new token with the updated claim.
 */
export async function refreshClaims() {
  const supabase = createClient()
  const { error } = await supabase.auth.refreshSession()
  if (error) {
    console.error('Failed to refresh session:', error.message)
  }
}
