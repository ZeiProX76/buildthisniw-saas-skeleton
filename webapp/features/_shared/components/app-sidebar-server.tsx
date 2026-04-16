// PROTECTED — APPEND ONLY. Add new sidebar nav items; do not modify existing items or layout structure.
import { getCachedAuth } from "@/lib/supabase/cached-claims"
import { getAvatarUrl, getEmail, getName, getPlan } from "@/lib/auth/utils"
import { AppSidebar } from "./app-sidebar"

export async function AppSidebarServer() {
  const { claims } = await getCachedAuth()

  return (
    <AppSidebar
      email={getEmail(claims)}
      name={getName(claims)}
      avatarUrl={getAvatarUrl(claims)}
      plan={getPlan(claims)}
    />
  )
}
