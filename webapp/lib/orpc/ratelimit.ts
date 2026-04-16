/**
 * Rate limiting for oRPC procedures using Upstash Redis.
 *
 * Toggle: set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to enable.
 * When env vars are missing, rate limiting is completely disabled (no-op).
 *
 * Tiers:
 *   - public:    60 req/min per IP
 *   - auth:      10 req/min per IP (brute force protection)
 *   - protected: 120 req/min per user ID
 */
import { createRatelimitMiddleware } from '@orpc/experimental-ratelimit'
import { UpstashRatelimiter } from '@orpc/experimental-ratelimit/upstash-ratelimit'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { Ratelimiter } from '@orpc/experimental-ratelimit'
import type { ORPCContext } from './context'

// ---------------------------------------------------------------------------
// Limiter creation
// ---------------------------------------------------------------------------

function createUpstashLimiter(maxRequests: number, windowSeconds: number): Ratelimiter | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) return null

  const redis = new Redis({ url, token })
  const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
    prefix: 'app:ratelimit:',
  })

  return new UpstashRatelimiter(ratelimit)
}

// Singleton limiters — created once, reused across requests
let _publicLimiter: Ratelimiter | null | undefined
let _authLimiter: Ratelimiter | null | undefined
let _protectedLimiter: Ratelimiter | null | undefined

function getPublicLimiter(): Ratelimiter | null {
  if (_publicLimiter === undefined) _publicLimiter = createUpstashLimiter(60, 60)
  return _publicLimiter
}

function getAuthLimiter(): Ratelimiter | null {
  if (_authLimiter === undefined) _authLimiter = createUpstashLimiter(10, 60)
  return _authLimiter
}

function getProtectedLimiter(): Ratelimiter | null {
  if (_protectedLimiter === undefined) _protectedLimiter = createUpstashLimiter(120, 60)
  return _protectedLimiter
}

// ---------------------------------------------------------------------------
// Middleware factories
// ---------------------------------------------------------------------------

/**
 * Rate limit by client IP — for public routes (60 req/min)
 * Returns undefined when rate limiting is disabled (no env vars)
 */
export function createPublicRatelimit() {
  const limiter = getPublicLimiter()
  if (!limiter) return undefined

  return createRatelimitMiddleware<ORPCContext>({
    limiter: () => limiter,
    key: ({ context }) => `public:${context.clientIp ?? 'anonymous'}`,
  })
}

/**
 * Rate limit by client IP — for auth routes (10 req/min, strict)
 * Returns undefined when rate limiting is disabled (no env vars)
 */
export function createAuthRatelimit() {
  const limiter = getAuthLimiter()
  if (!limiter) return undefined

  return createRatelimitMiddleware<ORPCContext>({
    limiter: () => limiter,
    key: ({ context }) => `auth:${context.clientIp ?? 'anonymous'}`,
  })
}

/**
 * Create a custom rate limiter for per-endpoint stricter limits.
 * Returns undefined when rate limiting is disabled (no env vars).
 * Usage: protectedProcedure.use(createCustomRatelimit(10, 3600)).input(...).handler(...)
 */
export function createCustomRatelimit(maxRequests: number, windowSeconds: number) {
  const limiter = createUpstashLimiter(maxRequests, windowSeconds)
  if (!limiter) return undefined

  return createRatelimitMiddleware<ORPCContext>({
    limiter: () => limiter,
    key: ({ context }) => `custom:${context.user?.id ?? context.clientIp ?? 'anonymous'}`,
  })
}

/**
 * Rate limit by user ID — for protected routes (120 req/min)
 * Falls back to IP if user is somehow not available
 * Returns undefined when rate limiting is disabled (no env vars)
 */
export function createProtectedRatelimit() {
  const limiter = getProtectedLimiter()
  if (!limiter) return undefined

  return createRatelimitMiddleware<ORPCContext>({
    limiter: () => limiter,
    key: ({ context }) => `protected:${context.user?.id ?? context.clientIp ?? 'anonymous'}`,
  })
}
