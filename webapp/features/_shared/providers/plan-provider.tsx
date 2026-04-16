'use client'

import { createContext, useContext } from 'react'

interface PlanContextValue {
  plan: string
  isFree: boolean
  isPaid: boolean
}

const PlanContext = createContext<PlanContextValue>({
  plan: 'free',
  isFree: true,
  isPaid: false,
})

export function PlanProvider({
  plan,
  children,
}: {
  plan: string
  children: React.ReactNode
}) {
  return (
    <PlanContext.Provider value={{ plan, isFree: plan === 'free', isPaid: plan !== 'free' }}>
      {children}
    </PlanContext.Provider>
  )
}

export function usePlan() {
  return useContext(PlanContext)
}
