import { test, expect } from './fixtures/auth'

const BASE = '/api/rpc/protected/stripe'

/**
 * Direct API route tests for oRPC Stripe procedures.
 * Uses the authedPage fixture — page.request inherits auth cookies.
 */
test.describe('Stripe Integration API @api', () => {
  test('listProducts returns products', async ({ authedPage }) => {
    const res = await authedPage.request.get(`${BASE}/products`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('products')
    expect(Array.isArray(body.products)).toBe(true)
  })

  test('getSubscription returns subscription state', async ({ authedPage }) => {
    const res = await authedPage.request.get(`${BASE}/subscription`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(typeof body.subscribed).toBe('boolean')
  })

  test('createCheckoutSession with dummy price returns error', async ({ authedPage, baseURL }) => {
    const res = await authedPage.request.post(`${BASE}/checkout`, {
      data: {
        priceId: 'price_fake_nonexistent',
        mode: 'payment',
        successUrl: `${baseURL}/protected/billing?result=success`,
        cancelUrl: `${baseURL}/protected/billing?result=cancel`,
      },
    })
    // Dummy priceId should cause a Stripe error
    expect(res.ok()).toBe(false)
  })

  test('createPortalSession returns portal url or error', async ({ authedPage, baseURL }) => {
    const res = await authedPage.request.post(`${BASE}/portal`, {
      data: {
        returnUrl: `${baseURL}/protected/billing`,
      },
    })
    if (res.ok()) {
      const body = await res.json()
      expect(typeof body.url).toBe('string')
    } else {
      // No Stripe customer or portal config — error expected
      expect(res.status()).toBeGreaterThanOrEqual(400)
    }
  })

  test('unauthenticated request is rejected', async ({ page }) => {
    const res = await page.request.get(`${BASE}/products`)
    expect(res.ok()).toBe(false)
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })
})
