import { MemoryRatelimiter } from '@orpc/experimental-ratelimit/memory'
import type { Ratelimiter } from '@orpc/experimental-ratelimit'
import { createRatelimitMiddleware } from '@orpc/experimental-ratelimit'
import { ORPCError } from '@orpc/server'
import type { ORPCContext } from './context'

/**
 * Rate limiter configuration
 * In production, switch to Redis or Upstash for distributed rate limiting
 */
const createRateLimiter = (): Ratelimiter => {
  // For production, use Redis or Upstash:
  // import { RedisRatelimiter } from '@orpc/experimental-ratelimit/redis'
  // import { UpstashRatelimiter } from '@orpc/experimental-ratelimit/upstash-ratelimit'

  return new MemoryRatelimiter({
    maxRequests: 100, // 100 requests per window
    window: 60000, // 60 seconds
  })
}

/**
 * Auth rate limiter - stricter limits for auth endpoints
 */
export const authRateLimiter = new MemoryRatelimiter({
  maxRequests: 10, // 10 auth attempts per window
  window: 60000, // 60 seconds
})

/**
 * General API rate limiter
 */
export const apiRateLimiter = createRateLimiter()

/**
 * Get rate limit key - prefers IP, falls back to user ID, then request ID
 */
function getRateLimitKey(ctx: ORPCContext, prefix: string): string {
  // NEVER trust client-side data - prefer IP for unauthenticated requests
  if (ctx.clientIp) {
    return `${prefix}:ip:${ctx.clientIp}`
  }
  if (ctx.user?.id) {
    return `${prefix}:user:${ctx.user.id}`
  }
  // Fallback to request ID (least preferred, but better than nothing)
  return `${prefix}:req:${ctx.requestId}`
}

/**
 * Create rate limit middleware for auth procedures
 * Key: IP address (preferred) or user ID
 */
export const authRateLimitMiddleware = createRatelimitMiddleware({
  limiter: () => authRateLimiter,
  key: ({ context }) => getRateLimitKey(context as ORPCContext, 'auth'),
})

/**
 * Create rate limit middleware for protected procedures
 * Key: User ID (always available for protected routes)
 */
export const protectedRateLimitMiddleware = createRatelimitMiddleware({
  limiter: () => apiRateLimiter,
  key: ({ context }) => {
    const ctx = context as ORPCContext
    // Protected routes always have a user
    return `api:user:${ctx.user?.id ?? 'unknown'}`
  },
})

/**
 * Create rate limit middleware for public procedures
 * Key: IP address (from headers) - NEVER trust client
 */
export const publicRateLimitMiddleware = createRatelimitMiddleware({
  limiter: () => apiRateLimiter,
  key: ({ context }) => getRateLimitKey(context as ORPCContext, 'public'),
})

/**
 * Custom rate limit error - sanitized for client
 * SECURITY: Don't expose internal rate limit details to client
 */
export class RateLimitError extends ORPCError<'TOO_MANY_REQUESTS', { message: string }> {
  constructor(_limit: number, _remaining: number, _reset: number) {
    super('TOO_MANY_REQUESTS', {
      data: {
        message: 'Too many requests. Please try again later.',
      },
    })
  }
}
