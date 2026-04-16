import { test, expect, skipIfRedirected } from '../fixtures/auth'
import { BillingPage } from '../pages/BillingPage'

test.describe('Journey: Billing Flow @journey', () => {
  test('billing page shows plan information', async ({ authedPage }, testInfo) => {
    const billing = new BillingPage(authedPage)
    await billing.goto()
    await skipIfRedirected(authedPage, testInfo)
    await billing.waitForContent()

    const hasPlans = await billing.hasPlansVisible()
    expect(hasPlans).toBe(true)
  })

  test('billing page loads without errors', async ({ authedPage }, testInfo) => {
    const billing = new BillingPage(authedPage)
    await billing.goto()
    await skipIfRedirected(authedPage, testInfo)

    const body = authedPage.locator('body')
    await expect(body).not.toContainText('Internal Server Error')
    await expect(body).not.toContainText('Application error')
  })

  test('stripe products API returns data', async ({ authedRequest }) => {
    const res = await authedRequest.get('/api/rpc/protected/stripe/products')
    expect(res.status()).toBeLessThan(500)
  })

  test('stripe checkout rejects missing priceId', async ({ authedRequest }) => {
    const res = await authedRequest.post('/api/rpc/protected/stripe/checkout', {
      data: {},
    })
    expect(res.ok()).toBe(false)
    expect(res.status()).toBe(400)
  })
})
