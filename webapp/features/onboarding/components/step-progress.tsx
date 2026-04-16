'use client'

import { cn } from '@/lib/utils'
import type { StepProgressProps } from '../types'

/**
 * Minimal progress indicator for onboarding steps
 * Shows dots indicating current step, with back arrow on steps 2+
 */
export function StepProgress({ currentStep, totalSteps, onBack }: StepProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {/* Back arrow - visible on steps 2+ */}
      <button
        type="button"
        onClick={onBack}
        className={cn(
          'p-1.5 rounded-full transition-all duration-200',
          'hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          currentStep > 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'
        )}
        aria-label="Go back"
        tabIndex={currentStep > 1 ? 0 : -1}
      >
        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Progress dots */}
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1
        const isActive = stepNumber === currentStep
        const isCompleted = stepNumber < currentStep

        return (
          <div
            key={stepNumber}
            className={cn(
              'h-1.5 rounded-full transition-all duration-500 ease-out',
              isActive && 'w-8 bg-primary',
              isCompleted && 'w-1.5 bg-primary',
              !isActive && !isCompleted && 'w-1.5 bg-muted'
            )}
            aria-label={`Step ${stepNumber} of ${totalSteps}`}
            aria-current={isActive ? 'step' : undefined}
          />
        )
      })}
    </div>
  )
}
