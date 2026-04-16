import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/** Skeleton for a single card item in a list */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-4 space-y-3 animate-in fade-in-0 duration-300',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex items-center gap-4 pt-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}

/** Grid of card skeletons */
export function CardGridSkeleton({
  count = 6,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton
          key={i}
          className="animate-in fade-in-0 duration-300"
          // stagger animation via inline style
        />
      ))}
    </div>
  )
}

/** Skeleton for a single table row */
export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
  return (
    <tr className="animate-in fade-in-0 duration-300">
      {Array.from({ length: columns }, (_, i) => (
        <td key={i} className="p-3">
          <Skeleton className={cn('h-4', i === 0 ? 'w-48' : i === 1 ? 'w-full' : 'w-20')} />
        </td>
      ))}
    </tr>
  )
}

/** Table body of skeleton rows */
export function TableBodySkeleton({
  rows = 10,
  columns = 6,
}: {
  rows?: number
  columns?: number
}) {
  return (
    <tbody>
      {Array.from({ length: rows }, (_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </tbody>
  )
}

/** Loading spinner for infinite scroll footer */
export function InfiniteScrollLoader() {
  return (
    <div className="flex items-center justify-center py-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        Loading more...
      </div>
    </div>
  )
}
