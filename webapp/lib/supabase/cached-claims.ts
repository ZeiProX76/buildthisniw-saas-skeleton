import { cache } from 'react'
import { createClient } from './server'

export const getCachedAuth = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  return { supabase, claims: (data?.claims ?? {}) as Record<string, unknown> }
})
