'use client'

import { useMemo } from 'react'
import { useQueryState, parseAsInteger } from 'nuqs'
import { StepProgress } from './step-progress'
import { StepName } from './step-name'
import { StepAvatar } from './step-avatar'
import { StepMotivation } from './step-motivation'
import { StepExperience } from './step-experience'
import { StepInterest } from './step-interest'
import { StepComplete } from './step-complete'
import { useProfile, useCompleteOnboarding } from '../hooks'
import { TOTAL_STEPS } from '../constants'
import type { Profile } from '../types'

/**
 * Compute the furthest step the user can resume to based on saved profile data.
 * Each step is reached by completing the previous one, so we check sequentially.
 */
function computeResumeStep(profile: Profile | null): number {
  if (!profile) return 1
  if (profile.preference_interest) return TOTAL_STEPS // all done
  if (profile.preference_experience) return 5
  if (profile.preference_motivation) return 4
  if (profile.avatar_url) return 3
  if (profile.full_name) return 2
  return 1
}

interface OnboardingFlowProps {
  initialProfile: Profile | null
}

/**
 * Onboarding flow orchestrator
 * Uses nuqs for step state (URL-persisted, browser back works)
 * Server provides initialProfile to avoid loading spinner
 */
export function OnboardingFlow({ initialProfile }: OnboardingFlowProps) {
  const { data } = useProfile(initialProfile)
  const profile = (data ?? initialProfile) as Profile | null
  const completeOnboarding = useCompleteOnboarding()

  // Compute resume step from profile data (derived, no useEffect)
  const resumeStep = useMemo(() => computeResumeStep(profile ?? initialProfile), [profile, initialProfile])

  // nuqs step state — URL-persisted, browser back/forward works
  const [currentStep, setCurrentStep] = useQueryState(
    'step',
    parseAsInteger.withDefault(resumeStep).withOptions({
      history: 'push',
      shallow: true,
    }),
  )

  // Clamp step to valid range
  const step = Math.max(1, Math.min(currentStep, TOTAL_STEPS))

  // Already completed — show completion and redirect
  const isComplete = profile?.onboarding_completed || completeOnboarding.isSuccess

  const handleStepTransition = (nextStep: number) => {
    setCurrentStep(nextStep)
  }

  const handleBack = () => {
    if (step > 1) {
      setCurrentStep(step - 1)
    }
  }

  const handleNameComplete = (name: string) => {
    void name // saved by the step component
    handleStepTransition(2)
  }

  const handleAvatarComplete = (_url: string | null) => {
    handleStepTransition(3)
  }

  const handleMotivationSelect = (_motivation: string) => {
    handleStepTransition(4)
  }

  const handleExperienceSelect = (_experience: string) => {
    handleStepTransition(5)
  }

  const handleInterestSelect = async (_interest: string) => {
    try {
      await completeOnboarding.mutateAsync()
    } catch (error) {
      console.error('Failed to complete onboarding:', error)
    }
  }

  // Completion screen replaces the entire flow
  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="bg-card rounded-xl border border-border shadow-sm p-8 sm:p-10">
            <StepComplete />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-card rounded-xl border border-border shadow-sm p-8 sm:p-10">
          <StepProgress
            currentStep={step}
            totalSteps={TOTAL_STEPS}
            onBack={handleBack}
          />

          {/* Step content */}
          <div className="mt-8 relative overflow-hidden">
            <div className="transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
              {step === 1 && (
                <StepName
                  defaultValue={profile?.full_name ?? undefined}
                  googleName={profile?.google_name}
                  onComplete={handleNameComplete}
                />
              )}

              {step === 2 && (
                <StepAvatar
                  currentAvatarUrl={profile?.avatar_url}
                  onComplete={handleAvatarComplete}
                />
              )}

              {step === 3 && (
                <StepMotivation onSelect={handleMotivationSelect} />
              )}

              {step === 4 && (
                <StepExperience onSelect={handleExperienceSelect} />
              )}

              {step === 5 && (
                <StepInterest onSelect={handleInterestSelect} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
