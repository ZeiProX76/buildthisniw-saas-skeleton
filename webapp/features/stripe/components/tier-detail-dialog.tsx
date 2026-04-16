'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TierSummary {
  id: string
  name: string
  price: string
  priceId: string
  highlight?: boolean
  tierLevel: number
}

const TIERS_SUMMARY: TierSummary[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$49',
    priceId: 'price_1T8q3FQdFLJHO2JdRspPMO4i',
    tierLevel: 1,
  },
  {
    id: 'builder',
    name: 'Builder',
    price: '$69',
    priceId: 'price_1T8q3GQdFLJHO2JdjDmU0dLZ',
    highlight: true,
    tierLevel: 2,
  },
  {
    id: 'ship_review',
    name: 'Ship Review',
    price: '$79',
    priceId: 'price_1T8q3HQdFLJHO2JdKZycCPHy',
    tierLevel: 3,
  },
]

interface FeatureRow {
  name: string
  starter: boolean
  builder: boolean
  ship_review: boolean
}

const FEATURES: FeatureRow[] = [
  { name: 'Step titles & descriptions', starter: true, builder: true, ship_review: true },
  { name: 'Architecture overview', starter: true, builder: true, ship_review: true },
  { name: 'Market research data', starter: true, builder: true, ship_review: true },
  { name: 'AI Agentic Orchestration prompts', starter: false, builder: true, ship_review: true },
  { name: 'Visual progress tracker', starter: false, builder: true, ship_review: true },
  { name: 'Starter files zip', starter: false, builder: true, ship_review: true },
  { name: 'Copy-paste commands', starter: false, builder: true, ship_review: true },
  { name: 'AI code review', starter: false, builder: false, ship_review: true },
  { name: 'Quality report', starter: false, builder: false, ship_review: true },
]

const tierLevelMap: Record<string, number> = {
  starter: 1,
  builder: 2,
  ship_review: 3,
}

interface TierDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCheckout: (priceId: string, tier: string) => void
  currentTier: string | null
}

export function TierDetailDialog({
  open,
  onOpenChange,
  onCheckout,
  currentTier,
}: TierDetailDialogProps) {
  const currentLevel = currentTier ? (tierLevelMap[currentTier] ?? 0) : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare tiers</DialogTitle>
          <DialogDescription>
            See exactly what each tier includes for this build kit.
          </DialogDescription>
        </DialogHeader>

        {/* Desktop: comparison table */}
        <div className="hidden sm:block">
          <div className="grid grid-cols-4 gap-4">
            {/* Header row */}
            <div className="text-sm font-medium text-muted-foreground py-2">Feature</div>
            {TIERS_SUMMARY.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  'text-center py-2 rounded-t-lg',
                  tier.highlight && 'bg-primary/5',
                )}
              >
                <p className="text-sm font-semibold text-foreground">{tier.name}</p>
                <p className="text-lg font-bold tracking-tight">{tier.price}</p>
              </div>
            ))}

            {/* Feature rows */}
            {FEATURES.map((feature, i) => (
              <>
                <div
                  key={`label-${i}`}
                  className={cn(
                    'text-sm text-foreground/80 py-2.5 border-t border-border',
                  )}
                >
                  {feature.name}
                </div>
                {TIERS_SUMMARY.map((tier) => {
                  const included = feature[tier.id as 'starter' | 'builder' | 'ship_review']
                  return (
                    <div
                      key={`${tier.id}-${i}`}
                      className={cn(
                        'flex justify-center py-2.5 border-t border-border',
                        tier.highlight && 'bg-primary/5',
                      )}
                    >
                      {included ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/40" />
                      )}
                    </div>
                  )
                })}
              </>
            ))}

            {/* CTA row */}
            <div className="py-4" />
            {TIERS_SUMMARY.map((tier) => {
              const isPurchased = currentTier === tier.id
              const isLower = tier.tierLevel < currentLevel
              const isUpgrade = tier.tierLevel > currentLevel && currentLevel > 0

              return (
                <div
                  key={`cta-${tier.id}`}
                  className={cn(
                    'flex justify-center py-4',
                    tier.highlight && 'bg-primary/5 rounded-b-lg',
                  )}
                >
                  {isPurchased ? (
                    <Button variant="outline" size="sm" disabled className="opacity-60">
                      Purchased
                    </Button>
                  ) : isLower ? (
                    <span className="text-xs text-muted-foreground">Included</span>
                  ) : (
                    <Button
                      variant={tier.highlight ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        onCheckout(tier.priceId, tier.id)
                        onOpenChange(false)
                      }}
                    >
                      {isUpgrade ? `Upgrade` : `Get ${tier.name}`}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="sm:hidden space-y-6">
          {TIERS_SUMMARY.map((tier) => {
            const isPurchased = currentTier === tier.id
            const isLower = tier.tierLevel < currentLevel
            const isUpgrade = tier.tierLevel > currentLevel && currentLevel > 0

            return (
              <div
                key={tier.id}
                className={cn(
                  'rounded-lg border p-4',
                  tier.highlight
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border bg-card',
                )}
              >
                <div className="flex items-baseline justify-between mb-3">
                  <h4 className="font-semibold text-foreground">{tier.name}</h4>
                  <span className="text-lg font-bold">{tier.price}</span>
                </div>

                <ul className="space-y-2 mb-4">
                  {FEATURES.map((feature, i) => {
                    const included = feature[tier.id as 'starter' | 'builder' | 'ship_review']
                    return (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        {included ? (
                          <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                        ) : (
                          <X className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                        )}
                        <span
                          className={cn(
                            included ? 'text-foreground/80' : 'text-muted-foreground/50',
                          )}
                        >
                          {feature.name}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                {isPurchased ? (
                  <Button variant="outline" size="sm" disabled className="w-full opacity-60">
                    Purchased
                  </Button>
                ) : isLower ? (
                  <p className="text-center text-xs text-muted-foreground py-1.5">
                    Included in your plan
                  </p>
                ) : (
                  <Button
                    variant={tier.highlight ? 'default' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      onCheckout(tier.priceId, tier.id)
                      onOpenChange(false)
                    }}
                  >
                    {isUpgrade ? `Upgrade to ${tier.name}` : `Get ${tier.name}`}
                  </Button>
                )}
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
