// PROTECTED — APPEND ONLY. Add new exports for new features; do not modify existing exports.

// Context
export type { ORPCContext, ORPCUser } from './context'
export { buildContext } from './context'

// Errors
export { AppError, Errors } from './errors'
export type { AppErrorCode } from './errors'

// Contracts
export { contract } from './contracts'
export type { AppContract } from './contracts'

// Base procedures (kept for backward compat — new code should use implement(contract))
export { publicProcedure, protectedProcedure, adminProcedure } from './base'

// Secure schemas (OWASP A03: Injection prevention)
export {
  SecureShortText,
  SecureMediumText,
  SecureLongText,
  SecureEmail,
  SecurePassword,
  SecureUrl,
  SecureImageUrl,
  SecureId,
  SecureOptionalId,
  secureObject,
  extendSecureObject,
  PaginationSchema,
  SearchSchema,
  DateRangeSchema,
  optional,
  optionalText,
  BooleanParam,
} from './schemas'

// Router
export { appRouter } from './router'
export type { AppRouter } from './router'

// Analytics
export { setAnalyticsTransport, trackAnalytics } from './analytics'
export type { AnalyticsEvent } from './analytics'

// Tracing (re-export OTel utilities for convenience)
export { traced, tracedSupabaseQuery, tracedExternalApi } from '@/lib/otel'
export { orpcTracer, supabaseTracer, stripeTracer, appTracer } from '@/lib/otel'
