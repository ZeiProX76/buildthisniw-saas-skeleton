import { getProfileData } from '@/features/settings/data'
import { PreferencesForm } from './preferences-form'

/**
 * PreferencesFormServer — fetches profile for timezone + language, passes to client form.
 * Dynamic (no cache directive) — user data must be fresh.
 */
export async function PreferencesFormServer() {
  const profilePromise = getProfileData()
  return <PreferencesForm profilePromise={profilePromise} />
}
