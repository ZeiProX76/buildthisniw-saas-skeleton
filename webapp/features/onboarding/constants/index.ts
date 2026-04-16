/**
 * Onboarding Constants
 *
 * Static values and configuration for the onboarding flow
 */

// Number of onboarding steps
export const TOTAL_STEPS = 5

// Step labels for accessibility and tracking
export const STEP_LABELS = {
  1: 'Name',
  2: 'Avatar',
  3: 'Motivation',
  4: 'Experience',
  5: 'Interest',
} as const

// Preference options matching backend enums
export const MOTIVATION_OPTIONS = [
  { value: 'ship_first_saas', label: 'Ship my first SaaS', icon: '🚀' },
  { value: 'learn_by_building', label: 'Learn by building', icon: '🧠' },
  { value: 'speed_up_workflow', label: 'Ship faster with AI', icon: '⚡' },
  { value: 'explore_ideas', label: 'Explore ideas', icon: '💡' },
] as const

export const EXPERIENCE_OPTIONS = [
  { value: 'beginner', label: 'Beginner', icon: '🌱' },
  { value: 'intermediate', label: 'Intermediate', icon: '🔧' },
  { value: 'advanced', label: 'Advanced', icon: '🎯' },
  { value: 'agency_team', label: 'Agency / Team', icon: '👥' },
] as const

export const INTEREST_OPTIONS = [
  { value: 'ai_automation', label: 'AI & Automation', icon: '🤖' },
  { value: 'developer_tools', label: 'Developer tools', icon: '🛠️' },
  { value: 'consumer_apps', label: 'Consumer apps', icon: '📱' },
  { value: 'b2b_saas', label: 'B2B SaaS', icon: '💼' },
] as const

// Animation duration in milliseconds
export const TRANSITION_DURATION = 300

// Auto-advance delay for preference steps (200ms per spec)
export const PREFERENCE_ADVANCE_DELAY = 200

// Accepted file types for avatar (compression handles size)
export const AVATAR_ACCEPT = 'image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif'
