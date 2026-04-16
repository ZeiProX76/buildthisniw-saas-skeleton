// PROTECTED — APPEND ONLY. Add header items or nav elements; do not modify existing layout structure.
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebarServer } from "@/features/_shared/components/app-sidebar-server"
import { ThemeSwitcher } from "@/features/_shared/components/theme-switcher"
import { PlanProviderServer } from "@/features/_shared/components/plan-provider-server"
import { SidebarSkeleton } from "@/features/_shared/components/sidebar-skeleton"
import { Suspense } from "react"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={null}>
      <PlanProviderServer>
        <SidebarProvider>
          <Suspense fallback={<SidebarSkeleton />}>
            <AppSidebarServer />
          </Suspense>
          <SidebarInset>
            <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex-1" />
              <div className="flex items-center gap-1">
                <ThemeSwitcher />
              </div>
            </header>
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </PlanProviderServer>
    </Suspense>
  )
}
