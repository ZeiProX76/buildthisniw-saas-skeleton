'use client'

/**
 * Onboarding Hooks
 *
 * TanStack Query hooks for onboarding procedures.
 * Mutations use oRPC .actionable() server actions for instant cache invalidation.
 */

import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { orpc } from '@/lib/orpc/client'
import { createClient } from '@/lib/supabase/client'
import {
  updateNameAction,
  saveAvatarAction,
  saveMotivationAction,
  saveExperienceAction,
  saveInterestAction,
  completeOnboardingAction,
} from '../actions'
import type { Profile, PreferenceMotivation, PreferenceExperience, PreferenceInterest } from '../types'

/**
 * Hook to get the current onboarding profile
 * Accepts server-fetched initialData to avoid loading spinner on first render
 */
export function useProfile(initialData?: Profile | null) {
  return useQuery({
    ...orpc.protected.onboarding.getProfile.queryOptions(),
    initialData: initialData ?? undefined,
  })
}

/**
 * Hook to update the user's name (step 1)
 */
export function useUpdateName() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (fullName: string) => {
      const [error, data] = await updateNameAction({ fullName })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      router.refresh()
    },
  })
}

/**
 * Hook to save avatar URL after client-side upload (step 2)
 */
export function useSaveAvatar() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (avatarUrl: string) => {
      const [error, data] = await saveAvatarAction({ avatarUrl })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      router.refresh()
    },
  })
}

/**
 * Hook to save motivation preference (step 3)
 */
export function useSaveMotivation() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (value: PreferenceMotivation) => {
      const [error, data] = await saveMotivationAction({ value })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      router.refresh()
    },
  })
}

/**
 * Hook to save experience preference (step 4)
 */
export function useSaveExperience() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (value: PreferenceExperience) => {
      const [error, data] = await saveExperienceAction({ value })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      router.refresh()
    },
  })
}

/**
 * Hook to save interest preference (step 5)
 */
export function useSaveInterest() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (value: PreferenceInterest) => {
      const [error, data] = await saveInterestAction({ value })
      if (error) throw error
      return data
    },
    onSuccess: () => {
      router.refresh()
    },
  })
}

/**
 * Hook to complete onboarding
 * Validates required fields and marks onboarding as done
 */
export function useCompleteOnboarding() {
  return useMutation({
    mutationFn: async () => {
      const [error, data] = await completeOnboardingAction()
      if (error) throw error
      // Refresh the session so JWT claims pick up the new avatar_url + name
      const supabase = createClient()
      await supabase.auth.refreshSession()
      return data
    },
  })
}
