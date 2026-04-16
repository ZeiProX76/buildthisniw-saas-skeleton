import type { SupabaseClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

/**
 * User context extracted from JWT
 */
export interface ORPCUser {
  id: string
  email?: string
  role: 'user' | 'admin'
  plan: string // from JWT claim, defaults to 'free'
}

/**
 * Generic oRPC context that works for any app
 */
export interface ORPCContext {
  requestId: string
  startTime: number
  user?: ORPCUser
  session?: unknown
  supabase?: SupabaseClient
  /** Client IP address for rate limiting and security */
  clientIp?: string
  /** User-Agent for session binding */
  userAgent?: string
}

/**
 * Context after middleware has resolved supabase client.
 * Use this as $context type in implement() calls.
 */
export interface ResolvedContext extends ORPCContext {
  supabase: SupabaseClient
}

/**
 * Context after auth middleware has resolved user.
 * Use this for protected procedure implementations.
 */
export interface AuthedContext extends ResolvedContext {
  user: ORPCUser
}

/**
 * Extract client IP from request headers
 * Handles various proxy configurations
 */
export function extractClientIp(headers: Headers): string | undefined {
  // Check various headers in order of preference
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first (original client)
    return forwardedFor.split(',')[0]?.trim()
  }

  const realIp = headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  const cfConnectingIp = headers.get('cf-connecting-ip') // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp.trim()
  }

  return undefined
}

/**
 * Context builder for server-side calls
 */
export async function buildContext(
  options: {
    supabase?: SupabaseClient
    user?: ORPCUser
    headers?: Headers
  } = {},
): Promise<ORPCContext> {
  return {
    requestId: randomUUID(),
    startTime: Date.now(),
    user: options.user,
    supabase: options.supabase,
    clientIp: options.headers ? extractClientIp(options.headers) : undefined,
    userAgent: options.headers?.get('user-agent') ?? undefined,
  }
}

/**
 * Next function type for middleware
 */
type MiddlewareNext = (opts: { context: Partial<ORPCContext> }) => Promise<unknown>

/**
 * Middleware params type
 */
interface MiddlewareParams {
  next: MiddlewareNext
}

/**
 * Context initialization middleware - sets up timing and request ID
 */
export function createContextInitMiddleware(): (params: MiddlewareParams) => Promise<unknown> {
  return async ({ next }: MiddlewareParams): Promise<unknown> => {
    return next({
      context: {
        requestId: randomUUID(),
        startTime: Date.now(),
      },
    })
  }
}
