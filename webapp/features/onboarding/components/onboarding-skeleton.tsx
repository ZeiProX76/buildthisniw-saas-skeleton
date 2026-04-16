import { Skeleton } from '@/components/ui/skeleton'

/**
 * Skeleton loader for onboarding flow
 * Matches the exact layout shape of the card surface and step content
 */
export function OnboardingSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-card rounded-xl border border-border shadow-sm p-8 sm:p-10">
          {/* Progress bar skeleton */}
          <Skeleton className="h-1 w-full rounded-full" />

          {/* Step content skeleton */}
          <div className="mt-8 space-y-6">
            {/* Heading skeleton */}
            <Skeleton className="h-9 w-3/4 mx-auto" />

            {/* Description skeleton */}
            <Skeleton className="h-4 w-2/3 mx-auto" />

            {/* Input/Card skeleton */}
            <div className="mt-8">
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>

            {/* Button skeleton */}
            <div className="mt-6">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}