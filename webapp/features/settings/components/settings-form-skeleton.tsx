/**
 * SettingsFormSkeleton — shown while tab content streams in.
 * Mimics form structure: heading + field rows.
 */
interface SettingsFormSkeletonProps {
  rows?: number
}

export function SettingsFormSkeleton({ rows = 3 }: SettingsFormSkeletonProps) {
  return (
    <div data-slot="settings-form-skeleton" className="space-y-6 animate-pulse">
      <div className="h-6 w-48 rounded-md bg-muted" />
      <div className="h-4 w-72 rounded-md bg-muted" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 rounded-md bg-muted" />
          <div className="h-10 w-full rounded-md bg-muted" />
        </div>
      ))}
      <div className="h-10 w-32 rounded-md bg-muted ml-auto" />
    </div>
  )
}
