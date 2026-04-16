/**
 * Onboarding Feature Barrel Export
 */

// Main component for pages
export { OnboardingFlow } from './components/onboarding-flow'

// Export types for external use
export type {
  Profile,
  PreferenceMotivation,
  PreferenceExperience,
  PreferenceInterest,
} from './types'

// Export hooks if needed externally
export {
  useProfile,
  useUpdateName,
  useSaveAvatar,
  useSaveMotivation,
  useSaveExperience,
  useSaveInterest,
  useCompleteOnboarding,
} from './hooks'
