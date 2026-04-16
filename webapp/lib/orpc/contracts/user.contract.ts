import { oc } from '@orpc/contract'
import { z } from 'zod'
import { SecureShortText, SecureImageUrl } from '../schemas'

const user = oc
  .route({ tags: ['user'] })
  .errors({ UNAUTHORIZED: {} })

const me = user
  .route({ method: 'GET', path: '/protected/user/me' })
  .output(z.object({
    id: z.string(),
    email: z.string().nullable(),
    createdAt: z.string(),
    lastSignIn: z.string().nullable(),
  }))

const updateProfile = user
  .route({ method: 'POST', path: '/protected/user/profile' })
  .input(z.object({
    fullName: SecureShortText.optional(),
    avatarUrl: SecureImageUrl.optional(),
  }).strict())
  .output(z.object({
    success: z.boolean(),
    user: z.object({
      id: z.string(),
      email: z.string().nullable(),
    }).nullable(),
  }))

export default { me, updateProfile }
