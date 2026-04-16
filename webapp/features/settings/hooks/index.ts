'use client'

/**
 * Settings mutation hooks.
 *
 * Reads are done via server components (dynamic, no cache directive).
 * Writes use server actions via .actionable(), called from useMutation.
 *
 * aria-live: all hooks wire to #settings-announce in page.tsx.
 *
 * Cache invalidation: actions.ts cacheInvalidator('settings') busts server cache.
 * Client cache: no useQuery here (RSC reads) so no client-side invalidation needed.
 */

import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import {
  updateProfileAction,
  updateAvatarAction,
  updateNotificationPreferencesAction,
  updatePreferencesAction,
  deleteAccountAction,
} from '@/features/settings/actions'
import type {
  UpdateProfileFormValues,
  UpdateAvatarFormValues,
  UpdatePreferencesFormValues,
  UpdateNotificationPreferencesFormValues,
} from '@/features/settings/types'

// ============================================================
// Announcement helper
// ============================================================

function announce(message: string) {
  const el = document.getElementById('settings-announce')
  if (el) el.textContent = message
}

// ============================================================
// useUpdateProfile
// ============================================================

export function useUpdateProfile() {
  const router = useRouter()
  return useMutation({
    mutationFn: async (values: UpdateProfileFormValues) => {
      const [error, data] = await updateProfileAction(values)
      if (error) throw new Error(error.message ?? 'Failed to update profile')
      return data
    },
    onSuccess: () => {
      router.refresh()
      announce('Profile saved successfully.')
    },
    onError: (err: Error) => {
      announce(`Error: ${err.message}`)
    },
  })
}

// ============================================================
// useUpdateAvatar
// ============================================================

export function useUpdateAvatar() {
  const router = useRouter()
  return useMutation({
    mutationFn: async (values: UpdateAvatarFormValues) => {
      const [error, data] = await updateAvatarAction(values)
      if (error) throw new Error(error.message ?? 'Failed to update avatar')
      return data
    },
    onSuccess: () => {
      router.refresh()
      announce('Avatar updated successfully.')
    },
    onError: (err: Error) => {
      announce(`Error: ${err.message}`)
    },
  })
}

// ============================================================
// useUpdatePreferences
// ============================================================

export function useUpdatePreferences() {
  const router = useRouter()
  return useMutation({
    mutationFn: async (values: UpdatePreferencesFormValues) => {
      const [error, data] = await updatePreferencesAction(values)
      if (error) throw new Error(error.message ?? 'Failed to update preferences')
      return data
    },
    onSuccess: () => {
      router.refresh()
      announce('Preferences saved successfully.')
    },
    onError: (err: Error) => {
      announce(`Error: ${err.message}`)
    },
  })
}

// ============================================================
// useUpdateNotificationPreferences
// ============================================================

export function useUpdateNotificationPreferences() {
  const router = useRouter()
  return useMutation({
    mutationFn: async (values: UpdateNotificationPreferencesFormValues) => {
      const [error, data] = await updateNotificationPreferencesAction(values)
      if (error) throw new Error(error.message ?? 'Failed to update notifications')
      return data
    },
    onSuccess: () => {
      router.refresh()
      announce('Notification preferences saved.')
    },
    onError: (err: Error) => {
      announce(`Error: ${err.message}`)
    },
  })
}

// ============================================================
// useDeleteAccount
// ============================================================

export function useDeleteAccount() {
  const router = useRouter()
  return useMutation({
    mutationFn: async () => {
      const [error, data] = await deleteAccountAction()
      if (error) throw new Error(error.message ?? 'Failed to delete account')
      return data
    },
    onSuccess: () => {
      announce('Account deletion initiated. You will be signed out shortly.')
      // Redirect to landing after Inngest cascade completes (~30s)
      // The page component handles the countdown/sign-out logic
      router.push('/')
    },
    onError: (err: Error) => {
      announce(`Error: ${err.message}`)
    },
  })
}
