'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Crown, Sparkles, Zap, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TierDetailDialog } from './tier-detail-dialog'

interface Tier {
  id: string
  name: string
  price: string
  priceId: string
  description: string
  highlight?: boolean
  icon: typeof Zap
  features: string[]
  tierLevel: number
}

const TIERS: Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$49',
    priceId: 'price_1T8q3FQdFLJHO2JdRspPMO4i',
    description: 'Idea brief + architecture overview + basic build outline',
    icon: Zap,
    features: [
      'Step titles & descriptions',
      'Architecture overview',
      'Basic build outline',
      'Market research data',
    ],
    tierLevel: 1,
  },
  {
    id: 'builder',
    name: 'Builder',
    price: '$69',
    priceId: 'price_1T8q3GQdFLJHO2JdjDmU0dLZ',
    description: 'Full AI Agentic Orchestration + visual progress tracker + zip download',
    highlight: true,
    icon: Sparkles,
    features: [
      'Everything in Starter',
      'Full AI Agentic Orchestration prompts',
      'Visual progress tracker',
      'Starter files zip download',
      'Copy-paste ready commands',
    ],
    tierLevel: 2,
  },
  {
    id: 'ship_review',
    name: 'Ship Review',
    price: '$79',
    priceId: 'price_1T8q3HQdFLJHO2JdKZycCPHy',
    description: 'Everything in Builder + AI code review of your finished product',
    icon: Crown,
    features: [
      'Everything in Builder',
      'AI-powered code review',
      'Quality report for your build',
      'Architecture recommendations',
      'Performance suggestions',
    ],
    tierLevel: 3,
  },
]

const tierLevelMap: Record<string, number> = {
  starter: 1,
  builder: 2,
  ship_review: 3,
}

interface PricingCardsProps {
  kitSlug: string
  currentTier: string | null
  onCheckout: (priceId: string, tier: string) => void
  isLoading?: boolean
}

export function PricingCards({
  currentTier,
  onCheckout,
  isLoading,
}: PricingCardsProps) {
  const [detailOpen, setDetailOpen] = useState(false)
  const currentLevel = currentTier ? (tierLevelMap[currentTier] ?? 0) : 0

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TIERS.map((tier) => {
          const isPurchased = currentTier === tier.id
          const isUpgrade = tier.tierLevel > currentLevel && currentLevel > 0
          const isLower = tier.tierLevel < currentLevel
          const Icon = tier.icon

          return (
            <div
              key={tier.id}
              className={cn(
                'relative rounded-2xl border bg-card p-8 flex flex-col',
                'transition-all duration-300 hover:-translate-y-1',
                tier.highlight && !isPurchased
                  ? 'border-primary/50 ring-2 ring-primary/30 shadow-xl shadow-primary/10'
                  : isPurchased
                    ? 'border-primary/50 ring-2 ring-primary/30 shadow-xl shadow-primary/10'
                    : 'border-border shadow-sm',
              )}
            >
              {isPurchased && (
                <span className="inline-block self-start text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1 mb-4">
                  Purchased
                </span>
              )}

              {tier.highlight && !isPurchased && (
                <span className="inline-block self-start text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1 mb-4">
                  Most popular
                </span>
              )}

              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">
                  {tier.name}
                </h3>
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  {tier.price}
                </span>
                <span className="text-sm text-muted-foreground">one-time</span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {tier.description}
              </p>

              <div className="my-6 h-px bg-border" />

              <ul className="space-y-3 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setDetailOpen(true)}
                className="mt-4 text-xs text-primary underline-offset-4 hover:underline flex items-center gap-1"
              >
                See what you get
                <ArrowRight className="h-3 w-3" />
              </button>

              <div className="mt-4">
                {isPurchased ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full pointer-events-none opacity-60"
                    disabled
                  >
                    Purchased
                  </Button>
                ) : isLower ? (
                  <p className="text-center text-sm text-muted-foreground py-2.5">
                    Included in your plan
                  </p>
                ) : isUpgrade ? (
                  <Button
                    variant={tier.highlight ? 'default' : 'outline'}
                    size="lg"
                    className="w-full"
                    onClick={() => onCheckout(tier.priceId, tier.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : `Upgrade to ${tier.name}`}
                  </Button>
                ) : (
                  <Button
                    variant={
                      tier.highlight
                        ? 'default'
                        : tier.id === 'ship_review'
                          ? 'default'
                          : 'outline'
                    }
                    size="lg"
                    className="w-full"
                    onClick={() => onCheckout(tier.priceId, tier.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : `Get ${tier.name}`}
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <TierDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onCheckout={onCheckout}
        currentTier={currentTier}
      />
    </>
  )
}
