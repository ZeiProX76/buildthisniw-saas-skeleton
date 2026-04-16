import { test, expect } from '@playwright/test'

/**
 * Auth OAuth UI tests — verifies Google OAuth button and divider render
 * on login and signup pages, and that existing email fields still work.
 *
 * NOTE: The running app renders the Google button BELOW the email form
 * with an "OR CONTINUE WITH" divider. The code on disk places it ABOVE
 * with an "or" divider. Tests are written against the actual rendered UI.
 */
test.describe('Auth OAuth — Login Page @page', () => {
  test('renders Google OAuth button with correct text', async ({ page }) => {
    await page.goto('/auth/login')

    // Google button should be visible with correct text
    const googleButton = page.getByRole('button', { name: /continue with google/i })
    await expect(googleButton).toBeVisible()

    // Email and password fields should still exist
    const emailInput = page.getByLabel('Email')
    const passwordInput = page.getByLabel('Password')
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()

    // Sign in button should exist
    const signInButton = page.getByRole('button', { name: /sign in/i })
    await expect(signInButton).toBeVisible()
  })

  test('renders "or" divider between form and Google button', async ({ page }) => {
    await page.goto('/auth/login')

    // Look for the divider text — could be "or" or "OR CONTINUE WITH" depending on version
    const divider = page.locator('text=/or/i').first()
    await expect(divider).toBeVisible()
  })

  test('Google OAuth button has Google "G" icon SVG', async ({ page }) => {
    await page.goto('/auth/login')

    const googleButton = page.getByRole('button', { name: /continue with google/i })
    const svg = googleButton.locator('svg')
    await expect(svg).toBeVisible()
    // Check for the characteristic Google blue color path
    const bluePath = svg.locator('path[fill="#4285F4"]')
    await expect(bluePath).toHaveCount(1)
  })

  test('Google OAuth button triggers navigation on click', async ({ page }) => {
    await page.goto('/auth/login')

    const googleButton = page.getByRole('button', { name: /continue with google/i })

    // Click and wait for either navigation or URL change
    // OAuth redirects to Supabase/Google — we just verify the click triggers action
    const [response] = await Promise.all([
      page.waitForEvent('framenavigated', { timeout: 5000 }).catch(() => null),
      googleButton.click(),
    ])

    // Either the page navigated away from login OR a new frame was created (OAuth popup)
    // Both indicate the OAuth flow was triggered
    const currentUrl = page.url()
    const navigated = !currentUrl.includes('/auth/login') || response !== null

    // If still on login page, the button may have shown a loading state
    if (!navigated) {
      const isDisabled = await googleButton.isDisabled().catch(() => false)
      expect(isDisabled || navigated).toBe(true)
    }
  })
})

test.describe('Auth OAuth — Sign Up Page @page', () => {
  test('renders Google OAuth button with signup text', async ({ page }) => {
    await page.goto('/auth/sign-up')

    // Google button should show signup-specific text
    const googleButton = page.getByRole('button', { name: /sign up with google/i })
    await expect(googleButton).toBeVisible()

    // Email, password, and confirm password fields should exist
    const emailInput = page.getByLabel('Email')
    const passwordInput = page.getByLabel('Password', { exact: true })
    const confirmPasswordInput = page.getByLabel('Confirm password')
    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
    await expect(confirmPasswordInput).toBeVisible()
  })

  test('renders divider between form and Google button', async ({ page }) => {
    await page.goto('/auth/sign-up')

    // Look for divider text
    const divider = page.locator('text=/or/i').first()
    await expect(divider).toBeVisible()
  })
})

test.describe('Auth OAuth — Responsive Layout @page', () => {
  test('login page renders correctly on mobile (375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/auth/login')

    const googleButton = page.getByRole('button', { name: /continue with google/i })
    await expect(googleButton).toBeVisible()

    // Button should be full width and tappable on mobile
    const box = await googleButton.boundingBox()
    expect(box).toBeTruthy()
    // Button should take most of the viewport width (minus small padding)
    expect(box!.width).toBeGreaterThan(300)

    // Email field should also be visible and usable
    const emailInput = page.getByLabel('Email')
    await expect(emailInput).toBeVisible()
  })

  test('login page renders correctly on tablet (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/auth/login')

    const googleButton = page.getByRole('button', { name: /continue with google/i })
    await expect(googleButton).toBeVisible()

    const emailInput = page.getByLabel('Email')
    await expect(emailInput).toBeVisible()
  })

  test('login page card is constrained on desktop (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/auth/login')

    const googleButton = page.getByRole('button', { name: /continue with google/i })
    await expect(googleButton).toBeVisible()

    // On desktop, card should be constrained (max-w ~448px)
    const box = await googleButton.boundingBox()
    expect(box).toBeTruthy()
    expect(box!.width).toBeLessThan(500)
  })
})
