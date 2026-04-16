import { test, expect } from './fixtures/auth'

/** Dismiss the Next.js dev overlay that intercepts pointer events in dev mode */
async function dismissDevOverlay(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    document.querySelectorAll('nextjs-portal').forEach(el => el.remove())
  }).catch(() => {})
}

test.describe('Settings Page @journey', () => {
  // UPSTREAM-GAP: Designer phase incomplete — SettingsTabs, ProfileForm, PreferencesForm,
  // BillingSection, and DangerZoneForm all render "TODO: designer" stubs.
  // These tests are skipped until the designer phase is complete.

  test.skip('profile tab loads with form fields', async ({ ownerPage }) => {
    await ownerPage.goto('/protected/settings?tab=profile', { waitUntil: 'domcontentloaded' })
    await expect(ownerPage.getByRole('heading', { name: /settings/i })).toBeVisible({ timeout: 10000 })
    await expect(ownerPage.getByRole('heading', { name: /profile/i })).toBeVisible()
    await expect(ownerPage.getByRole('textbox', { name: /full name/i })).toBeVisible()
    await expect(ownerPage.getByRole('textbox', { name: /display name/i })).toBeVisible()
    await expect(ownerPage.getByRole('button', { name: /change avatar/i })).toBeVisible()
    await expect(ownerPage.getByRole('button', { name: /save changes/i })).toBeDisabled()
  })

  test.skip('edit profile name and save persists after reload', async ({ ownerPage }) => {
    await ownerPage.goto('/protected/settings?tab=profile', { waitUntil: 'domcontentloaded' })
    await expect(ownerPage.getByRole('heading', { name: /profile/i })).toBeVisible({ timeout: 10000 })
    await dismissDevOverlay(ownerPage)

    const nameInput = ownerPage.getByRole('textbox', { name: /full name/i })
    const originalName = await nameInput.inputValue()

    // Change name
    await nameInput.fill('E2E Test Name')
    await expect(ownerPage.getByRole('button', { name: /save changes/i })).toBeEnabled()
    await ownerPage.getByRole('button', { name: /save changes/i }).click()

    // Wait for save to complete (button re-enables after mutation)
    await expect(ownerPage.getByRole('button', { name: /save changes/i })).not.toContainText('Saving')

    // Reload and verify persistence
    await ownerPage.reload()
    await dismissDevOverlay(ownerPage)
    await expect(ownerPage.getByRole('textbox', { name: /full name/i })).toHaveValue('E2E Test Name', { timeout: 10000 })

    // Restore original name
    await nameInput.fill(originalName)
    await ownerPage.getByRole('button', { name: /save changes/i }).click()
    await expect(ownerPage.getByRole('button', { name: /save changes/i })).not.toContainText('Saving')
  })

  test.skip('tab navigation via URL params survives reload', async ({ ownerPage }) => {
    await ownerPage.goto('/protected/settings?tab=preferences', { waitUntil: 'domcontentloaded' })
    await expect(ownerPage.getByRole('heading', { name: /preferences/i })).toBeVisible({ timeout: 10000 })

    await ownerPage.reload()
    await expect(ownerPage.getByRole('heading', { name: /preferences/i })).toBeVisible({ timeout: 10000 })
    expect(ownerPage.url()).toContain('tab=preferences')
  })

  test.skip('all settings tabs are navigable', async ({ ownerPage }) => {
    await ownerPage.goto('/protected/settings?tab=profile', { waitUntil: 'domcontentloaded' })
    await expect(ownerPage.getByRole('heading', { name: /profile/i })).toBeVisible({ timeout: 10000 })
    await dismissDevOverlay(ownerPage)

    // Navigate to Preferences
    await ownerPage.getByRole('button', { name: /preferences/i }).click()
    await expect(ownerPage.getByRole('heading', { name: /preferences/i })).toBeVisible({ timeout: 10000 })

    // Navigate to Billing
    await ownerPage.getByRole('button', { name: /billing/i }).click()
    await expect(ownerPage.getByRole('heading', { name: /billing/i })).toBeVisible({ timeout: 10000 })

    // Navigate to Danger Zone
    await ownerPage.getByRole('button', { name: /danger zone/i }).click()
    await expect(ownerPage.getByRole('heading', { name: /danger zone/i })).toBeVisible({ timeout: 10000 })
  })

  test.skip('danger zone form gating requires DELETE and checkbox', async ({ ownerPage }) => {
    await ownerPage.goto('/protected/settings?tab=danger', { waitUntil: 'domcontentloaded' })
    await expect(ownerPage.getByRole('heading', { name: /danger zone/i })).toBeVisible({ timeout: 10000 })
    await dismissDevOverlay(ownerPage)

    const deleteBtn = ownerPage.getByRole('button', { name: /delete my account/i })
    await expect(deleteBtn).toBeDisabled()

    // Type DELETE only -- still disabled
    await ownerPage.getByRole('textbox', { name: /type delete to confirm/i }).fill('DELETE')
    await expect(deleteBtn).toBeDisabled()

    // Check checkbox -- now enabled
    await ownerPage.getByRole('checkbox', { name: /i understand/i }).check()
    await expect(deleteBtn).toBeEnabled()

    // Uncheck -- disabled again
    await ownerPage.getByRole('checkbox', { name: /i understand/i }).uncheck()
    await expect(deleteBtn).toBeDisabled()
  })

  test.skip('save button disabled when form is clean', async ({ ownerPage }) => {
    await ownerPage.goto('/protected/settings?tab=profile', { waitUntil: 'domcontentloaded' })
    await expect(ownerPage.getByRole('heading', { name: /profile/i })).toBeVisible({ timeout: 10000 })
    await expect(ownerPage.getByRole('button', { name: /save changes/i })).toBeDisabled()
  })

  test.fixme('notifications tab loads preferences', async ({ ownerPage }) => {
    // BLOCKED: notification_preferences table does not exist in database
    await ownerPage.goto('/protected/settings?tab=notifications', { waitUntil: 'domcontentloaded' })
    await expect(ownerPage.getByRole('heading', { name: /notifications/i })).toBeVisible({ timeout: 10000 })
    await expect(ownerPage.getByRole('switch', { name: /product update/i })).toBeVisible()
  })

  test.fixme('unsaved changes warning on tab switch', async ({ ownerPage }) => {
    // UPSTREAM-GAP: unsaved changes warning dialog not implemented
    await ownerPage.goto('/protected/settings?tab=profile', { waitUntil: 'domcontentloaded' })
    await ownerPage.getByRole('textbox', { name: /full name/i }).fill('Dirty')
    await ownerPage.getByRole('button', { name: /notifications/i }).click()
    // Expected: warning dialog appears
    // Actual: tab switches immediately with no warning
  })

  test.skip('preferences tab shows timezone and language', async ({ ownerPage }) => {
    await ownerPage.goto('/protected/settings?tab=preferences', { waitUntil: 'domcontentloaded' })
    await expect(ownerPage.getByRole('heading', { name: /preferences/i })).toBeVisible({ timeout: 10000 })
    await expect(ownerPage.getByRole('combobox', { name: /timezone/i })).toBeVisible()
    await expect(ownerPage.getByRole('combobox', { name: /language/i })).toBeVisible()
  })

  test.skip('billing tab shows plan info and upgrade CTA', async ({ ownerPage }) => {
    await ownerPage.goto('/protected/settings?tab=billing', { waitUntil: 'domcontentloaded' })
    await expect(ownerPage.getByRole('heading', { name: /billing/i })).toBeVisible({ timeout: 10000 })
    await expect(ownerPage.getByRole('button', { name: /upgrade to pro/i })).toBeVisible()
  })
})
