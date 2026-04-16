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
import { inngest } from '@/lib/inngest/client'

// ============================================
// HELPER FUNCTIONS
// ============================================

function getUser(context: ORPCContext) {
  const user = context.user
  if (!user) throw Errors.unauthorized()
  return user
}

// ============================================
// SCHEMAS
// ============================================

const UpdateProfileInput = secureObject({
  fullName: SecureShortText.min(1, 'Name is required'),
  displayName: SecureShortText.optional(),
})

const UpdateAvatarInput = secureObject({
  avatarUrl: SecureImageUrl,
})

const UpdateNotificationPreferencesInput = secureObject({
  emailUpdates: z.boolean(),
  emailMarketing: z.boolean(),
})

const LanguageEnum = z.enum(['en', 'fr', 'de', 'es', 'pt', 'ja', 'ko', 'zh'])

const UpdatePreferencesInput = secureObject({
  timezone: SecureShortText.optional(),
  language: LanguageEnum.optional(),
})

// ============================================
// PROCEDURES
// ============================================

/**
 * Get current user's profile settings
 */
export const getProfile = protectedProcedure
  .route({ method: 'GET', path: '/protected/settings/profile' })
  .handler(async ({ context }) => {
    const user = getUser(context)

    const { data, error } = await context.supabase
      .from('profiles')
      .select('full_name, display_name, avatar_url, timezone, preferred_language')
      .eq('id', user.id)
      .single()

    if (error) { console.error("[settings] operation failed:", error); throw Errors.internal("Operation failed") }
    if (!data) throw Errors.notFound('Profile not found')

    return {
      fullName: data.full_name ?? '',
      displayName: data.display_name ?? '',
      avatarUrl: data.avatar_url ?? '',
      timezone: data.timezone ?? '',
      language: data.preferred_language ?? 'en',
    }
  })

/**
 * Update profile name fields
 * Calls refreshClaims pattern — name is in JWT claims
 */
export const updateProfile = protectedProcedure
  .route({ method: 'POST', path: '/protected/settings/profile' })
  .input(UpdateProfileInput)
  .handler(async ({ context, input }) => {
    const user = getUser(context)

    const { data, error } = await context.supabase
      .from('profiles')
      .update({
        full_name: input.fullName,
        display_name: input.displayName ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('id')
      .single()

    if (error) { console.error("[settings] operation failed:", error); throw Errors.internal("Operation failed") }
    if (!data) throw Errors.notFound('Profile not found')

    return { success: true as const }
  })

/**
 * Update avatar URL after client-side upload
 * Validates URL belongs to our Supabase storage bucket
 */
export const updateAvatar = protectedProcedure
  .route({ method: 'POST', path: '/protected/settings/avatar' })
  .input(UpdateAvatarInput)
  .handler(async ({ context, input }) => {
    const user = getUser(context)

    // Validate that the avatar URL is from our storage bucket
    const expectedPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${user.id}/`

    try {
      const parsed = new URL(input.avatarUrl)
      const expectedBase = new URL(expectedPrefix)
      if (
        parsed.origin !== expectedBase.origin ||
        !parsed.pathname.startsWith(expectedBase.pathname) ||
        parsed.pathname.includes('..')
      ) {
        throw Errors.badRequest('Invalid avatar URL — must be from our storage bucket')
      }
    } catch (e) {
      if (e instanceof ORPCError) throw e
      throw Errors.badRequest('Invalid avatar URL')
    }

    const { data, error } = await context.supabase
      .from('profiles')
      .update({
        avatar_url: input.avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select('id')
      .single()

    if (error) { console.error("[settings] operation failed:", error); throw Errors.internal("Operation failed") }
    if (!data) throw Errors.notFound('Profile not found')

    return { success: true as const }
  })

/**
 * Get notification preferences
 * Creates default row if missing (both toggles default true)
 */
export const getNotificationPreferences = protectedProcedure
  .route({ method: 'GET', path: '/protected/settings/notifications' })
  .handler(async ({ context }) => {
    const user = getUser(context)

    const { data, error } = await context.supabase
      .from('notification_preferences')
      .select('email_updates, email_marketing')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned — that's fine, we'll create defaults
      console.error("[settings] operation failed:", error); throw Errors.internal("Operation failed")
    }

    if (!data) {
      // Create default row
      const { data: created, error: insertError } = await context.supabase
        .from('notification_preferences')
        .insert({
          user_id: user.id,
          email_updates: true,
          email_marketing: true,
        })
        .select('email_updates, email_marketing')
        .single()

      if (insertError) { console.error("[settings] insert failed:", insertError); throw Errors.internal("Operation failed") }
      if (!created) throw Errors.internal('Failed to create notification preferences')

      return {
        emailUpdates: created.email_updates as boolean,
        emailMarketing: created.email_marketing as boolean,
      }
    }

    return {
      emailUpdates: data.email_updates as boolean,
      emailMarketing: data.email_marketing as boolean,
    }
  })

/**
 * Update notification preferences
 * Upserts on user_id unique constraint
 */
export const updateNotificationPreferences = protectedProcedure
  .route({ method: 'POST', path: '/protected/settings/notifications' })
  .input(UpdateNotificationPreferencesInput)
  .handler(async ({ context, input }) => {
    const user = getUser(context)

    const { data, error } = await context.supabase
      .from('notification_preferences')
      .upsert(
        {
          user_id: user.id,
          email_updates: input.emailUpdates,
          email_marketing: input.emailMarketing,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      )
      .select('user_id')
      .single()

    if (error) { console.error("[settings] operation failed:", error); throw Errors.internal("Operation failed") }
    if (!data) throw Errors.notFound('Failed to update notification preferences')

    return { success: true as const }
  })

/**
 * Update user preferences (timezone, language)
 * Updates profiles table fields
 */
export const updatePreferences = protectedProcedure
  .route({ method: 'POST', path: '/protected/settings/preferences' })
  .input(UpdatePreferencesInput)
  .handler(async ({ context, input }) => {
    const user = getUser(context)

    const updates: Record<string, string> = {
      updated_at: new Date().toISOString(),
    }
    if (input.timezone !== undefined) updates.timezone = input.timezone
    if (input.language !== undefined) updates.preferred_language = input.language

    const { data, error } = await context.supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select('id')
      .single()

    if (error) { console.error("[settings] operation failed:", error); throw Errors.internal("Operation failed") }
    if (!data) throw Errors.notFound('Profile not found')

    return { success: true as const }
  })

/**
 * Delete account — triggers Inngest cascade job
 * Returns job ID for polling status
 */
export const deleteAccount = protectedProcedure
  .route({ method: 'POST', path: '/protected/settings/delete-account' })
  .handler(async ({ context }) => {
    const user = getUser(context)

    // Send Inngest event for cascade delete
    try {
      const result = await inngest.send({
        name: 'app/user.delete',
        data: { userId: user.id },
      })

      // Inngest send returns an array of event IDs
      const jobId = result.ids[0] ?? crypto.randomUUID()
      return { jobId }
    } catch (err) {
      console.error('[settings] Failed to send inngest delete-account event:', err)
      throw Errors.internal('Failed to initiate account deletion')
    }
  })

// ============================================
// ROUTER
// ============================================

export const settingsRouter = {
  getProfile,
  updateProfile,
  updateAvatar,
  getNotificationPreferences,
  updateNotificationPreferences,
  updatePreferences,
  deleteAccount,
}
