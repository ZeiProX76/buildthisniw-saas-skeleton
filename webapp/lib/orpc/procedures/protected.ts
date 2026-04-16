import { protectedProcedure } from '../base'
import { SecureShortText, SecureImageUrl, secureObject } from '../schemas'
import { stripeRouter } from './stripe'
import { onboardingRouter } from './onboarding'
import { creditsRouter } from './credits'
import { jobsRouter } from './jobs'
import { settingsRouter } from './settings'

/**
 * Get current user - returns the authenticated user's profile
 */
export const me = protectedProcedure
  .route({ method: 'GET', path: '/protected/user/me' })
  .handler(async ({ context }) => {
    const { data: claimsData } = await context.supabase.auth.getClaims()
    const claims = claimsData?.claims
    const sub = claims?.sub as string | undefined

    if (!sub) {
      throw new Error('Failed to get user')
    }

    return {
      id: sub,
      email: claims?.email as string | undefined,
      createdAt: claims?.created_at as string | undefined,
      lastSignIn: claims?.last_sign_in_at as string | undefined,
    }
  })

/**
 * Update user profile
 */
export const updateProfile = protectedProcedure
  .route({ method: 'POST', path: '/protected/user/profile' })
  .input(
    secureObject({
      fullName: SecureShortText.optional(),
      avatarUrl: SecureImageUrl.optional(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { data, error } = await context.supabase.auth.updateUser({
      data: {
        full_name: input.fullName,
        avatar_url: input.avatarUrl,
      },
    })

    if (error) {
      throw new Error(error.message)
    }

    return {
      success: true,
      user: data.user
        ? {
          id: data.user.id,
          email: data.user.email,
        }
        : null,
    }
  })

/**
 * Protected router
 */
export const protectedRouter = {
  me,
  updateProfile,
  stripe: stripeRouter,
  onboarding: onboardingRouter,
  credits: creditsRouter,
  jobs: jobsRouter,
  settings: settingsRouter,
}
