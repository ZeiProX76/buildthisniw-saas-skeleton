import { test, expect } from '@playwright/test'

test.describe('Marketing & Docs Pages @page @smoke', () => {
  // ─── Landing Page ─────────────────────────────────────────────

  test('landing page loads with hero content', async ({ page }) => {
    await page.goto('/')

    // Should have a main element
    await expect(page.locator('main')).toBeVisible()

    // Should not show an error
    const body = page.locator('body')
    await expect(body).not.toContainText('Internal Server Error')
    await expect(body).not.toContainText('Application error')

    // The page should have some heading content (hero section)
    const hasHeading = await page.locator('h1, h2').first().isVisible().catch(() => false)
    expect(hasHeading).toBe(true)
  })

  // ─── Terms of Service ────────────────────────────────────────

  test('terms page loads with legal content', async ({ page }) => {
    await page.goto('/terms')

    await expect(page.getByRole('heading', { name: /terms of service/i })).toBeVisible()

    // Should have section content
    await expect(page.getByText(/agreement to terms/i)).toBeVisible()
  })

  // ─── Privacy Policy ──────────────────────────────────────────

  test('privacy page loads with privacy content', async ({ page }) => {
    await page.goto('/privacy')

    await expect(page.getByRole('heading', { name: /privacy policy/i })).toBeVisible()

    // Should have section content
    await expect(page.getByText(/who we are/i)).toBeVisible()
  })

  // ─── Docs Page ────────────────────────────────────────────────

  test('docs page loads without error', async ({ page }) => {
    const response = await page.goto('/docs')

    // Should not be a 500 error
    expect(response?.status()).toBeLessThan(500)

    // Should have some content
    const body = page.locator('body')
    await expect(body).not.toContainText('Internal Server Error')
    await expect(body).not.toContainText('Application error')
  })

  // ─── Setup Page ───────────────────────────────────────────────

  test('setup page loads in dev mode', async ({ page }) => {
    // In dev mode, setup page should load (redirects to / in production)
    const response = await page.goto('/setup')

    // Should not be a 500 error
    expect(response?.status()).toBeLessThan(500)

    const body = page.locator('body')
    await expect(body).not.toContainText('Internal Server Error')
  })
})
