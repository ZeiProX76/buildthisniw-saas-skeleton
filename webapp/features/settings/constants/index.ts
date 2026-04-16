import type { SettingsTab } from '@/lib/search-params/settings'

// ============================================================
// Tab definitions
// ============================================================

export const SETTINGS_TAB_LABELS: Record<SettingsTab, string> = {
  profile: 'Profile',
  preferences: 'Preferences',
  notifications: 'Notifications',
  billing: 'Billing',
  danger: 'Danger Zone',
}

// ============================================================
// Language options
// ============================================================

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
] as const

// ============================================================
// Avatar upload constraints (mirrors onboarding pattern)
// ============================================================

export const AVATAR_BUCKET = 'avatars'
export const AVATAR_MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
export const AVATAR_ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] as const

// ============================================================
// Delete account polling
// ============================================================

/** How long to show "Deleting..." before forcing a sign-out (30s Inngest SLA) */
export const DELETE_ACCOUNT_TIMEOUT_MS = 35_000
