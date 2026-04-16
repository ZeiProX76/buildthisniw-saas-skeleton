import { test, expect } from './fixtures/auth'

test.describe('Credits API @api', () => {
  test('GET /protected/credits/balance returns balance array (authed)', async ({ authedPage }) => {
    const res = await authedPage.request.get('/api/rpc/protected/credits/balance')
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
  })

  test('GET /protected/credits/balance items have expected shape', async ({ authedPage }) => {
    const res = await authedPage.request.get('/api/rpc/protected/credits/balance')
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    if (body.length > 0) {
      const item = body[0]
      expect(item).toHaveProperty('creditType')
      expect(item).toHaveProperty('balance')
      expect(item).toHaveProperty('allocation')
      expect(item).toHaveProperty('period')
    }
  })

  test('GET /protected/credits/balance without auth returns 401+', async ({ page }) => {
    const res = await page.request.get('/api/rpc/protected/credits/balance')
    expect(res.status()).toBeGreaterThanOrEqual(400)
    expect(res.ok()).toBe(false)
  })
})
