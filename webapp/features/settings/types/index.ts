/**
 * Settings feature types — mirror oRPC procedure outputs.
 *
 * DB → oRPC field mapping (snake_case → camelCase):
 *   profiles.full_name          → fullName
 *   profiles.display_name       → displayName
 *   profiles.avatar_url         → avatarUrl
 *   profiles.timezone           → timezone
 *   profiles.preferred_language → language
 *   notification_preferences.email_updates  → emailUpdates
 *   notification_preferences.email_marketing → emailMarketing
 */

// ============================================================
// Procedure output types
// ============================================================

export interface ProfileData {
  fullName: string
  displayName: string
  avatarUrl: string
  timezone: string
  language: string
}

export interface NotificationPreferencesData {
  emailUpdates: boolean
  emailMarketing: boolean
}

export interface DeleteAccountResult {
  jobId: string
}

export interface MutationSuccess {
  success: true
}

// ============================================================
// Form value types (mirror oRPC procedure inputs)
// ============================================================

export interface UpdateProfileFormValues {
  fullName: string
  displayName?: string
}

export interface UpdateAvatarFormValues {
  avatarUrl: string
}

export interface UpdatePreferencesFormValues {
  timezone?: string
  language?: 'en' | 'fr' | 'de' | 'es' | 'pt' | 'ja' | 'ko' | 'zh'
}

export interface UpdateNotificationPreferencesFormValues {
  emailUpdates: boolean
  emailMarketing: boolean
}

export interface DeleteAccountFormValues {
  confirmName: string
  iUnderstand: boolean
}

// ============================================================
// Tab type (re-exported from search-params for convenience)
// ============================================================
export type { SettingsTab } from '@/lib/search-params/settings'
