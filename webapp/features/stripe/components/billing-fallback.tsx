export function BillingFallback() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-8 flex flex-col shadow-sm"
          >
            {/* Plan name */}
            <div className="h-6 w-16 animate-pulse rounded bg-muted" />

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-1">
              <div className="h-10 w-20 animate-pulse rounded bg-muted" />
              <div className="h-4 w-12 animate-pulse rounded bg-muted" />
            </div>

            {/* Description */}
            <div className="mt-2 h-4 w-44 animate-pulse rounded bg-muted" />

            {/* Divider */}
            <div className="my-6 h-px bg-border" />

            {/* Feature list */}
            <div className="space-y-3 flex-1">
              {Array.from({ length: i === 1 ? 6 : 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-2.5">
                  <div className="h-4 w-4 animate-pulse rounded bg-muted shrink-0" />
                  <div
                    className="h-4 animate-pulse rounded bg-muted"
                    style={{ width: `${60 + ((j * 17) % 40)}%` }}
                  />
                </div>
              ))}
            </div>

            {/* CTA button */}
            <div className="mt-8">
              <div className="h-11 w-full animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
