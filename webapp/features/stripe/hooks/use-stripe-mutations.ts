'use client'

import { useMutation } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc/client'

/**
 * Create a Stripe Checkout session via oRPC → edge function.
 * Returns a Stripe Checkout URL for subscription or one-time payment.
 */
export function useCheckoutMutation() {
  return useMutation(orpc.protected.stripe.createCheckoutSession.mutationOptions())
}

/**
 * Upgrade an existing subscription in-place via oRPC → edge function.
 * No redirect — updates the subscription directly with proration.
 */
export function useUpgradeMutation() {
  return useMutation(orpc.protected.stripe.upgradeSubscription.mutationOptions())
}

/**
 * Create a Stripe Customer Portal session via oRPC → edge function.
 * Returns a Stripe Customer Portal URL.
 */
export function usePortalMutation() {
  return useMutation(orpc.protected.stripe.createPortalSession.mutationOptions())
}
