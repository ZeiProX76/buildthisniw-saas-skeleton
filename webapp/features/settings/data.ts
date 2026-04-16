/**
 * Settings server-side data fetching.
 *
 * Cache tier: DYNAMIC (no 'use cache' directive).
 * All settings data is user-specific and must be fresh on every request.
 * Uses getORPCCaller() — reads cookies, NOT safe in 'use cache'.
 */

import { getORPCCaller } from '@/lib/orpc/server'

/**
 * Fetch the current user's profile settings.
 * Called in ProfileFormServer — dynamic, no caching.
 */
export async function getProfileData() {
  const caller = await getORPCCaller()
  return caller.protected.settings.getProfile()
}

/**
 * Fetch the current user's notification preferences.
 * Creates default row if missing (backend handles upsert).
 */
export async function getNotificationPreferencesData() {
  const caller = await getORPCCaller()
  return caller.protected.settings.getNotificationPreferences()
}
