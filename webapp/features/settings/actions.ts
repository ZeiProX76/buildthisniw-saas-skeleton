'use server'

/**
 * Settings server actions — wraps oRPC procedures via .actionable().
 * Cache invalidation handled by cacheInvalidator interceptor.
 *
 * Note: cacheInvalidator has NO generic type parameter — it is polymorphic at runtime.
 * The backend trace used cacheInvalidator<Type>('tag') — that pattern is invalid here.
 */

import {
  updateProfile as updateProfileProcedure,
  updateAvatar as updateAvatarProcedure,
  updateNotificationPreferences as updateNotificationPrefsProcedure,
  updatePreferences as updatePreferencesProcedure,
  deleteAccount as deleteAccountProcedure,
} from '@/lib/orpc/procedures/settings'
import { buildActionContext, cacheInvalidator } from '@/lib/orpc/action-utils'

export const updateProfileAction = updateProfileProcedure.actionable({
  context: buildActionContext,
  interceptors: [cacheInvalidator('settings')],
})

export const updateAvatarAction = updateAvatarProcedure.actionable({
  context: buildActionContext,
  interceptors: [cacheInvalidator('settings')],
})

export const updateNotificationPreferencesAction = updateNotificationPrefsProcedure.actionable({
  context: buildActionContext,
  interceptors: [cacheInvalidator('settings')],
})

export const updatePreferencesAction = updatePreferencesProcedure.actionable({
  context: buildActionContext,
  interceptors: [cacheInvalidator('settings')],
})

export const deleteAccountAction = deleteAccountProcedure.actionable({
  context: buildActionContext,
  interceptors: [cacheInvalidator('settings')],
})
