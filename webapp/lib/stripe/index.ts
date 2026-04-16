import Stripe from 'stripe'

/**
 * Stripe client singleton (lazy)
 * Server-side only - requires STRIPE_SECRET_KEY
 * API Version: 2025-09-30.clover (v19)
 */
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set')
    }
    _stripe = new Stripe(key, {
      // @ts-expect-error -- pinned to 2025-09-30 until migration
      apiVersion: '2025-09-30.clover',
      typescript: true,
    })
  }
  return _stripe
}

/** @deprecated Use getStripe() — kept for backward compat */
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

/**
 * Get or create a Stripe customer for a user
 * Stores user_id in metadata for linking
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string | undefined
): Promise<Stripe.Customer> {
  // Search by metadata
  const existing = await stripe.customers.search({
    query: `metadata["user_id"]:"${userId}"`,
    limit: 1,
  })

  if (existing.data[0]) {
    return existing.data[0]
  }

  // Create new customer
  return stripe.customers.create({
    email,
    metadata: { user_id: userId },
  })
}

/**
 * Get customer by user_id
 */
export async function getCustomerByUserId(
  userId: string
): Promise<Stripe.Customer | null> {
  const customers = await stripe.customers.search({
    query: `metadata["user_id"]:"${userId}"`,
    limit: 1,
  })
  return customers.data[0] ?? null
}
