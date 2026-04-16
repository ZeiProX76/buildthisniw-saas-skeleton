import { test, expect } from './fixtures/auth'

const STRIPE_BASE = '/api/rpc/protected/stripe'

test.describe('Stripe Write API @api', () => {
  test('createCheckoutSession with valid URLs but fake priceId fails on Stripe', async ({ authedPage, baseURL }) => {
    const res = await authedPage.request.post(`${STRIPE_BASE}/checkout`, {
      data: {
        priceId: 'price_fake_nonexistent',
        mode: 'subscription',
        successUrl: `${baseURL}/protected/home?success=true`,
        cancelUrl: `${baseURL}/protected/home?canceled=true`,
      },
    })
    // Should pass URL validation but fail on Stripe price lookup
    expect(res.ok()).toBe(false)
    const body = await res.json()
    expect(body.message || '').not.toContain('application domain')
  })

  test('upgradeSubscription with fake priceId fails (no active subscription)', async ({ authedPage }) => {
    const res = await authedPage.request.post(`${STRIPE_BASE}/upgrade`, {
      data: { priceId: 'price_fake_123' },
    })
    expect(res.ok()).toBe(false)
  })

  test('createPortalSession with valid returnUrl passes auth/validation', async ({ authedPage, baseURL }) => {
    const res = await authedPage.request.post(`${STRIPE_BASE}/portal`, {
      data: { returnUrl: `${baseURL}/protected/home` },
    })
    // May fail on Stripe (no portal config) but should not fail on URL validation
    if (!res.ok()) {
      const body = await res.json()
      expect(body.message || '').not.toContain('application domain')
    }
  })

  test('createCheckoutSession without auth returns 401+', async ({ page, baseURL }) => {
    const res = await page.request.post(`${STRIPE_BASE}/checkout`, {
      data: {
        priceId: 'price_fake',
        mode: 'payment',
        successUrl: `${baseURL}/success`,
        cancelUrl: `${baseURL}/cancel`,
      },
    })
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })

  test('upgradeSubscription without auth returns 401+', async ({ page }) => {
    const res = await page.request.post(`${STRIPE_BASE}/upgrade`, {
      data: { priceId: 'price_fake' },
    })
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })

  test('createPortalSession without auth returns 401+', async ({ page, baseURL }) => {
    const res = await page.request.post(`${STRIPE_BASE}/portal`, {
      data: { returnUrl: `${baseURL}/home` },
    })
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })
})
