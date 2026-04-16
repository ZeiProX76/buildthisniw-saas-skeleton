import { SpanStatusCode } from '@opentelemetry/api'
import { os } from '@orpc/server'
import { orpcTracer } from '@/lib/otel'
import type { ORPCContext } from './context'

/**
 * oRPC tracing middleware — wraps every procedure in an OpenTelemetry span.
 *
 * Position: after contextInitMiddleware, before supabaseMiddleware.
 * This captures the full request lifecycle including DB calls as child spans.
 *
 * Design:
 * - Never throws its own errors (tracing failure must not break the app)
 * - Never logs PII (only user.id, never email/password/tokens)
 * - Follows the same fire-and-forget pattern as analytics.ts
 */
export const tracingMiddleware = os
  .$context<ORPCContext>()
  .middleware(async ({ context, path, next }) => {
    const spanName = `orpc.${path.join('.')}`

    return orpcTracer.startActiveSpan(spanName, async (span) => {
      try {
        // Set initial attributes from context
        span.setAttribute('orpc.procedure', path.join('.'))
        span.setAttribute('orpc.request_id', context.requestId)

        if (context.user?.id) {
          span.setAttribute('user.id', context.user.id)
        }
        if (context.clientIp) {
          span.setAttribute('net.peer.ip', context.clientIp)
        }

        const result = await next()

        // Mark success
        span.setAttribute('orpc.success', true)
        span.setAttribute('orpc.duration_ms', Date.now() - context.startTime)

        return result
      } catch (error) {
        // Record the error on the span but always re-throw
        try {
          span.recordException(error as Error)
          span.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message })
          span.setAttribute('orpc.success', false)
          span.setAttribute('orpc.duration_ms', Date.now() - context.startTime)
        } catch {
          // Tracing failure must never mask the original error
        }
        throw error
      } finally {
        span.end()
      }
    })
  })
