'use client'

import { use } from 'react'
import type { NotificationPreferencesData } from '@/features/settings/types'

interface NotificationsFormProps {
  prefsPromise: Promise<NotificationPreferencesData>
}

/**
 * NotificationsForm — email toggles for updates and marketing.
 * Uses React Hook Form + Zod (designer fills). TODO: designer
 */
export function NotificationsForm({ prefsPromise }: NotificationsFormProps) {
  const _prefs = use(prefsPromise)
  return <div data-slot="notifications-form">TODO: designer</div>
}
