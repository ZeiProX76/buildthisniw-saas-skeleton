'use client'

import { use } from 'react'
import type { ProfileData } from '@/features/settings/types'

interface PreferencesFormProps {
  profilePromise: Promise<ProfileData>
}

/**
 * PreferencesForm — timezone + language settings.
 * Uses React Hook Form + Zod (designer fills). TODO: designer
 */
export function PreferencesForm({ profilePromise }: PreferencesFormProps) {
  const _profile = use(profilePromise)
  return <div data-slot="preferences-form">TODO: designer</div>
}
