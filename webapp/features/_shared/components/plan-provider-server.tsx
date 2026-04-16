import { getCachedAuth } from "@/lib/supabase/cached-claims"
import { getPlan } from "@/lib/auth/utils"
import { PlanProvider } from "@/features/_shared/providers/plan-provider"

export async function PlanProviderServer({
  children,
}: {
  children: React.ReactNode
}) {
  const { claims } = await getCachedAuth()
  const plan = getPlan(claims)

  return <PlanProvider plan={plan}>{children}</PlanProvider>
}
