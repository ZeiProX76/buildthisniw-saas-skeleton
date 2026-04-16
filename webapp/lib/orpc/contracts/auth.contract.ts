import { oc } from '@orpc/contract'
import { z } from 'zod'
import { SecureEmail, SecurePassword, SecureShortText } from '../schemas'

const auth = oc
  .route({ tags: ['auth'] })
  .errors({ UNAUTHORIZED: {}, BAD_REQUEST: {} })

const UserResponseSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
}).nullable()

const signUp = auth
  .route({ method: 'POST', path: '/auth/sign-up', successStatus: 201 })
  .input(z.object({
    email: SecureEmail,
    password: SecurePassword,
    fullName: SecureShortText.optional(),
    captchaToken: z.string().min(1).optional(),
  }).strict())
  .output(z.object({
    success: z.boolean(),
    user: UserResponseSchema,
    requiresEmailConfirmation: z.boolean(),
    redirectTo: z.string(),
  }))

const signIn = auth
  .route({ method: 'POST', path: '/auth/sign-in' })
  .input(z.object({
    email: SecureEmail,
    password: SecurePassword,
    captchaToken: z.string().min(1).optional(),
  }).strict())
  .output(z.object({
    success: z.boolean(),
    user: UserResponseSchema,
    redirectTo: z.string(),
  }))

const signOut = auth
  .route({ method: 'POST', path: '/auth/sign-out' })
  .output(z.object({ success: z.boolean() }))

const requestPasswordReset = auth
  .route({ method: 'POST', path: '/auth/request-password-reset' })
  .input(z.object({
    email: SecureEmail,
  }).strict())
  .output(z.object({ success: z.boolean() }))

const updatePassword = auth
  .route({ method: 'POST', path: '/auth/update-password' })
  .input(z.object({
    password: SecurePassword,
  }).strict())
  .output(z.object({
    success: z.boolean(),
    user: UserResponseSchema,
  }))

const getSession = auth
  .route({ method: 'GET', path: '/auth/session' })
  .output(z.object({
    session: z.object({ expiresAt: z.number().nullable() }).nullable(),
    user: UserResponseSchema,
  }))

const verifyOtp = auth
  .route({ method: 'POST', path: '/auth/verify-otp' })
  .input(z.object({
    email: SecureEmail,
    token: z.string().trim().length(8),
    type: z.enum(['signup', 'recovery', 'magiclink', 'invite', 'email_change']),
  }).strict())
  .output(z.object({
    success: z.boolean(),
    user: UserResponseSchema,
  }))

const resendVerification = auth
  .route({ method: 'POST', path: '/auth/resend-verification' })
  .input(z.object({
    email: SecureEmail,
    type: z.enum(['signup', 'email_change']),
  }).strict())
  .output(z.object({ success: z.boolean() }))

export default { signUp, signIn, signOut, requestPasswordReset, updatePassword, getSession, verifyOtp, resendVerification }
