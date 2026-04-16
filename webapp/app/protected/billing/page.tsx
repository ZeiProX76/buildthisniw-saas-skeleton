import { Suspense } from 'react'
import { BillingWithClaims } from '@/features/stripe/components/billing-with-claims'
import { BillingFallback } from '@/features/stripe/components/billing-fallback'

export default function BillingRoute() {
  return (
    <Suspense fallback={<BillingFallback />}>
      <BillingWithClaims />
    </Suspense>
  )
}
