import { test, expect } from '@playwright/test'

test.describe('Public API @api @smoke', () => {
  test('GET /public/health returns ok status', async ({ request }) => {
    const res = await request.get('/api/rpc/public/health')
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('status', 'ok')
    expect(body).toHaveProperty('timestamp')
    expect(typeof body.timestamp).toBe('string')
  })

  test('POST /public/echo returns echoed message', async ({ request }) => {
    const res = await request.post('/api/rpc/public/echo', {
      data: { message: 'hello' },
    })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('message', 'hello')
    expect(body).toHaveProperty('timestamp')
  })

  test('POST /public/echo rejects missing message field', async ({ request }) => {
    const res = await request.post('/api/rpc/public/echo', {
      data: {},
    })
    expect(res.ok()).toBe(false)
  })

  test('POST /public/echo rejects oversized message (>500 chars)', async ({ request }) => {
    const longMessage = 'a'.repeat(501)
    const res = await request.post('/api/rpc/public/echo', {
      data: { message: longMessage },
    })
    expect(res.ok()).toBe(false)
  })

  test('POST /public/echo rejects extra fields (strict mode)', async ({ request }) => {
    const res = await request.post('/api/rpc/public/echo', {
      data: { message: 'hello', extra: 'field' },
    })
    expect(res.ok()).toBe(false)
  })

  test('GET /public/health requires no auth', async ({ request }) => {
    const res = await request.get('/api/rpc/public/health')
    expect(res.ok()).toBeTruthy()
  })
})
