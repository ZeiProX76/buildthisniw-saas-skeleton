'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCheckoutMutation, usePortalMutation } from '../hooks/use-stripe-mutations'

interface SubscribeButtonProps {
  priceId: string
  label?: string
  className?: string
  size?: 'default' | 'xs' | 'sm' | 'lg'
}

/**
 * Subscribe button — redirects to Stripe Checkout (subscription mode)
 */
export function SubscribeButton({
  priceId,
  label = 'Subscribe',
  className,
  size = 'default',
}: SubscribeButtonProps) {
  const checkout = useCheckoutMutation()

  const handleClick = async () => {
    const result = await checkout.mutateAsync({
      priceId,
      mode: 'subscription',
      successUrl: `${window.location.origin}/protected/billing?success=true`,
      cancelUrl: `${window.location.origin}/protected/billing`,
    })
    if (result.url) window.location.href = result.url
  }

  return (
    <Button
      onClick={handleClick}
      disabled={checkout.isPending}
      variant="default"
      size={size}
      className={cn('min-w-[120px]', className)}
    >
      {checkout.isPending ? (
        <span className="flex items-center gap-2">
          <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading</span>
        </span>
      ) : (
        label
      )}
    </Button>
  )
}

interface PortalButtonProps {
  label?: string
  className?: string
  size?: 'default' | 'xs' | 'sm' | 'lg'
}

/**
 * Customer portal button — manage subscription, invoices, payment methods
 */
export function PortalButton({
  label = 'Manage Billing',
  className,
  size = 'default',
}: PortalButtonProps) {
  const portal = usePortalMutation()

  const handleClick = async () => {
    const result = await portal.mutateAsync({
      returnUrl: `${window.location.origin}/protected/billing`,
    })
    if (result.url) window.location.href = result.url
  }

  return (
    <Button
      onClick={handleClick}
      disabled={portal.isPending}
      variant="outline"
      size={size}
      className={cn(className)}
    >
      {portal.isPending ? (
        <span className="flex items-center gap-2">
          <span className="inline-block size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading</span>
        </span>
      ) : (
        label
      )}
    </Button>
  )
}
