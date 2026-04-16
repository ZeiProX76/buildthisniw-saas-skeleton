import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl py-4 sm:py-8">
      <Skeleton className="h-8 w-24 mb-8" />

      {/* Avatar + Name header */}
      <div className="flex items-center gap-5 mb-8">
        <Skeleton className="size-20 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Account card */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <Skeleton className="h-4 w-16" />
        <div className="flex items-center gap-3">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Preferences card */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4 mt-4">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-5 rounded" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>

      {/* Legal card */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3 mt-4">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Logout */}
      <Separator className="my-6" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  )
}
