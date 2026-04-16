import { Skeleton } from "@/components/ui/skeleton"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function SidebarSkeleton() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2">
              <Skeleton className="size-8 rounded-md" />
              <Skeleton className="h-4 w-24" />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <div className="px-3 py-2">
          <Skeleton className="h-3 w-16 mb-3" />
          <div className="space-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-2 py-2">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-2">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
