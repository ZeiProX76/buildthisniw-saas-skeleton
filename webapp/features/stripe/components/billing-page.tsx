'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Check, Crown, Sparkles, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCheckoutMutation, useUpgradeMutation, usePortalMutation } from '../hooks/use-stripe-mutations'
import { refreshClaims } from '@/lib/auth/refresh'
import { useCredits } from '@/features/credits'
import { CREDIT_CONFIG, isUnlimited } from '@/lib/credits/config'

type PlanMode = 'subscription' | 'payment'

interface Plan {
  id: string
  name: string
  price: string
  period: string
  description: string
  stripePriceId: string
  mode: PlanMode
  tier: number
  icon: typeof Zap
  features: string[]
  highlight?: boolean
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Daily ideas. Full research. Templates.',
    stripePriceId: 'price_1T5QKUQdFLJHO2Jd89LUmqgr',
    mode: 'subscription',
    tier: 0,
    icon: Zap,
    features: [
      'Daily ideas at 8 AM',
      'Full market research',
      '48h build blueprints',
      'Starter templates',
      'Priority community',
      'Revenue playbook',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$79',
    period: '/month',
    description: 'Ship together, faster.',
    stripePriceId: 'price_1T5QKVQdFLJHO2JdoP4s4TgA',
    mode: 'subscription',
    tier: 1,
    icon: Sparkles,
    highlight: true,
    features: [
      'Everything in Starter',
      'Up to 5 members',
      'Custom idea briefs',
      'Team collaboration',
      'API access',
      'Dedicated support',
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: '$199',
    period: 'one-time',
    description: 'Pay once. Access everything. Forever.',
    stripePriceId: 'price_1T6J3ZQdFLJHO2Jdc15kqP9Z',
    mode: 'payment',
    tier: 2,
    icon: Crown,
    features: [
      'Everything in Pro',
      'Lifetime access',
      'All future updates',
      'No recurring charges',
      'Founding member perks',
      'Priority everything',
    ],
  },
]

const tierMap: Record<string, number> = {
  starter: 0,
  pro: 1,
  lifetime: 2,
}

function CreditBalanceSection() {
  const { data: balances, isLoading } = useCredits()

  if (isLoading) {
    return (
      <div className="mb-10 rounded-2xl border border-border bg-card p-6">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-muted" />
      </div>
    )
  }

  if (!balances || balances.length === 0) return null

  return (
    <div className="mb-10 space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Credit Usage</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {balances.map((b) => {
          const config = CREDIT_CONFIG[b.creditType]
          const label = config?.label ?? b.creditType
          const unlimited = isUnlimited(b.allocation)
          const percentage = unlimited ? 100 : Math.round((b.balance / b.allocation) * 100)

          return (
            <div
              key={b.creditType}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="text-xs text-muted-foreground">
                  {unlimited ? 'Unlimited' : `${b.balance} / ${b.allocation}`}
                </span>
              </div>
              <Progress
                value={percentage}
                className="mt-3"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {unlimited
                  ? 'Unlimited usage'
                  : `Resets every ${b.period}`}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function BillingPage({ currentPlan }: { currentPlan: string }) {
  const checkout = useCheckoutMutation()
  const upgrade = useUpgradeMutation()
  const portal = usePortalMutation()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentTier = tierMap[currentPlan] ?? 0

  // After successful Stripe payment, refresh JWT claims and clean URL
  useEffect(() => {
    if (searchParams.get('success') !== 'true') return
    void (async () => {
      await refreshClaims()
      router.refresh()
      window.history.replaceState({}, '', '/protected/billing')
    })()
  }, [searchParams, router])

  const handleManageBilling = async () => {
    const result = await portal.mutateAsync({
      returnUrl: `${window.location.origin}/protected/billing`,
    })
    if (result.url) window.location.href = result.url
  }

  const handleUpgrade = async (plan: Plan) => {
    if (plan.mode === 'payment' || currentTier === 0) {
      // New checkout: first subscription or lifetime one-time payment
      const result = await checkout.mutateAsync({
        priceId: plan.stripePriceId,
        mode: plan.mode,
        successUrl: `${window.location.origin}/protected/billing?success=true`,
        cancelUrl: `${window.location.origin}/protected/billing`,
      })
      if (result.url) window.location.href = result.url
    } else {
      // In-place subscription upgrade (Starter → Pro)
      await upgrade.mutateAsync({ priceId: plan.stripePriceId })
      await refreshClaims()
      router.refresh()
    }
  }

  const isPending = checkout.isPending || upgrade.isPending

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          <button
            onClick={handleManageBilling}
            className="text-primary underline-offset-4 hover:underline"
            disabled={portal.isPending}
          >
            {portal.isPending ? 'Loading...' : 'Manage billing, invoices & payment methods'}
          </button>
        </p>
      </div>

      <CreditBalanceSection />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan
          const isUpgrade = plan.tier > currentTier
          const isLower = plan.tier < currentTier
          const Icon = plan.icon

          return (
            <div
              key={plan.id}
              className={cn(
                'relative rounded-2xl border bg-card p-8 flex flex-col',
                'transition-all duration-300 hover:-translate-y-1',
                plan.highlight && !isCurrent
                  ? 'border-primary/50 ring-2 ring-primary/30 shadow-xl shadow-primary/10'
                  : isCurrent
                    ? 'border-primary/50 ring-2 ring-primary/30 shadow-xl shadow-primary/10'
                    : 'border-border shadow-sm'
              )}
            >
              {isCurrent && (
                <span className="inline-block self-start text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1 mb-4">
                  Current plan
                </span>
              )}

              {plan.highlight && !isCurrent && (
                <span className="inline-block self-start text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1 mb-4">
                  Most popular
                </span>
              )}

              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">
                  {plan.name}
                </h3>
              </div>

              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">
                {plan.description}
              </p>

              <div className="my-6 h-px bg-border" />

              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/80">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                {isCurrent ? (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full pointer-events-none opacity-60"
                    disabled
                  >
                    Current plan
                  </Button>
                ) : isLower ? (
                  <p className="text-center text-sm text-muted-foreground py-2.5">
                    Included in your plan
                  </p>
                ) : isUpgrade ? (
                  <Button
                    variant={plan.highlight || plan.id === 'lifetime' ? 'default' : 'outline'}
                    size="lg"
                    className="w-full"
                    onClick={() => void handleUpgrade(plan)}
                    disabled={isPending}
                  >
                    {isPending
                      ? 'Loading...'
                      : plan.id === 'lifetime'
                        ? 'Go Lifetime'
                        : `Upgrade to ${plan.name}`}
                  </Button>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
