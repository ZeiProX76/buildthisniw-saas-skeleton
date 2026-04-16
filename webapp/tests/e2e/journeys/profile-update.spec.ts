import { test, expect, skipIfRedirected } from '../fixtures/auth'
import { ProfilePage } from '../pages/ProfilePage'

test.describe('Journey: Profile View @journey', () => {
  // FIXME: DB schema gap — profiles table missing preference_motivation/experience/interest columns.
  // The getProfile procedure fails with 42703, causing the profile page to error-boundary instead of render.
  test.fixme('profile page shows user info', async ({ authedPage }, testInfo) => {
    const profile = new ProfilePage(authedPage)
    await profile.goto()
    await skipIfRedirected(authedPage, testInfo)
    await profile.waitForContent()

    // Account section visible with email
    await expect(profile.accountSection).toBeVisible()
    const email = await profile.getUserEmail()
    expect(email).toContain('@')
  })

  // FIXME: DB schema gap — profiles table missing preference_motivation/experience/interest columns.
  // The getProfile procedure fails with 42703, causing the profile page to error-boundary instead of render.
  test.fixme('profile page shows preferences', async ({ authedPage }, testInfo) => {
    const profile = new ProfilePage(authedPage)
    await profile.goto()
    await skipIfRedirected(authedPage, testInfo)
    await profile.waitForContent()

    await expect(profile.preferencesSection).toBeVisible()
  })

  test('profile update API works', async ({ authedRequest }) => {
    // Read current name
    const meRes = await authedRequest.get('/api/rpc/protected/user/me')
    expect(meRes.ok()).toBeTruthy()

    // Update name via API
    const testName = `E2E Test ${Date.now()}`
    const updateRes = await authedRequest.post('/api/rpc/protected/user/profile', {
      data: { fullName: testName },
    })
    expect(updateRes.ok()).toBeTruthy()
    const body = await updateRes.json()
    expect(body).toHaveProperty('success', true)

    // Restore original name
    await authedRequest.post('/api/rpc/protected/user/profile', {
      data: { fullName: 'Test User' },
    })
  })

  test('profile update rejects extra fields', async ({ authedRequest }) => {
    const res = await authedRequest.post('/api/rpc/protected/user/profile', {
      data: { fullName: 'Test', role: 'admin' },
    })
    expect(res.ok()).toBe(false)
  })
})
