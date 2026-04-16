import { z } from 'zod'
import { authProcedure } from '../base'
import { Errors } from '../errors'
import { SecureEmail, SecurePassword, SecureShortText, secureObject } from '../schemas'

const CaptchaToken = z.string().min(1).optional()

/**
 * Sign up with email and password
 * SECURITY: Uses authProcedure with strict rate limiting (10/min)
 */
export const signUp = authProcedure
  .route({ method: 'POST', path: '/auth/sign-up', successStatus: 201 })
  .input(
    secureObject({
      email: SecureEmail,
      password: SecurePassword,
      fullName: SecureShortText.optional(),
      captchaToken: CaptchaToken,
    }),
  )
  .handler(async ({ context, input }) => {
    const { data, error } = await context.supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
        },
        captchaToken: input.captchaToken,
      },
    })

    if (error) {
      throw Errors.badRequest(error.message)
    }

    // Security: Don't return session tokens in response body
    // Session is set via HTTP-only cookies by Supabase SSR
    return {
      success: true,
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
          }
        : null,
      requiresEmailConfirmation: !data.session,
      redirectTo: '/onboarding', // New users always need onboarding
    }
  })

/**
 * Sign in with email and password
 */
export const signIn = authProcedure
  .route({ method: 'POST', path: '/auth/sign-in' })
  .input(
    secureObject({
      email: SecureEmail,
      password: SecurePassword,
      captchaToken: CaptchaToken,
    }),
  )
  .handler(async ({ context, input }) => {
    const { data, error } = await context.supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
      options: {
        captchaToken: input.captchaToken,
      },
    })

    if (error) {
      // Security: Generic error message to prevent email enumeration
      throw Errors.unauthorized('Invalid email or password')
    }

    // Check onboarding status if user exists
    let redirectTo = '/protected/home'
    if (data.user) {
      const { data: profile } = await context.supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', data.user.id)
        .single()

      redirectTo = profile?.onboarding_completed ? '/protected/home' : '/onboarding'
    }

    // Security: Session handled via HTTP-only cookies
    return {
      success: true,
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
          }
        : null,
      redirectTo,
    }
  })

/**
 * Sign out - clears session
 */
export const signOut = authProcedure
  .route({ method: 'POST', path: '/auth/sign-out' })
  .handler(async ({ context }) => {
  const { error } = await context.supabase.auth.signOut()

  if (error) {
    throw Errors.internal('Failed to sign out')
  }

  return { success: true }
})

/**
 * Request password reset email
 */
export const requestPasswordReset = authProcedure
  .route({ method: 'POST', path: '/auth/request-password-reset' })
  .input(
    secureObject({
      email: SecureEmail,
    }),
  )
  .handler(async ({ context, input }) => {
    const { error } = await context.supabase.auth.resetPasswordForEmail(input.email, {
      redirectTo: `${process.env.PORTLESS_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/update-password`,
    })

    if (error) {
      throw Errors.badRequest(error.message)
    }

    // Security: Always return success to prevent email enumeration
    return { success: true }
  })

/**
 * Update password (after reset)
 */
export const updatePassword = authProcedure
  .route({ method: 'POST', path: '/auth/update-password' })
  .input(
    secureObject({
      password: SecurePassword,
    }),
  )
  .handler(async ({ context, input }) => {
    const { data, error } = await context.supabase.auth.updateUser({
      password: input.password,
    })

    if (error) {
      throw Errors.badRequest(error.message)
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
 * Get current session (for client-side auth state)
 */
export const getSession = authProcedure
  .route({ method: 'GET', path: '/auth/session' })
  .handler(async ({ context }) => {
  const {
    data: { session },
  } = await context.supabase.auth.getSession()

  if (!session) {
    return { session: null, user: null }
  }

  return {
    session: {
      expiresAt: session.expires_at,
    },
    user: {
      id: session.user.id,
      email: session.user.email,
    },
  }
})

/**
 * Verify OTP code (for email confirmation)
 */
export const verifyOtp = authProcedure
  .route({ method: 'POST', path: '/auth/verify-otp' })
  .input(
    secureObject({
      email: SecureEmail,
      token: z.string().trim().length(8, 'Verification code must be 8 digits'),
      type: z.enum(['signup', 'recovery', 'magiclink', 'invite', 'email_change']),
    }),
  )
  .handler(async ({ context, input }) => {
    const { data, error } = await context.supabase.auth.verifyOtp({
      email: input.email,
      token: input.token,
      type: input.type,
    })

    if (error) {
      throw Errors.badRequest(error.message)
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
 * Resend verification email
 */
export const resendVerification = authProcedure
  .route({ method: 'POST', path: '/auth/resend-verification' })
  .input(
    secureObject({
      email: SecureEmail,
      type: z.enum(['signup', 'email_change']),
    }),
  )
  .handler(async ({ context, input }) => {
    const { error } = await context.supabase.auth.resend({
      type: input.type,
      email: input.email,
    })

    if (error) {
      throw Errors.badRequest(error.message)
    }

    return { success: true }
  })

/**
 * Auth router
 */
export const authRouter = {
  signUp,
  signIn,
  signOut,
  requestPasswordReset,
  updatePassword,
  getSession,
  verifyOtp,
  resendVerification,
}
