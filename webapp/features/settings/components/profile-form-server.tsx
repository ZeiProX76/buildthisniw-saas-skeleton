import { getProfileData } from '@/features/settings/data'
import { ProfileForm } from './profile-form'

/**
 * ProfileFormServer — fetches profile data, passes as promise to client form.
 * Dynamic (no cache directive) — data must be fresh.
 */
export async function ProfileFormServer() {
  const profilePromise = getProfileData()
  return <ProfileForm profilePromise={profilePromise} />
}
