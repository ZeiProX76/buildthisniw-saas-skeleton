export type CreditPeriod = 'day' | 'week' | 'month'

export interface CreditTypeConfig {
  label: string
  period: CreditPeriod
  allocations: Record<string, number>
}

export const CREDIT_CONFIG: Record<string, CreditTypeConfig> = {
  generation: {
    label: 'Generations',
    period: 'month',
    allocations: { free: 3, starter: 10, builder: 50, ship_review: 999999 },
  },
} as const

export function isUnlimited(amount: number): boolean {
  return amount >= 999999
}
