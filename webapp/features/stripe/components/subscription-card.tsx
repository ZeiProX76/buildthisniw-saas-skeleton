'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useSubscription } from '../hooks/use-subscription'
import { PortalButton } from './checkout'
import { PricingTable } from './pricing-table'
import { cn } from '@/lib/utils'

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  active: { label: 'Active', color: 'text-success', bgColor: 'bg-success' },
  trialing: { label: 'Trial', color: 'text-primary', bgColor: 'bg-primary' },
  past_due: { label: 'Past Due', color: 'text-destructive', bgColor: 'bg-destructive' },
  canceled: { label: 'Canceled', color: 'text-muted-foreground', bgColor: 'bg-muted-foreground' },
  incomplete: { label: 'Incomplete', color: 'text-warning', bgColor: 'bg-warning' },
  unpaid: { label: 'Unpaid', color: 'text-destructive', bgColor: 'bg-destructive' },
}

export function SubscriptionCard() {
  const { data, isLoading, error } = useSubscription()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-4 w-56" />
          <Separator />
          <Skeleton className="h-9 w-44" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-sm text-destructive">
            Unable to load subscription details. Please try again later.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!data?.subscribed || !data.subscription) {
    return (
      <div className="space-y-10">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto max-w-md space-y-4">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                Choose a plan to get started
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Unlock premium features. Select a plan that works best for you.
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Available Plans
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Simple, transparent pricing. No hidden fees.
            </p>
          </div>
          <PricingTable />
        </div>
      </div>
    )
  }

  const sub = data.subscription
  const status = statusConfig[sub.status] ?? {
    label: sub.status,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted-foreground',
  }
  const renewalDate = new Date(sub.currentPeriodEnd * 1000).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Your Subscription
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className={cn('size-2 rounded-full', status.bgColor)} />
            <span className={cn('text-xs font-medium', status.color)}>
              {status.label}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">
            {sub.productName}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              ${(sub.amount / 100).toFixed(sub.amount % 100 === 0 ? 0 : 2)}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              /{sub.interval}
            </span>
          </div>
        </div>

        <Separator />

        <p className="text-sm text-muted-foreground">
          {sub.cancelAtPeriodEnd
            ? `Cancels on ${renewalDate}`
            : `Renews on ${renewalDate}`}
        </p>

        <PortalButton label="Manage Billing" />
      </CardContent>
    </Card>
  )
}
