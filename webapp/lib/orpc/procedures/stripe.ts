import { z } from 'zod'
import { protectedProcedure } from '../base'
import { Errors } from '../errors'
import { SecureShortText, SecureUrl, secureObject } from '../schemas'
import { getStripe } from '@/lib/stripe'

// ─────────────────────────────────────────────────────────────
// READS — security definer functions via supabase.rpc()
// ─────────────────────────────────────────────────────────────

/**
 * Get current user's subscription
 * Double-gated: oRPC middleware + Postgres auth.uid() check
 */
export const getSubscription = protectedProcedure
  .route({ method: 'GET', path: '/protected/stripe/subscription' })
  .handler(async ({ context }) => {
  const { data, error } = await context.supabase.rpc('get_my_subscription')
  if (error) { console.error("[stripe] operation failed:", error); throw Errors.internal("Operation failed") }
  return data as { subscribed: boolean; subscription: {
    id: string; status: string; currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean; productName: string; priceId: string;
    amount: number; currency: string; interval: string;
  } | null }
})

/**
 * List active products with prices
 */
export const listProducts = protectedProcedure
  .route({ method: 'GET', path: '/protected/stripe/products' })
  .handler(async ({ context }) => {
  const { data, error } = await context.supabase.rpc('list_active_products')
  if (error) { console.error("[stripe] operation failed:", error); throw Errors.internal("Operation failed") }
  return data as {
    products: { id: string; name: string; description: string | null;
      prices: { id: string; amount: number; currency: string; interval: string }[] }[];
  }
})

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Resolve Stripe customer ID for a user.
 * 1. DB lookup via RPC (instant)
 * 2. Create new customer (if not found)
 *
 * SECURITY: No Stripe search fallback — prevents account enumeration
 */
async function resolveCustomerId(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  userId: string,
  email: string | undefined,
): Promise<string> {
  const stripe = getStripe()

  // 1. DB lookup (instant, no lag)
  const { data: resolvedCustomer } = await supabase.rpc(
    '_stripe_resolve_customer_id',
    { p_user_id: userId },
  )
  if (resolvedCustomer) return resolvedCustomer as string

  // 2. Create new customer (no search fallback — prevents enumeration)
  const customer = await stripe.customers.create({
    email,
    metadata: { user_id: userId },
  })
  return customer.id
}

/**
 * Validate that a URL belongs to our application domain.
 * SECURITY: Prevents open redirect attacks via Stripe success/cancel URLs.
 */
function validateAppUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.PORTLESS_URL || 'http://localhost:3000'
    const allowed = new URL(siteUrl)
    if (parsed.host === allowed.host) return true
    // In dev, also accept localhost and *.localhost (Portless)
    if (process.env.NODE_ENV !== 'production' && parsed.hostname.endsWith('.localhost')) return true
    if (process.env.NODE_ENV !== 'production' && parsed.hostname === 'localhost') return true
    return false
  } catch {
    return false
  }
}

/** Valid tiers for kit purchases */
const VALID_TIERS = ['starter', 'builder', 'ship_review'] as const

// ─────────────────────────────────────────────────────────────
// WRITES — call Stripe directly (no edge functions needed)
// ─────────────────────────────────────────────────────────────

/**
 * Create a Stripe Checkout session.
 * Auth is handled by oRPC protectedProcedure middleware.
 */
export const createCheckoutSession = protectedProcedure
  .route({ method: 'POST', path: '/protected/stripe/checkout', successStatus: 201 })
  .input(
    secureObject({
      priceId: SecureShortText.min(1),
      mode: z.enum(['subscription', 'payment']),
      successUrl: SecureUrl,
      cancelUrl: SecureUrl,
      kitSlug: SecureShortText.optional(),
      tier: SecureShortText.optional(),
    })
  )
  .handler(async ({ context, input }) => {
    const stripe = getStripe()
    const user = context.user!

    // SECURITY: Validate redirect URLs belong to our domain
    if (!validateAppUrl(input.successUrl)) {
      throw Errors.badRequest('Success URL must be on your application domain')
    }
    if (!validateAppUrl(input.cancelUrl)) {
      throw Errors.badRequest('Cancel URL must be on your application domain')
    }

    // SECURITY: Validate tier is a known value (prevents tier escalation)
    if (input.tier && !VALID_TIERS.includes(input.tier as typeof VALID_TIERS[number])) {
      throw Errors.badRequest('Invalid tier')
    }

    // SECURITY: Validate price belongs to our product catalog and matches tier
    const price = await stripe.prices.retrieve(input.priceId, { expand: ['product'] })
    if (!price.active) {
      throw Errors.badRequest('This price is no longer available')
    }
    const product = price.product as { active?: boolean; metadata?: Record<string, string> }
    if (!product.active) {
      throw Errors.badRequest('This product is no longer available')
    }

    // SECURITY: Tier MUST come from product metadata (server-controlled)
    // Never trust client-supplied tier — it enables tier escalation via cheap price
    if (input.tier) {
      if (!product.metadata?.tier) {
        throw Errors.badRequest('Product is not configured with a tier')
      }
      if (product.metadata.tier !== input.tier) {
        throw Errors.badRequest('Tier does not match the selected price')
      }
    }
    // Build metadata from validated server-side data only
    const tier = product.metadata?.tier
    const metadata = {
      user_id: user.id,
      ...(input.kitSlug ? { kit_slug: input.kitSlug } : {}),
      ...(tier ? { tier } : {}),
    }

    const customerId = await resolveCustomerId(context.supabase, user.id, user.email)

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: input.mode,
      line_items: [{ price: input.priceId, quantity: 1 }],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      metadata,
      ...(input.mode === 'subscription'
        ? { subscription_data: { metadata: { user_id: user.id } } }
        : { payment_intent_data: { metadata } }),
    })

    return { url: session.url! }
  })

/**
 * Upgrade an existing subscription in-place.
 * No redirect — updates the subscription directly with proration.
 */
export const upgradeSubscription = protectedProcedure
  .route({ method: 'POST', path: '/protected/stripe/upgrade' })
  .input(
    secureObject({
      priceId: SecureShortText.min(1),
    })
  )
  .handler(async ({ context, input }) => {
    const stripe = getStripe()
    const user = context.user!

    const customerId = await resolveCustomerId(context.supabase, user.id, user.email)

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    })
    if (!subscriptions.data[0]) {
      throw Errors.notFound('No active subscription found to upgrade.')
    }

    const subscription = subscriptions.data[0]
    const itemId = subscription.items.data[0]?.id
    if (!itemId) {
      throw Errors.internal('No subscription item found.')
    }

    await stripe.subscriptions.update(subscription.id, {
      items: [{ id: itemId, price: input.priceId }],
      proration_behavior: 'create_prorations',
    })

    return { success: true }
  })

/**
 * Create a Stripe Customer Portal session.
 */
export const createPortalSession = protectedProcedure
  .route({ method: 'POST', path: '/protected/stripe/portal' })
  .input(
    secureObject({
      returnUrl: SecureUrl,
    })
  )
  .handler(async ({ context, input }) => {
    const stripe = getStripe()
    const user = context.user!

    // SECURITY: Validate return URL belongs to our domain
    if (!validateAppUrl(input.returnUrl)) {
      throw Errors.badRequest('Return URL must be on your application domain')
    }

    const customerId = await resolveCustomerId(context.supabase, user.id, user.email)

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: input.returnUrl,
    })

    return { url: session.url }
  })

// ─────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────

export const stripeRouter = {
  getSubscription,
  listProducts,
  createCheckoutSession,
  upgradeSubscription,
  createPortalSession,
}
