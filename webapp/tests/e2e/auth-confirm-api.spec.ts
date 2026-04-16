import { test, expect } from '@playwright/test'

/**
 * API tests for /auth/confirm route.
 * Tests OAuth code exchange error handling and missing params.
 * No mocks — hits the real route handler.
 *
 * Next.js route handler uses redirect() which throws NEXT_REDIRECT
 * internally. The response is a 307 with Location header.
 * Playwright request context follows redirects by default.
 */
test.describe('Auth Confirm Route @api', () => {
  test('invalid OAuth code redirects to /auth/error', async ({ page }) => {
    // Use page.goto to handle Next.js redirects properly
    const response = await page.goto('/auth/confirm?code=invalid_code_12345')

    // After redirect chain, we should end up on /auth/error
    const url = page.url()
    expect(url).toContain('/auth/error')
    // Response should be successful (the error page itself loads fine)
    expect(response?.status()).toBeLessThan(500)
  })

  test('no params redirects to /auth/error with "Invalid verification link"', async ({
    page,
  }) => {
    await page.goto('/auth/confirm')

    const url = page.url()
    expect(url).toContain('/auth/error')
    // The error message should be in the URL
    expect(url).toContain('Invalid')
  })

  test('invalid token_hash redirects to /auth/error', async ({ page }) => {
    await page.goto('/auth/confirm?token_hash=invalid_hash_abc&type=signup')

    const url = page.url()
    expect(url).toContain('/auth/error')
  })

  test('token_hash without type redirects to /auth/error with Invalid message', async ({
    page,
  }) => {
    // token_hash present but type missing — "no valid verification method"
    await page.goto('/auth/confirm?token_hash=some_hash')

    const url = page.url()
    expect(url).toContain('/auth/error')
    expect(url).toContain('Invalid')
  })
})
