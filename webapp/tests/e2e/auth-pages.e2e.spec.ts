import { test, expect } from './fixtures/auth'
import { TEST_EMAIL, TEST_PASSWORD } from './fixtures/constants'

test.describe('Auth Pages @page @smoke', () => {
  // ─── Login Page ────────────────────────────────────────────────

  test('login page renders with correct structure', async ({ page }) => {
    await page.goto('/auth/login')

    // Heading
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible()

    // Email + password inputs
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()

    // Sign in button
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()

    // Forgot password link
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible()

    // Google OAuth button
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible()

    // Sign up link
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()
  })

  // ─── Sign-Up Page ─────────────────────────────────────────────

  test('sign-up page renders with correct structure', async ({ page }) => {
    await page.goto('/auth/sign-up')

    // Heading
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible()

    // Email, password, confirm password inputs
    await expect(page.locator('input#email')).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()
    await expect(page.locator('input#repeat-password')).toBeVisible()

    // Create account button
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()

    // Google OAuth button
    await expect(page.getByRole('button', { name: /google/i })).toBeVisible()

    // Sign in link
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
  })

  // ─── Forgot Password Page ────────────────────────────────────

  test('forgot-password page renders with correct structure', async ({ page }) => {
    await page.goto('/auth/forgot-password')

    // Card title (not a semantic heading role)
    await expect(page.getByText(/reset your password/i).first()).toBeVisible()

    // Email input
    await expect(page.locator('input#email')).toBeVisible()

    // Submit button
    await expect(page.getByRole('button', { name: /send reset email/i })).toBeVisible()

    // Back to login link
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible()
  })

  // ─── Update Password Page ────────────────────────────────────

  test('update-password page renders with correct structure', async ({ page }) => {
    await page.goto('/auth/update-password')

    // Card title
    await expect(page.getByText(/reset your password/i).first()).toBeVisible()

    // Password input
    await expect(page.locator('input#password')).toBeVisible()

    // Submit button
    await expect(page.getByRole('button', { name: /save new password/i })).toBeVisible()
  })

  // ─── Sign-Up Success Page ────────────────────────────────────

  test('sign-up-success page shows session expired without email', async ({ page }) => {
    await page.goto('/auth/sign-up-success')

    // Without an email param it shows "Session Expired" or "Verify Your Email"
    await expect(page.getByText(/session expired|verify your email/i).first()).toBeVisible()
  })

  test('sign-up-success page with email shows OTP verification', async ({ page }) => {
    await page.goto('/auth/sign-up-success?email=test%40example.com')

    // Should show the verify your email title
    await expect(page.getByText(/verify your email/i).first()).toBeVisible()

    // Should display the email
    await expect(page.getByText('test@example.com')).toBeVisible()

    // Should have the resend code button
    await expect(page.getByRole('button', { name: /resend code/i })).toBeVisible()
  })

  // ─── Error Page ───────────────────────────────────────────────

  test('auth error page renders error message', async ({ page }) => {
    await page.goto('/auth/error')

    // Card title
    await expect(page.getByText(/something went wrong/i)).toBeVisible()

    // Default error text
    await expect(page.getByText(/unspecified error/i)).toBeVisible()
  })

  test('auth error page shows error code from params', async ({ page }) => {
    await page.goto('/auth/error?error=access_denied')

    await expect(page.getByText(/something went wrong/i)).toBeVisible()
    await expect(page.getByText('access_denied')).toBeVisible()
  })

  // ─── Login Flow ───────────────────────────────────────────────

  test('login flow redirects to protected area', async ({ page }) => {
    await page.goto('/auth/login')

    // Fill credentials
    await page.locator('input#email').fill(TEST_EMAIL)
    await page.locator('input#password').fill(TEST_PASSWORD)

    // Submit
    await page.getByRole('button', { name: /sign in/i }).click()

    // Should redirect to /protected/home or /onboarding
    await page.waitForURL(/\/(protected|onboarding)/, { timeout: 15000 })
    const url = page.url()
    expect(url).toMatch(/\/(protected|onboarding)/)
  })
})
