'use client'

import { Progress } from '@/components/ui/progress'
import { useCredits } from '@/features/credits'
import { CREDIT_CONFIG, isUnlimited } from '@/lib/credits/config'

export function CreditBalance() {
  const { data: balances, isLoading } = useCredits()

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-2 w-full animate-pulse rounded-full bg-muted" />
      </div>
    )
  }

  if (!balances || balances.length === 0) return null

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold tracking-tight">Credit Usage</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {balances.map((b) => {
          const config = CREDIT_CONFIG[b.creditType]
          const label = config?.label ?? b.creditType
          const unlimited = isUnlimited(b.allocation)
          const percentage = unlimited
            ? 100
            : Math.round((b.balance / b.allocation) * 100)

          return (
            <div
              key={b.creditType}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {unlimited ? 'Unlimited' : `${b.balance} / ${b.allocation}`}
                </span>
              </div>
              <Progress value={percentage} className="mt-3" />
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
