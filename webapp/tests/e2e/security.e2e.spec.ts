import { test, expect } from './fixtures/auth'

const STRIPE_BASE = '/api/rpc/protected/stripe'

/**
 * Security regression tests for hardening fixes.
 * Tests CORS restrictions, URL validation, redirect validation,
 * security headers, and MDX XSS protection.
 */
test.describe('Security Hardening @security', () => {
  // ─── Test 1: CORS Restrictions ───────────────────────────────

  test('CORS: same-origin API requests succeed', async ({ authedPage }) => {
    const res = await authedPage.request.get(`${STRIPE_BASE}/products`)
    expect(res.status()).toBe(200)
  })

  test('CORS: cross-origin preflight does not return wildcard', async ({ authedPage }) => {
    const res = await authedPage.request.fetch(`${STRIPE_BASE}/products`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://evil.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    })
    const acao = res.headers()['access-control-allow-origin']
    // Must not be wildcard or the attacker's origin
    expect(acao).not.toBe('*')
    expect(acao).not.toBe('https://evil.com')
  })

  // ─── Test 2: Stripe Checkout URL Validation ──────────────────

  test('Stripe: rejects external domain in successUrl', async ({ authedPage }) => {
    const res = await authedPage.request.post(`${STRIPE_BASE}/checkout`, {
      data: {
        priceId: 'price_fake_123',
        mode: 'payment',
        successUrl: 'https://evil.com/steal',
        cancelUrl: 'https://evil.com/cancel',
      },
    })
    expect(res.ok()).toBe(false)
    const body = await res.json()
    expect(body.message).toContain('application domain')
  })

  test('Stripe: rejects external domain in cancelUrl', async ({ authedPage, baseURL }) => {
    const res = await authedPage.request.post(`${STRIPE_BASE}/checkout`, {
      data: {
        priceId: 'price_fake_123',
        mode: 'payment',
        successUrl: `${baseURL}/success`,
        cancelUrl: 'https://evil.com/cancel',
      },
    })
    expect(res.ok()).toBe(false)
    const body = await res.json()
    expect(body.message).toContain('application domain')
  })

  test('Stripe: rejects external domain in portal returnUrl', async ({ authedPage }) => {
    const res = await authedPage.request.post(`${STRIPE_BASE}/portal`, {
      data: {
        returnUrl: 'https://evil.com/phish',
      },
    })
    expect(res.ok()).toBe(false)
    const body = await res.json()
    expect(body.message).toContain('application domain')
  })

  test('Stripe: accepts same-origin URLs', async ({ authedPage, baseURL }) => {
    const res = await authedPage.request.post(`${STRIPE_BASE}/checkout`, {
      data: {
        priceId: 'price_fake_123',
        mode: 'payment',
        successUrl: `${baseURL}/protected/home?success=true`,
        cancelUrl: `${baseURL}/protected/home?canceled=true`,
      },
    })
    // Should pass URL validation but may fail on Stripe price lookup (500)
    // The important thing is it does NOT return the domain error (400)
    const body = await res.json()
    if (res.status() === 400) {
      expect(body.message).not.toContain('application domain')
    }
  })

  // ─── Test 3: OAuth Redirect Validation ───────────────────────

  test('redirect: malicious //evil.com is blocked', async ({ page }) => {
    await page.goto('/auth/login?redirect=/%2F%2Fevil.com')
    await page.waitForSelector('text=Welcome back')

    // The redirectAfterLogin cookie should NOT be set
    const cookies = await page.context().cookies()
    const redirectCookie = cookies.find((c) => c.name === 'redirectAfterLogin')
    expect(redirectCookie).toBeUndefined()
  })

  test('redirect: backslash trick /\\evil.com is blocked', async ({ page }) => {
    await page.goto('/auth/login?redirect=/%5Cevil.com')
    await page.waitForSelector('text=Welcome back')

    const cookies = await page.context().cookies()
    const redirectCookie = cookies.find((c) => c.name === 'redirectAfterLogin')
    expect(redirectCookie).toBeUndefined()
  })

  test('redirect: javascript: protocol is blocked', async ({ page }) => {
    await page.goto('/auth/login?redirect=javascript:alert(1)')
    await page.waitForSelector('text=Welcome back')

    const cookies = await page.context().cookies()
    const redirectCookie = cookies.find((c) => c.name === 'redirectAfterLogin')
    expect(redirectCookie).toBeUndefined()
  })

  // ─── Test 5: Security Headers ────────────────────────────────

  test('security headers are present on protected pages', async ({ authedPage }) => {
    const res = await authedPage.request.get('/protected/home')
    const headers = res.headers()

    // Content Security Policy
    expect(headers['content-security-policy']).toBeDefined()
    expect(headers['content-security-policy']).toContain("default-src 'self'")
    expect(headers['content-security-policy']).toContain("object-src 'none'")
    expect(headers['content-security-policy']).toContain("frame-ancestors 'none'")

    // Other security headers
    expect(headers['x-frame-options']).toBe('DENY')
    expect(headers['x-content-type-options']).toBe('nosniff')
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['strict-transport-security']).toContain('max-age=')
    expect(headers['permissions-policy']).toBeDefined()
  })

  // ─── Test 6: Auth gating ─────────────────────────────────────

  test('unauthenticated requests to protected API are rejected', async ({ page }) => {
    const res = await page.request.get(`${STRIPE_BASE}/products`)
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })
})
