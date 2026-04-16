'use client'

import { use } from 'react'
import type { ProfileData } from '@/features/settings/types'

interface ProfileFormProps {
  profilePromise: Promise<ProfileData>
}

/**
 * ProfileForm — unwraps profile data and renders the profile settings form.
 * Uses React Hook Form + Zod (designer fills). TODO: designer
 */
export function ProfileForm({ profilePromise }: ProfileFormProps) {
  const _profile = use(profilePromise)
  return <div data-slot="profile-form">TODO: designer</div>
}
