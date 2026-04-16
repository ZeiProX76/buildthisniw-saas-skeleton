import { settingsParamsCache } from '@/lib/search-params/settings'
import { SettingsTabs } from '@/features/settings/components/settings-tabs'
import { SettingsContentServer } from '@/features/settings/components/settings-content-server'

interface SettingsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/**
 * SettingsPage — PPR static shell.
 *
 * Pattern 2 (adapted for tabs):
 *   - Tab navigation (SettingsTabs) OUTSIDE Suspense — always interactive.
 *   - Tab content (SettingsContentServer) INSIDE Suspense — streams in per tab.
 *
 * nuqs: .parse() MUST be called at page level.
 * No 'use client' — this is a server component.
 * No route segment configs (export const dynamic/revalidate) — dead with cacheComponents.
 */
export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  // MANDATORY: populate the request-scoped nuqs cache before any child reads it
  const { tab } = await settingsParamsCache.parse(searchParams)

  return (
    <div className="space-y-6">
      {/* aria-live region for mutation announcements — screen reader support */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="settings-announce"
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Tab navigation — OUTSIDE Suspense, always interactive */}
        <SettingsTabs />

        {/* Tab content — INSIDE Suspense, each tab streams independently */}
        {/* Suspense + ErrorBoundary are owned by SettingsContentServer per-tab */}
        <SettingsContentServer tab={tab} />
      </div>
    </div>
  )
}
