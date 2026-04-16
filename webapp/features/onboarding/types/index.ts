/**
 * Onboarding Types
 *
 * Types matching the procedure outputs from webapp/lib/orpc/procedures/onboarding.ts
 */

// Profile type matching getProfile procedure output
export interface Profile {
  full_name: string | null
  avatar_url: string | null
  preference_motivation: PreferenceMotivation | null
  preference_experience: PreferenceExperience | null
  preference_interest: PreferenceInterest | null
  onboarding_completed: boolean
  google_name: string | null
}

// Preference enum types matching backend schemas
export type PreferenceMotivation = 'ship_first_saas' | 'learn_by_building' | 'speed_up_workflow' | 'explore_ideas'
export type PreferenceExperience = 'beginner' | 'intermediate' | 'advanced' | 'agency_team'
export type PreferenceInterest = 'ai_automation' | 'developer_tools' | 'consumer_apps' | 'b2b_saas'

// Component prop types
export interface StepProps {
  onComplete: () => void
}

export interface SelectStepProps {
  onSelect: (value: string) => void
}

export interface StepNameProps {
  defaultValue?: string
  googleName?: string | null
  onComplete: (name: string) => void
}

export interface StepAvatarProps {
  currentAvatarUrl?: string | null
  onComplete: (avatarUrl: string | null) => void
}

export interface SelectCardProps {
  label: string
  icon?: React.ReactNode
  selected?: boolean
  onClick: () => void
  delay?: number
}

export interface StepProgressProps {
  currentStep: number
  totalSteps: number
  onBack?: () => void
}
