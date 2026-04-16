/**
 * Subscription status from stripe.subscriptions
 */
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'past_due'
  | 'paused'
  | 'trialing'
  | 'unpaid'

/**
 * Payment status from checkout sessions
 */
export type PaymentStatus = 'paid' | 'unpaid' | 'no_payment_required'

/**
 * Checkout mode
 */
export type CheckoutMode = 'payment' | 'subscription' | 'setup'

/**
 * Subscription data returned from API
 */
export interface UserSubscription {
  id: string
  status: SubscriptionStatus
  currentPeriodEnd: number
  cancelAtPeriodEnd: boolean
  productId: string
  productName: string
  priceId: string
  amount: number
  currency: string
  interval: 'month' | 'year' | 'week' | 'day'
}

/**
 * Product with prices for display
 */
export interface ProductWithPrices {
  id: string
  name: string
  description: string | null
  prices: {
    id: string
    amount: number
    currency: string
    interval: 'month' | 'year' | 'week' | 'day'
  }[]
}
