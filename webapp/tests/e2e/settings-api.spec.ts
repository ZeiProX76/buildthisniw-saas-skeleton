import { test, expect } from './fixtures/auth'

const BASE = '/api/rpc/protected/settings'

test.describe('Settings API @api', () => {
  // -------------------------------------------------------
  // 1. getProfile — happy path + shape
  // -------------------------------------------------------
  test('getProfile returns profile shape', async ({ ownerRequest }) => {
    const res = await ownerRequest.get(`${BASE}/profile`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('fullName')
    expect(body).toHaveProperty('displayName')
    expect(body).toHaveProperty('avatarUrl')
    expect(body).toHaveProperty('timezone')
    expect(body).toHaveProperty('language')
    expect(typeof body.fullName).toBe('string')
    expect(typeof body.language).toBe('string')
  })

  // -------------------------------------------------------
  // 2. getProfile — unauthenticated => 401+
  // -------------------------------------------------------
  test('getProfile rejects unauthenticated @security', async ({ playwright, baseURL }) => {
    const ctx = await playwright.request.newContext({ baseURL: baseURL! })
    try {
      const res = await ctx.get(`${BASE}/profile`)
      expect(res.status()).toBeGreaterThanOrEqual(400)
    } finally {
      await ctx.dispose()
    }
  })

  // -------------------------------------------------------
  // 3. updateProfile — happy path + roundtrip
  // -------------------------------------------------------
  test('updateProfile sets name and roundtrips', async ({ ownerRequest }) => {
    const uniqueName = `TestName-${Date.now()}`
    const res = await ownerRequest.post(`${BASE}/profile`, {
      data: { fullName: uniqueName },
    })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.success).toBe(true)

    // Verify roundtrip
    const getRes = await ownerRequest.get(`${BASE}/profile`)
    const profile = await getRes.json()
    expect(profile.fullName).toBe(uniqueName)
  })

  // -------------------------------------------------------
  // 4. updateProfile — validation: empty name => 400
  // -------------------------------------------------------
  test('updateProfile rejects empty name', async ({ ownerRequest }) => {
    const res = await ownerRequest.post(`${BASE}/profile`, {
      data: { fullName: '' },
    })
    expect(res.status()).toBe(400)
  })

  // -------------------------------------------------------
  // 5. updateAvatar — external URL rejected => 400
  // -------------------------------------------------------
  test('updateAvatar rejects external URL @security', async ({ ownerRequest }) => {
    const res = await ownerRequest.post(`${BASE}/avatar`, {
      data: { avatarUrl: 'https://evil.com/avatar.jpg' },
    })
    expect(res.status()).toBe(400)
  })

  // -------------------------------------------------------
  // 6. getNotificationPreferences — creates defaults if missing
  // -------------------------------------------------------
  test.fixme('getNotificationPreferences returns defaults (BLOCKED: notification_preferences table missing)', async ({ ownerRequest }) => {
    const res = await ownerRequest.get(`${BASE}/notifications`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(typeof body.emailUpdates).toBe('boolean')
    expect(typeof body.emailMarketing).toBe('boolean')
  })

  // -------------------------------------------------------
  // 7. updateNotificationPreferences — happy path + roundtrip
  // -------------------------------------------------------
  test.fixme('updateNotificationPreferences roundtrips (BLOCKED: notification_preferences table missing)', async ({ ownerRequest }) => {
    const res = await ownerRequest.post(`${BASE}/notifications`, {
      data: { emailUpdates: false, emailMarketing: true },
    })
    expect(res.ok()).toBeTruthy()
    expect((await res.json()).success).toBe(true)

    const getRes = await ownerRequest.get(`${BASE}/notifications`)
    const prefs = await getRes.json()
    expect(prefs.emailUpdates).toBe(false)
    expect(prefs.emailMarketing).toBe(true)

    await ownerRequest.post(`${BASE}/notifications`, {
      data: { emailUpdates: true, emailMarketing: true },
    })
  })

  // -------------------------------------------------------
  // 8. updatePreferences — happy path (timezone + language)
  // -------------------------------------------------------
  test('updatePreferences sets timezone and language', async ({ ownerRequest }) => {
    const res = await ownerRequest.post(`${BASE}/preferences`, {
      data: { timezone: 'America/New_York', language: 'en' },
    })
    expect(res.ok()).toBeTruthy()
    expect((await res.json()).success).toBe(true)

    // Verify via getProfile
    const getRes = await ownerRequest.get(`${BASE}/profile`)
    const profile = await getRes.json()
    expect(profile.timezone).toBe('America/New_York')
    expect(profile.language).toBe('en')
  })

  // -------------------------------------------------------
  // 9. updatePreferences — invalid language => 400
  // -------------------------------------------------------
  test('updatePreferences rejects invalid language', async ({ ownerRequest }) => {
    const res = await ownerRequest.post(`${BASE}/preferences`, {
      data: { language: 'xx_INVALID' },
    })
    expect(res.status()).toBe(400)
  })

  // -------------------------------------------------------
  // 10. deleteAccount — requires Inngest dev server
  // -------------------------------------------------------
  test.fixme('deleteAccount returns jobId (requires Inngest dev server)', async ({ ownerRequest }) => {
    const res = await ownerRequest.post(`${BASE}/delete-account`, {
      data: {},
    })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('jobId')
    expect(typeof body.jobId).toBe('string')
  })
})
