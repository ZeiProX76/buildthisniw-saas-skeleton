import { oc } from '@orpc/contract'
import { z } from 'zod'
import { SecureShortText, SecureUrl } from '../schemas'

const stripe = oc
  .route({ tags: ['stripe'] })
  .errors({ UNAUTHORIZED: {}, BAD_REQUEST: {}, NOT_FOUND: {} })

const PriceSchema = z.object({
  id: z.string(),
  amount: z.number(),
  currency: z.string(),
  interval: z.string(),
})

const getSubscription = stripe
  .route({ method: 'GET', path: '/protected/stripe/subscription' })
  .output(z.object({
    subscribed: z.boolean(),
    subscription: z.object({
      id: z.string(),
      status: z.string(),
      currentPeriodEnd: z.number(),
      cancelAtPeriodEnd: z.boolean(),
      productName: z.string(),
      priceId: z.string(),
      amount: z.number(),
      currency: z.string(),
      interval: z.string(),
    }).nullable(),
  }))

const listProducts = stripe
  .route({ method: 'GET', path: '/protected/stripe/products' })
  .output(z.object({
    products: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      prices: z.array(PriceSchema),
    })),
  }))

const createCheckoutSession = stripe
  .route({ method: 'POST', path: '/protected/stripe/checkout', successStatus: 201 })
  .input(z.object({
    priceId: SecureShortText.min(1),
    mode: z.enum(['subscription', 'payment']),
    successUrl: SecureUrl,
    cancelUrl: SecureUrl,
    kitSlug: SecureShortText.optional(),
    tier: SecureShortText.optional(),
  }).strict())
  .output(z.object({ url: z.string() }))

const upgradeSubscription = stripe
  .route({ method: 'POST', path: '/protected/stripe/upgrade' })
  .input(z.object({
    priceId: SecureShortText.min(1),
  }).strict())
  .output(z.object({ success: z.boolean() }))

const createPortalSession = stripe
  .route({ method: 'POST', path: '/protected/stripe/portal' })
  .input(z.object({
    returnUrl: SecureUrl,
  }).strict())
  .output(z.object({ url: z.string() }))

export default { getSubscription, listProducts, createCheckoutSession, upgradeSubscription, createPortalSession }
