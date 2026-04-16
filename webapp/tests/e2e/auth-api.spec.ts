import { test, expect } from './fixtures/auth'
import { TEST_EMAIL, TEST_PASSWORD } from './fixtures/constants'

test.describe('Auth API @api', () => {
  test('signIn with valid credentials succeeds', async ({ page }) => {
    const res = await page.request.post('/api/rpc/auth/sign-in', {
      data: { email: TEST_EMAIL, password: TEST_PASSWORD },
    })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('success', true)
    expect(body).toHaveProperty('user')
    expect(body.user).toHaveProperty('email', TEST_EMAIL)
    expect(body).toHaveProperty('redirectTo')
  })

  test('signIn with wrong password returns error', async ({ page }) => {
    const res = await page.request.post('/api/rpc/auth/sign-in', {
      data: { email: TEST_EMAIL, password: 'wrongpassword123' },
    })
    expect(res.ok()).toBe(false)
    expect(res.status()).toBeGreaterThanOrEqual(400)
  })

  test('signIn with invalid email format fails validation', async ({ page }) => {
    const res = await page.request.post('/api/rpc/auth/sign-in', {
      data: { email: 'not-an-email', password: TEST_PASSWORD },
    })
    expect(res.ok()).toBe(false)
  })

  test('signUp with short password fails validation', async ({ page }) => {
    const res = await page.request.post('/api/rpc/auth/sign-up', {
      data: { email: 'test-validation@example.com', password: '123' },
    })
    expect(res.ok()).toBe(false)
  })

  test('signUp with invalid email fails validation', async ({ page }) => {
    const res = await page.request.post('/api/rpc/auth/sign-up', {
      data: { email: 'bad-email', password: '12345678' },
    })
    expect(res.ok()).toBe(false)
  })

  test('getSession with auth cookies returns session', async ({ authedPage }) => {
    const res = await authedPage.request.get('/api/rpc/auth/session')
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('user')
    expect(body.user).toHaveProperty('id')
    expect(body.user).toHaveProperty('email')
  })

  test('getSession without auth returns null session', async ({ page }) => {
    const res = await page.request.get('/api/rpc/auth/session')
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.session).toBeNull()
    expect(body.user).toBeNull()
  })

  test('requestPasswordReset always returns success (anti-enumeration)', async ({ page }) => {
    const res = await page.request.post('/api/rpc/auth/request-password-reset', {
      data: { email: 'nonexistent@example.com' },
    })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('success', true)
  })

  test('verifyOtp with invalid token fails', async ({ page }) => {
    const res = await page.request.post('/api/rpc/auth/verify-otp', {
      data: { email: TEST_EMAIL, token: '00000000', type: 'signup' },
    })
    expect(res.ok()).toBe(false)
  })

  test('resendVerification accepts valid input', async ({ page }) => {
    const res = await page.request.post('/api/rpc/auth/resend-verification', {
      data: { email: TEST_EMAIL, type: 'signup' },
    })
    // May succeed or fail depending on Supabase state, but should not 500
    expect(res.status()).not.toBe(500)
  })
})
