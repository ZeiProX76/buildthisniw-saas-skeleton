import type { ORPCUser } from './context'

/**
 * Shared JWT claims -> ORPCUser resolution.
 * Single source of truth — used by route handler, server caller, and action-utils.
 *
 * Previously duplicated in base.ts, server.ts, action-utils.ts, and route.ts
 * with divergent behavior (some always set role:'user', others checked is_admin).
 */
export function resolveUserFromClaims(claims: {
  sub?: string
  email?: string
  plan?: unknown
  is_admin?: unknown
  [key: string]: unknown
}): ORPCUser | undefined {
  const sub = claims.sub
  if (!sub) return undefined

  return {
    id: sub,
    email: typeof claims.email === 'string' ? claims.email : undefined,
    role: claims.is_admin === true ? 'admin' : 'user',
    plan: typeof claims.plan === 'string' ? claims.plan : 'free',
  }
}
