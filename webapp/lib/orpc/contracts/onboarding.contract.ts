import { oc } from '@orpc/contract'
import { z } from 'zod'
import { SecureShortText, SecureImageUrl } from '../schemas'

const onb = oc
  .route({ tags: ['onboarding'] })
  .errors({ UNAUTHORIZED: {}, NOT_FOUND: {}, BAD_REQUEST: {} })

const getProfile = onb
  .route({ method: 'GET', path: '/protected/onboarding/profile' })
  .output(z.object({
    full_name: z.string().nullable(),
    avatar_url: z.string().nullable(),
    preference_motivation: z.string().nullable(),
    preference_experience: z.string().nullable(),
    preference_interest: z.string().nullable(),
    onboarding_completed: z.boolean().nullable(),
    google_name: z.string().nullable(),
  }))

const updateName = onb
  .route({ method: 'POST', path: '/protected/onboarding/name' })
  .input(z.object({
    fullName: SecureShortText.min(1, 'Name is required'),
  }).strict())
  .output(z.object({ success: z.boolean() }))

const saveAvatar = onb
  .route({ method: 'POST', path: '/protected/onboarding/avatar' })
  .input(z.object({
    avatarUrl: SecureImageUrl,
  }).strict())
  .output(z.object({ success: z.boolean() }))

const saveMotivation = onb
  .route({ method: 'POST', path: '/protected/onboarding/motivation' })
  .input(z.object({
    value: z.enum(['ship_first_saas', 'learn_by_building', 'speed_up_workflow', 'explore_ideas']),
  }).strict())
  .output(z.object({ success: z.boolean() }))

const saveExperience = onb
  .route({ method: 'POST', path: '/protected/onboarding/experience' })
  .input(z.object({
    value: z.enum(['beginner', 'intermediate', 'advanced', 'agency_team']),
  }).strict())
  .output(z.object({ success: z.boolean() }))

const saveInterest = onb
  .route({ method: 'POST', path: '/protected/onboarding/interest' })
  .input(z.object({
    value: z.enum(['ai_automation', 'developer_tools', 'consumer_apps', 'b2b_saas']),
  }).strict())
  .output(z.object({ success: z.boolean() }))

const complete = onb
  .route({ method: 'POST', path: '/protected/onboarding/complete' })
  .output(z.object({
    success: z.boolean(),
    redirectTo: z.string(),
  }))

export default { getProfile, updateName, saveAvatar, saveMotivation, saveExperience, saveInterest, complete }
