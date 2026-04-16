import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { CORSPlugin } from '@orpc/server/plugins'
import { RatelimitHandlerPlugin } from '@orpc/experimental-ratelimit'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { appRouter } from '@/lib/orpc/router'
import { createClient } from '@/lib/supabase/server'
import type { ORPCUser } from '@/lib/orpc/context'
import type { AuthedContext } from '@/lib/orpc/context'
import { extractClientIp } from '@/lib/orpc/context'
import { resolveUserFromClaims } from '@/lib/orpc/resolve-user'
import { runWithSentryContext } from '@/lib/orpc/sentry'

const isDev = process.env.NODE_ENV === 'development'

/**
 * oRPC OpenAPI Handler with plugins
 * SECURITY: CORS restricted to same-origin, rate limit headers enabled
 * Dev only: OpenAPI spec at /api/rpc/spec.json, Scalar UI at /api/rpc/
 */
const handler = new OpenAPIHandler(appRouter, {
  plugins: [
    // OpenAPI spec + Scalar UI (dev only — never expose API surface in production)
    ...(isDev
      ? [
          new OpenAPIReferencePlugin({
            schemaConverters: [new ZodToJsonSchemaConverter()],
            specGenerateOptions: {
              info: { title: 'Build Kit API', version: '1.0.0' },
              servers: [{ url: '/api/rpc' }],
            },
          }),
        ]
      : []),
    // SECURITY: CORS - restrict to same origin
    new CORSPlugin({
      origin: (origin: string): string => {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.PORTLESS_URL || 'http://localhost:3000'
        const allowedOrigins = [
          siteUrl,
          ...(process.env.NODE_ENV === 'development'
            ? ['http://localhost:3000', 'http://127.0.0.1:3000']
            : []),
        ]
        if (allowedOrigins.includes(origin)) {
          return origin
        }
        // Dev: allow any *.localhost origin (Portless proxy)
        if (process.env.NODE_ENV === 'development') {
          try {
            const parsed = new URL(origin)
            if (parsed.hostname.endsWith('.localhost') || parsed.hostname === 'localhost') {
              return origin
            }
          } catch {}
        }
        return ''
      },
      allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
      allowHeaders: ['Content-Type', 'Authorization'],
      maxAge: 600,
    }),
    // Add rate limit headers to responses
    new RatelimitHandlerPlugin(),
  ],
})

/**
 * Build oRPC context from request
 * SECURITY: Extract IP and User-Agent server-side (never trust client)
 */
async function buildORPCContext(request: Request): Promise<AuthedContext> {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims
  const orpcUser = claims ? resolveUserFromClaims(claims) : undefined

  // Cast to AuthedContext — public routes don't use context.user,
  // protected routes enforce auth via contract middleware
  return {
    requestId: crypto.randomUUID(),
    startTime: Date.now(),
    user: orpcUser as ORPCUser,
    supabase,
    clientIp: extractClientIp(request.headers),
    userAgent: request.headers.get('user-agent') ?? undefined,
  }
}

/**
 * GET handler for oRPC
 */
/**
 * Shared handler — wraps request in Sentry AsyncLocalStorage context
 * so concurrent requests get correct error attribution.
 */
async function handleRequest(request: Request): Promise<Response> {
  return runWithSentryContext(async () => {
    const context = await buildORPCContext(request)

    const result = await handler.handle(request, {
      prefix: '/api/rpc',
      context,
    })

    if (result?.matched) {
      return result.response
    }

    return new Response('Not Found', { status: 404 })
  })
}

/**
 * GET handler for oRPC
 */
export async function GET(request: Request): Promise<Response> {
  return handleRequest(request)
}

/**
 * POST handler for oRPC
 */
export async function POST(request: Request): Promise<Response> {
  return handleRequest(request)
}

/**
 * DELETE handler for oRPC
 */
export async function DELETE(request: Request): Promise<Response> {
  return handleRequest(request)
}

/**
 * PUT handler for oRPC
 */
export async function PUT(request: Request): Promise<Response> {
  return handleRequest(request)
}
