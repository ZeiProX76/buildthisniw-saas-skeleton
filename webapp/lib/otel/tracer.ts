import { trace } from '@opentelemetry/api'

/** oRPC procedure tracer — spans for every procedure call */
export const orpcTracer = trace.getTracer('orpc')

/** Supabase query tracer — spans for DB operations */
export const supabaseTracer = trace.getTracer('supabase')

/** Stripe API tracer — spans for payment operations */
export const stripeTracer = trace.getTracer('stripe')

/** General app tracer — spans for business logic */
export const appTracer = trace.getTracer('app')
