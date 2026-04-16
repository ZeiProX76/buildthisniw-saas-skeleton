import { test, expect } from './fixtures/auth'

test.describe('Protected User API @api', () => {
  test('GET /protected/user/me returns current user', async ({ authedRequest }) => {
    const res = await authedRequest.get('/api/rpc/protected/user/me')
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('email')
    expect(typeof body.id).toBe('string')
    expect(typeof body.email).toBe('string')
  })

  test('POST /protected/user/profile updates profile', async ({ authedRequest }) => {
    const res = await authedRequest.post('/api/rpc/protected/user/profile', {
      data: { fullName: 'Test User' },
    })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('success', true)
  })

  test('POST /protected/user/profile rejects extra fields', async ({ authedRequest }) => {
    const res = await authedRequest.post('/api/rpc/protected/user/profile', {
      data: { fullName: 'Test', role: 'admin' },
    })
    expect(res.ok()).toBe(false)
  })

  test('GET /protected/user/me without auth returns 401+', async ({ playwright }) => {
    const ctx = await playwright.request.newContext({ baseURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' })
    const res = await ctx.get('/api/rpc/protected/user/me')
    expect(res.status()).toBeGreaterThanOrEqual(400)
    expect(res.ok()).toBe(false)
    await ctx.dispose()
  })

  test('POST /protected/user/profile without auth returns 401+', async ({ playwright }) => {
    const ctx = await playwright.request.newContext({ baseURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' })
    const res = await ctx.post('/api/rpc/protected/user/profile', {
      data: { fullName: 'Hacker' },
    })
    expect(res.status()).toBeGreaterThanOrEqual(400)
    expect(res.ok()).toBe(false)
    await ctx.dispose()
  })
})
