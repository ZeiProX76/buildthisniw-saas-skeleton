'use client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function SettingsError({ error, reset }: ErrorProps) {
  return (
    <div className="rounded-xl border bg-destructive/10 p-6 space-y-3">
      <h2 className="font-semibold text-destructive">Something went wrong</h2>
      <p className="text-sm text-muted-foreground">
        {error.message || 'Failed to load settings'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-destructive px-4 py-2 text-sm text-destructive-foreground hover:bg-destructive/90 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
