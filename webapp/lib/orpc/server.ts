import { createRouterClient } from '@orpc/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { appRouter } from './router'
import type { ORPCUser, AuthedContext, ORPCContext } from './context'
import { resolveUserFromClaims } from './resolve-user'

/**
 * Server-side oRPC caller — zero HTTP overhead.
 * Calls procedures directly in the same process.
 * Uses createClient() (cookies) — NOT safe inside 'use cache'.
 * For cached public data, use getPublicORPCCaller() instead.
 *
 * @example
 * ```ts
 * const caller = await getORPCCaller()
 * const status = await caller.protected.swarm.getWaitlistStatus()
 * ```
 */
export async function getORPCCaller() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims
  const orpcUser = claims ? resolveUserFromClaims(claims) : undefined

  return createRouterClient(appRouter, {
    // Cast: public routes don't use user, protected routes are only
    // called when user is authenticated (server components check auth first)
    context: {
      requestId: crypto.randomUUID(),
      startTime: Date.now(),
      user: orpcUser as ORPCUser,
      supabase,
    } satisfies AuthedContext,
  })
}

/**
 * Public oRPC caller — safe inside 'use cache'.
 * Uses createAdminClient() (no cookies, service role).
 * Only use for public procedures — no user context available.
 *
 * @example
 * ```ts
 * // Inside 'use cache' data functions:
 * const caller = getPublicORPCCaller()
 * const ideas = await caller.public.ideas.list({ page: 1 })
 * ```
 */
export function getPublicORPCCaller() {
  const supabase = createAdminClient()

  return createRouterClient(appRouter, {
    // Public caller: no user context. Uses ORPCContext (user optional)
    // instead of AuthedContext to avoid unsafe cast.
    context: {
      requestId: crypto.randomUUID(),
      startTime: Date.now(),
      user: undefined,
      supabase,
    } as ORPCContext as AuthedContext,
  })
}
