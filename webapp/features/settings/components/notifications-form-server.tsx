import { getNotificationPreferencesData } from '@/features/settings/data'
import { NotificationsForm } from './notifications-form'

/**
 * NotificationsFormServer — fetches notification preferences, passes to client form.
 * Dynamic (no cache directive) — user data must be fresh.
 */
export async function NotificationsFormServer() {
  const prefsPromise = getNotificationPreferencesData()
  return <NotificationsForm prefsPromise={prefsPromise} />
}
