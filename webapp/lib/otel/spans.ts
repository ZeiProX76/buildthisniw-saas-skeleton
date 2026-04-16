import { type Tracer, SpanStatusCode } from '@opentelemetry/api'
import { supabaseTracer, appTracer } from './tracer'

/**
 * Generic span wrapper — works for any async operation.
 * Automatically records exceptions and sets error status on failure.
 */
export async function traced<T>(
  tracer: Tracer,
  name: string,
  fn: () => Promise<T>,
  attributes?: Record<string, string | number | boolean>,
): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    if (attributes) {
      for (const [k, v] of Object.entries(attributes)) {
        span.setAttribute(k, v)
      }
    }
    try {
      const result = await fn()
      return result
    } catch (error) {
      span.recordException(error as Error)
      span.setStatus({ code: SpanStatusCode.ERROR, message: (error as Error).message })
      throw error
    } finally {
      span.end()
    }
  })
}

/**
 * Traced Supabase query — adds db.system and db.operation attributes.
 */
export async function tracedSupabaseQuery<T>(
  operation: string,
  table: string,
  fn: () => Promise<T>,
): Promise<T> {
  return traced(supabaseTracer, `supabase.${operation} ${table}`, fn, {
    'db.system': 'postgresql',
    'db.operation': operation,
    'db.sql.table': table,
  })
}

/**
 * Traced external API call — adds http.method and url attributes.
 * Never includes request/response bodies or auth headers.
 */
export async function tracedExternalApi<T>(
  method: string,
  url: string,
  fn: () => Promise<T>,
): Promise<T> {
  return traced(appTracer, `http.${method} ${new URL(url).hostname}`, fn, {
    'http.method': method,
    'http.url': url,
  })
}
