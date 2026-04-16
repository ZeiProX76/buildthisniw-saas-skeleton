'use client'

import { useQuery } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc/client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { SubscribeButton } from './checkout'
import { cn } from '@/lib/utils'

interface PricingTableProps {
  className?: string
}

/**
 * Pricing cards from active Stripe products
 */
export function PricingTable({ className }: PricingTableProps) {
  const { data, isLoading, error } = useQuery(
    orpc.protected.stripe.listProducts.queryOptions()
  )

  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader className="space-y-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <Skeleton className="h-10 w-32" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn('py-12 text-center', className)}>
        <p className="text-sm text-destructive">Failed to load pricing information.</p>
      </div>
    )
  }

  if (!data?.products.length) {
    return (
      <div className={cn('py-16 text-center', className)}>
        <p className="text-base font-medium text-foreground">No plans available yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pricing plans will appear here once configured.
        </p>
      </div>
    )
  }

  const isPopular = (index: number) => {
    if (data.products.length >= 3) return index === 1
    if (data.products.length === 2) return index === 1
    return false
  }

  return (
    <div className={cn('grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3', className)}>
      {data.products.map((product, index) => {
        const popular = isPopular(index)
        return (
          <Card
            key={product.id}
            className={cn(
              'relative flex flex-col transition-shadow duration-200 hover:shadow-md',
              popular && 'ring-2 ring-primary shadow-md'
            )}
          >
            {popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader className={cn('space-y-2', popular && 'pt-8')}>
              <CardTitle className="text-lg font-semibold tracking-tight">
                {product.name}
              </CardTitle>
              {product.description && (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              {product.prices.map((price, priceIdx) => (
                <div key={price.id}>
                  {priceIdx > 0 && <Separator className="mb-6" />}
                  <div className="space-y-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight text-foreground">
                        ${(price.amount / 100).toFixed(price.amount % 100 === 0 ? 0 : 2)}
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">
                        /{price.interval}
                      </span>
                    </div>
                    <SubscribeButton
                      priceId={price.id}
                      label={popular ? 'Get Started' : 'Subscribe'}
                      size={popular ? 'lg' : 'default'}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
