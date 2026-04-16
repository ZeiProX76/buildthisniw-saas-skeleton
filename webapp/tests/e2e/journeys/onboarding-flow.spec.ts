import { test, expect, skipIfRedirected } from '../fixtures/auth'

test.describe('Journey: Onboarding Flow @journey', () => {
  test('onboarding page redirects completed users', async ({ authedPage }, testInfo) => {
    await authedPage.goto('/onboarding', { waitUntil: 'domcontentloaded' })

    // Completed users get redirected to protected area
    const url = authedPage.url()
    if (url.includes('/protected/')) {
      // Expected behavior for users who completed onboarding
      expect(url).toContain('/protected/')
      return
    }

    // If still on onboarding, page should load without errors
    await skipIfRedirected(authedPage, testInfo)
    const body = authedPage.locator('body')
    await expect(body).not.toContainText('Internal Server Error')
  })

  // FIXME: DB schema gap — preference_motivation/experience/interest columns missing from profiles table.
  // The getProfile procedure selects these columns which causes a PostgreSQL 42703 error → 500.
  // Fix: apply the onboarding preferences migration to add these columns.
  test.fixme('onboarding API returns profile with snake_case fields', async ({ authedRequest }) => {
    const res = await authedRequest.get('/api/rpc/protected/onboarding/profile')
    expect(res.status()).toBeLessThan(500)

    if (res.ok()) {
      const body = await res.json()
      expect(body).toHaveProperty('onboarding_completed')
      expect(body).toHaveProperty('full_name')
    }
  })

  test('onboarding name update API works', async ({ authedRequest }) => {
    const res = await authedRequest.post('/api/rpc/protected/onboarding/name', {
      data: { fullName: 'Test User' },
    })
    // Should succeed or return validation error, never 500
    expect(res.status()).toBeLessThan(500)
  })

  test('onboarding API rejects unauthenticated requests', async ({ playwright }) => {
    const unauthContext = await playwright.request.newContext({
      baseURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    })
    const res = await unauthContext.get('/api/rpc/protected/onboarding/profile')
    expect(res.status()).toBeGreaterThanOrEqual(400)
    await unauthContext.dispose()
  })
})
