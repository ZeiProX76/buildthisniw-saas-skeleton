import { Suspense } from 'react'
import type { SettingsTab } from '@/lib/search-params/settings'
import { ProfileFormServer } from './profile-form-server'
import { PreferencesFormServer } from './preferences-form-server'
import { NotificationsFormServer } from './notifications-form-server'
import { BillingSection } from './billing-section'
import { DangerZoneSection } from './danger-zone-section'
import { SettingsFormSkeleton } from './settings-form-skeleton'
import SettingsErrorBoundary from './settings-error-boundary'

interface SettingsContentServerProps {
  tab: SettingsTab
}

/**
 * SettingsContentServer — renders the active tab's form.
 * Each tab gets its own Suspense + ErrorBoundary.
 * This component is a server component — no 'use client'.
 */
export function SettingsContentServer({ tab }: SettingsContentServerProps) {
  return (
    <div data-slot="settings-content" className="flex-1 min-w-0">
      {tab === 'profile' && (
        <SettingsErrorBoundary title="Failed to load profile settings">
          <Suspense fallback={<SettingsFormSkeleton rows={3} />}>
            <ProfileFormServer />
          </Suspense>
        </SettingsErrorBoundary>
      )}
      {tab === 'preferences' && (
        <SettingsErrorBoundary title="Failed to load preferences">
          <Suspense fallback={<SettingsFormSkeleton rows={2} />}>
            <PreferencesFormServer />
          </Suspense>
        </SettingsErrorBoundary>
      )}
      {tab === 'notifications' && (
        <SettingsErrorBoundary title="Failed to load notification settings">
          <Suspense fallback={<SettingsFormSkeleton rows={2} />}>
            <NotificationsFormServer />
          </Suspense>
        </SettingsErrorBoundary>
      )}
      {tab === 'billing' && (
        <SettingsErrorBoundary title="Failed to load billing">
          <Suspense fallback={<SettingsFormSkeleton rows={2} />}>
            <BillingSection />
          </Suspense>
        </SettingsErrorBoundary>
      )}
      {tab === 'danger' && (
        <SettingsErrorBoundary title="Failed to load danger zone">
          <Suspense fallback={<SettingsFormSkeleton rows={1} />}>
            <DangerZoneSection />
          </Suspense>
        </SettingsErrorBoundary>
      )}
    </div>
  )
}
