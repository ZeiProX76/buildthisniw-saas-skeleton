import { test, expect } from './fixtures/auth'

const TRIGGER = '/api/rpc/protected/jobs/trigger'
const STATUS = '/api/rpc/protected/jobs/status'

test.describe('Jobs API @api', () => {
  // --- API Contract Tests ---

  test('trigger — happy path returns jobId and queued status', async ({ authedRequest }) => {
    const res = await authedRequest.post(TRIGGER, {
      data: { input: 'test data' },
    })
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body).toHaveProperty('jobId')
    expect(body.status).toBe('queued')
    // jobId should be a valid UUID
    expect(body.jobId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    )
  })

  test('trigger — empty input returns validation error', async ({ authedRequest }) => {
    const res = await authedRequest.post(TRIGGER, {
      data: { input: '' },
    })
    expect(res.ok()).toBeFalsy()
    expect(res.status()).toBeGreaterThanOrEqual(400)
    expect(res.status()).toBeLessThan(500)
  })

  test('trigger — no auth returns 401 @security', async ({ playwright, baseURL }) => {
    const ctx = await playwright.request.newContext({ baseURL: baseURL! })
    const res = await ctx.post(TRIGGER, {
      data: { input: 'hello' },
    })
    expect(res.status()).toBeGreaterThanOrEqual(400)
    await ctx.dispose()
  })

  test('status — unknown jobId returns not_found', async ({ authedRequest }) => {
    const fakeId = '00000000-0000-4000-8000-000000000000'
    const res = await authedRequest.get(`${STATUS}?jobId=${fakeId}`)
    expect(res.ok()).toBeTruthy()
    const body = await res.json()
    expect(body.status).toBe('not_found')
    expect(body.progress).toBe(0)
    expect(body.result).toBeNull()
  })

  test('status — no auth returns 401 @security', async ({ playwright, baseURL }) => {
    const ctx = await playwright.request.newContext({ baseURL: baseURL! })
    const fakeId = '00000000-0000-4000-8000-000000000000'
    const res = await ctx.get(`${STATUS}?jobId=${fakeId}`)
    expect(res.status()).toBeGreaterThanOrEqual(400)
    await ctx.dispose()
  })

  // --- Inngest Flow Tests ---

  test('full pipeline — trigger job and poll to completion', async ({ authedRequest }) => {
    // 1. Trigger
    const triggerRes = await authedRequest.post(TRIGGER, {
      data: { input: 'hello world' },
    })
    expect(triggerRes.ok()).toBeTruthy()
    const { jobId } = await triggerRes.json()
    console.log(`Job triggered: ${jobId}`)

    // 2. Poll for completion (max 30s)
    let status = 'queued'
    let result: string | null = null
    const maxAttempts = 15

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 2000))
      const checkRes = await authedRequest.get(`${STATUS}?jobId=${jobId}`)
      expect(checkRes.ok()).toBeTruthy()
      const data = await checkRes.json()
      status = data.status
      result = data.result
      console.log(`  Poll ${i + 1}: status=${status}, progress=${data.progress}`)
      if (status === 'done' || status === 'failed') break
    }

    // 3. Assert final state
    expect(status).toBe('done')
    expect(result).toBe('DLROW OLLEH')
  })

  test('progress tracking — progress increases monotonically', async ({ authedRequest }) => {
    // 1. Trigger
    const triggerRes = await authedRequest.post(TRIGGER, {
      data: { input: 'progress test' },
    })
    expect(triggerRes.ok()).toBeTruthy()
    const { jobId } = await triggerRes.json()

    // 2. Collect progress values
    const progressValues: number[] = []
    let status = 'queued'
    const maxAttempts = 15

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 2000))
      const checkRes = await authedRequest.get(`${STATUS}?jobId=${jobId}`)
      const data = await checkRes.json()
      progressValues.push(data.progress)
      status = data.status
      if (status === 'done' || status === 'failed') break
    }

    // 3. Assert progress is monotonically non-decreasing
    for (let i = 1; i < progressValues.length; i++) {
      expect(progressValues[i]).toBeGreaterThanOrEqual(progressValues[i - 1])
    }
    // Must end at 100
    expect(progressValues[progressValues.length - 1]).toBe(100)
    // Must have at least one intermediate value between 0 and 100
    const intermediates = progressValues.filter((v) => v > 0 && v < 100)
    expect(intermediates.length).toBeGreaterThan(0)
  })
})
