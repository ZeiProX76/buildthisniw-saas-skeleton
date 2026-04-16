// PROTECTED — READ ONLY. Do not modify the middleware chain. Feature logic goes in procedures/.
import { os, onError } from '@orpc/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import type { ORPCContext, ORPCUser } from './context'
import { Errors } from './errors'
import { createSentryMiddleware, setSentryContext, runWithSentryContext } from './sentry'
import { resolveUserFromClaims } from './resolve-user'
import { trackAnalytics } from './analytics'
import { tracingMiddleware } from './tracing'
import { publicRateLimitMiddleware, protectedRateLimitMiddleware, authRateLimitMiddleware } from './rate-limit'

/**
 * Base procedure with initial context type
 */
const base = os.$context<ORPCContext>()

/**
 * Context initialization middleware
 * Sets requestId and startTime for tracking
 */
const contextInitMiddleware = base.middleware(async ({ context, next, path }) => {
  const newContext = {
    requestId: crypto.randomUUID(),
    startTime: Date.now(),
  }

  // Set Sentry context for tracing
  setSentryContext({ ...context, ...newContext }, path)

  return next({ context: newContext })
})

/**
 * Supabase client middleware (dedupe pattern)
 * Avoids redundant DB connections when procedures call each other
 */
const supabaseMiddleware = base
  .$context<{ supabase?: SupabaseClient }>()
  .middleware(async ({ context, next }) => {
    const supabase = context.supabase ?? (await createClient())
    return next({ context: { supabase } })
  })

/**
 * Auth middleware
 * Extracts user from Supabase session and adds to context
 */
const authMiddleware = base.middleware(async ({ context, next }) => {
  // Skip if user already resolved by route handler (avoids duplicate getClaims())
  if (context.user?.id) {
    return next({ context })
  }

  // Resolve user from Supabase JWT claims
  if (context.supabase) {
    const { data: claimsData } = await context.supabase.auth.getClaims()
    const claims = claimsData?.claims
    if (claims) {
      const orpcUser = resolveUserFromClaims(claims)
      if (orpcUser) {
        return next({ context: { user: orpcUser } })
      }
    }
  }

  return next({})
})

/**
 * Require authentication - throws if no user
 */
const requireAuthMiddleware = base
  .$context<{ user?: ORPCUser }>()
  .middleware(async ({ context, next }) => {
    if (!context.user) {
      throw Errors.unauthorized()
    }
    return next()
  })

/**
 * Require admin role - throws if not admin
 */
const requireAdminMiddleware = base
  .$context<{ user?: ORPCUser }>()
  .middleware(async ({ context, next }) => {
    if (!context.user) {
      throw Errors.unauthorized()
    }
    if (context.user.role !== 'admin') {
      throw Errors.forbidden('Admin access required')
    }
    return next()
  })

/**
 * Logging middleware - logs success
 * Note: In production, use structured logging or observability tools
 */
const loggingMiddleware = base.middleware(async ({ context, path, next }) => {
  const ctx = context as ORPCContext
  try {
    const result = await next()
    // eslint-disable-next-line no-console
    console.debug(`[oRPC] ${path.join('.')} - Success (${Date.now() - ctx.startTime}ms)`)
    return result
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
     
    console.error(`[oRPC] ${path.join('.')} - Error (${Date.now() - ctx.startTime}ms): ${message}`)
    throw error
  }
})

/**
 * Analytics middleware - fires on every request (success or error)
 */
const analyticsMiddleware = base.middleware(async ({ context, path, next }) => {
  const ctx = context as ORPCContext
  let success = true
  try {
    const result = await next()
    return result
  } catch (error) {
    success = false
    throw error
  } finally {
    // Fire-and-forget analytics
    void trackAnalytics({
      path: path.join('.'),
      userId: ctx.user?.id,
      durationMs: Date.now() - ctx.startTime,
      success,
      requestId: ctx.requestId,
    })
  }
})

/**
 * Build the public procedure with all middleware
 * SECURITY: Rate limiting by IP address
 * Note: Request integrity validation happens at API route level
 */
export const publicProcedure = base
  // Context initialization
  .use(contextInitMiddleware)
  // OTel tracing — wraps entire downstream chain
  .use(tracingMiddleware)
  // Supabase client
  .use(supabaseMiddleware)
  // SECURITY: Rate limiting (by IP for public routes)
  .use(publicRateLimitMiddleware)
  // Error handling with Sentry
  .use(
    onError((error) => {
      createSentryMiddleware()(error)
    }),
  )
  // Success tracking
  .use(loggingMiddleware)
  // Analytics (always runs)
  .use(analyticsMiddleware)

/**
 * AUTH PROCEDURE
 * Stricter rate limiting for authentication endpoints
 * SECURITY: 10 requests per minute (prevents brute force)
 */
export const authProcedure = publicProcedure
  // SECURITY: Stricter rate limit for auth endpoints
  .use(authRateLimitMiddleware)

/**
 * PROTECTED PROCEDURE
 * Authentication required
 * SECURITY: Rate limiting by user ID
 */
export const protectedProcedure = publicProcedure
  .use(authMiddleware)
  .use(requireAuthMiddleware)
  // SECURITY: Additional rate limit for authenticated users
  .use(protectedRateLimitMiddleware)

/**
 * ADMIN PROCEDURE
 * Admin role required
 */
export const adminProcedure = protectedProcedure.use(requireAdminMiddleware)

/**
 * PAID PROCEDURE
 * Requires any paid plan — free users get 403
 * Use for: write operations that free users cannot access (e.g. favorites.toggle)
 */
const requirePaidMiddleware = base
  .$context<{ user?: ORPCUser }>()
  .middleware(async ({ context, next }) => {
    if (!context.user) {
      throw Errors.unauthorized()
    }
    if (context.user.plan === 'free') {
      throw Errors.forbidden('Upgrade to a paid plan to access this feature')
    }
    return next()
  })

export const paidProcedure = protectedProcedure.use(requirePaidMiddleware)

/**
 * Export base for custom procedure builders
 */
export { base as procedureBuilder }
