'use server'

/**
 * Onboarding Server Actions
 *
 * oRPC procedures converted to server actions via .actionable().
 * Each mutation automatically calls updateTag('profile') on success.
 * Client hooks call these directly + router.refresh() for instant updates.
 */

import {
  updateName as updateNameProcedure,
  saveAvatar as saveAvatarProcedure,
  saveMotivation as saveMotivationProcedure,
  saveExperience as saveExperienceProcedure,
  saveInterest as saveInterestProcedure,
  complete as completeProcedure,
} from '@/lib/orpc/procedures/onboarding'
import { buildActionContext, cacheInvalidator } from '@/lib/orpc/action-utils'

export const updateNameAction = updateNameProcedure.actionable({
  context: buildActionContext,
  interceptors: [cacheInvalidator<{ success: boolean }>('profile')],
})

export const saveAvatarAction = saveAvatarProcedure.actionable({
  context: buildActionContext,
  interceptors: [cacheInvalidator<{ success: boolean }>('profile')],
})

export const saveMotivationAction = saveMotivationProcedure.actionable({
  context: buildActionContext,
  interceptors: [cacheInvalidator<{ success: boolean }>('profile')],
})

export const saveExperienceAction = saveExperienceProcedure.actionable({
  context: buildActionContext,
  interceptors: [cacheInvalidator<{ success: boolean }>('profile')],
})

export const saveInterestAction = saveInterestProcedure.actionable({
  context: buildActionContext,
  interceptors: [cacheInvalidator<{ success: boolean }>('profile')],
})

export const completeOnboardingAction = completeProcedure.actionable({
  context: buildActionContext,
  interceptors: [cacheInvalidator<{ success: boolean; redirectTo: string }>('profile')],
})
