import { parseAsStringLiteral, createSearchParamsCache } from 'nuqs/server'

export const SETTINGS_TABS = ['profile', 'preferences', 'notifications', 'billing', 'danger'] as const
export type SettingsTab = (typeof SETTINGS_TABS)[number]

export const settingsParsers = {
  tab: parseAsStringLiteral(SETTINGS_TABS).withDefault('profile'),
}

export const settingsParamsCache = createSearchParamsCache(settingsParsers)
