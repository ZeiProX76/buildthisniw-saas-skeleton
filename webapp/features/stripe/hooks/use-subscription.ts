'use client'

import { useQuery } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc/client'

export function useSubscription() {
  return useQuery(orpc.protected.stripe.getSubscription.queryOptions())
}
