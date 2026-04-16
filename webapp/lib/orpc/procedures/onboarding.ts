import { z } from 'zod'
import { protectedProcedure } from '../base'
import {
  SecureShortText,
  SecureImageUrl,
  secureObject,
} from '../schemas'
import { Errors } from '../errors'
import { ORPCError } from '@orpc/server'
import type { ORPCContext } from '../context'

// ============================================
// HELPER FUNCTIONS
// ============================================

// Helper to get user from context (per gotchas.md - avoids context.user! assertion)
function getUser(context: ORPCContext) {
  const user = context.user
  if (!user) throw Errors.unauthorized()
  return user
}

// ============================================
// SCHEMAS
// ============================================

// Preference enums matching database CHECK constraints
const PreferenceMotivation = z.enum(['ship_first_saas', 'learn_by_building', 'speed_up_workflow', 'explore_ideas'])
const PreferenceExperience = z.enum(['beginner', 'intermediate', 'advanced', 'agency_team'])
const PreferenceInterest = z.enum(['ai_automation', 'developer_tools', 'consumer_apps', 'b2b_saas'])

// Input schemas using secureObject for mass assignment protection
const UpdateNameInput = secureObject({
  fullName: SecureShortText.min(1, 'Name is required'),
})

const SaveAvatarInput = secureObject({
  avatarUrl: SecureImageUrl,
})

const SaveMotivationInput = secureObject({
  value: PreferenceMotivation,
})

const SaveExperienceInput = secureObject({
  value: PreferenceExperience,
})

const SaveInterestInput = secureObject({
  value: PreferenceInterest,
})

// ============================================
// PROCEDURES
// ============================================

/**
 * Get current onboarding profile data
 * Returns all onboarding-related fields from the profiles table
 */
export const getProfile = protectedProcedure
  .route({ method: 'GET', path: '/protected/onboarding/profile' })
  .handler(async ({ context }) => {
    const user = getUser(context)

    const { data, error } = await context.supabase
      .from('profiles')
      .select('full_name, avatar_url, preference_motivation, preference_experience, preference_interest, onboarding_completed')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error("[onboarding] operation failed:", error); throw Errors.internal("Operation failed")
    }

    if (!data) {
      throw Errors.notFound('Profile not found')
    }

    // If full_name is null, check Google OAuth metadata for pre-fill
    let google_name: string | null = null
    if (!data.full_name) {
      const { data: { user: authUser } } = await context.supabase.auth.getUser()
      if (authUser?.user_metadata?.full_name) {
        google_name = authUser.user_metadata.full_name as string
      }
    }

    return {
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      preference_motivation: data.preference_motivation,
      preference_experience: data.preference_experience,
      preference_interest: data.preference_interest,
      onboarding_completed: data.onboarding_completed,
      google_name,
    }
  })

/**
 * Save display name (step 1)
 * Updates the full_name field in the profiles table
 */
export const updateName = protectedProcedure
  .route({ method: 'POST', path: '/protected/onboarding/name' })
  .input(UpdateNameInput)
  .handler(async ({ context, input }) => {
    const user = getUser(context)

    const { error } = await context.supabase
      .from('profiles')
      .update({
        full_name: input.fullName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      console.error("[onboarding] operation failed:", error); throw Errors.internal("Operation failed")
    }


    return { success: true }
  })

/**
 * Confirm avatar URL after client-side upload (step 2)
 * Client uploads directly to Supabase Storage, then calls this with the public URL
 */
export const saveAvatar = protectedProcedure
  .route({ method: 'POST', path: '/protected/onboarding/avatar' })
  .input(SaveAvatarInput)
  .handler(async ({ context, input }) => {
    const user = getUser(context)

    // Validate that the avatar URL is from our storage bucket
    // Expected format: https://{project}.supabase.co/storage/v1/object/public/avatars/{user_id}/...
    const expectedPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${user.id}/`

    try {
      const parsed = new URL(input.avatarUrl)
      const expectedBase = new URL(expectedPrefix)
      if (
        parsed.origin !== expectedBase.origin ||
        !parsed.pathname.startsWith(expectedBase.pathname) ||
        parsed.pathname.includes('..')
      ) {
        throw Errors.badRequest('Invalid avatar URL')
      }
    } catch (e) {
      if (e instanceof ORPCError) throw e
      throw Errors.badRequest('Invalid avatar URL')
    }

    const { error } = await context.supabase
      .from('profiles')
      .update({
        avatar_url: input.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      console.error("[onboarding] operation failed:", error); throw Errors.internal("Operation failed")
    }


    return { success: true }
  })

/**
 * Save motivation preference (step 3)
 */
export const saveMotivation = protectedProcedure
  .route({ method: 'POST', path: '/protected/onboarding/motivation' })
  .input(SaveMotivationInput)
  .handler(async ({ context, input }) => {
    const user = getUser(context)

    const { error } = await context.supabase
      .from('profiles')
      .update({
        preference_motivation: input.value,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      console.error("[onboarding] operation failed:", error); throw Errors.internal("Operation failed")
    }


    return { success: true }
  })

/**
 * Save experience preference (step 4)
 */
export const saveExperience = protectedProcedure
  .route({ method: 'POST', path: '/protected/onboarding/experience' })
  .input(SaveExperienceInput)
  .handler(async ({ context, input }) => {
    const user = getUser(context)

    const { error } = await context.supabase
      .from('profiles')
      .update({
        preference_experience: input.value,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      console.error("[onboarding] operation failed:", error); throw Errors.internal("Operation failed")
    }


    return { success: true }
  })

/**
 * Save interest preference (step 5)
 */
export const saveInterest = protectedProcedure
  .route({ method: 'POST', path: '/protected/onboarding/interest' })
  .input(SaveInterestInput)
  .handler(async ({ context, input }) => {
    const user = getUser(context)

    const { error } = await context.supabase
      .from('profiles')
      .update({
        preference_interest: input.value,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      console.error("[onboarding] operation failed:", error); throw Errors.internal("Operation failed")
    }


    return { success: true }
  })

/**
 * Mark onboarding as done
 * Verifies that at least the name is filled, then sets onboarding_completed = true
 */
export const complete = protectedProcedure
  .route({ method: 'POST', path: '/protected/onboarding/complete' })
  .handler(async ({ context }) => {
    const user = getUser(context)

    // First check if the name is filled (only required field)
    const { data: profile, error: fetchError } = await context.supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    if (fetchError) {
      console.error("[onboarding] fetch failed:", fetchError); throw Errors.internal("Operation failed")
    }

    if (!profile || !profile.full_name) {
      throw Errors.badRequest('Please complete at least your name')
    }

    // Mark onboarding as completed
    const { error: updateError } = await context.supabase
      .from('profiles')
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) {
      console.error("[onboarding] update failed:", updateError); throw Errors.internal("Operation failed")
    }


    return {
      success: true,
      redirectTo: '/protected/home',
    }
  })

/**
 * Onboarding router
 */
export const onboardingRouter = {
  getProfile,
  updateName,
  saveAvatar,
  saveMotivation,
  saveExperience,
  saveInterest,
  complete,
}