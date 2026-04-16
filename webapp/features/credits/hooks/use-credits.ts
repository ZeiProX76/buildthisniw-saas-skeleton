'use client'

import { useQuery } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc/client'

export function useCredits() {
  return useQuery(orpc.protected.credits.getBalance.queryOptions())
}
