import { test as base, type Page, type APIRequestContext, type TestInfo } from '@playwright/test'
import { AUTH_STATE_PATH } from './constants'

type Fixtures = {
  authedPage: Page
  authedRequest: APIRequestContext
  // Persona aliases — all map to the single test user since we only have one.
  // In a multi-user setup these would use separate auth states (owner, member, free, pro).
  ownerPage: Page
  ownerRequest: APIRequestContext
  memberPage: Page
  memberRequest: APIRequestContext
  proPage: Page
  proRequest: APIRequestContext
  freePage: Page
  freeRequest: APIRequestContext
}

/**
 * Marks a test as skipped (visible in reports) if the page was redirected
 * to onboarding or auth instead of the expected destination.
 */
export async function skipIfRedirected(page: Page, testInfo: TestInfo) {
  const url = page.url()
  if (url.includes('/onboarding') || url.includes('/auth/login')) {
    testInfo.skip(true, `Redirected to ${new URL(url).pathname} — skipping`)
  }
}

export const test = base.extend<Fixtures>({
  authedPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: AUTH_STATE_PATH })
    const page = await context.newPage()
    // eslint-disable-next-line react-hooks/rules-of-hooks -- Playwright fixture `use`, not React hook
    await use(page)
    await page.close()
    await context.close()
  },

  authedRequest: async ({ playwright, baseURL }, use) => {
    const context = await playwright.request.newContext({
      baseURL: baseURL!,
      storageState: AUTH_STATE_PATH,
    })
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(context)
    await context.dispose()
  },

  // ── Owner persona ────────────────────────────────────────────────────────
  ownerPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: AUTH_STATE_PATH })
    const page = await context.newPage()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page)
    await page.close()
    await context.close()
  },

  ownerRequest: async ({ playwright, baseURL }, use) => {
    const context = await playwright.request.newContext({
      baseURL: baseURL!,
      storageState: AUTH_STATE_PATH,
    })
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(context)
    await context.dispose()
  },

  // ── Member persona ───────────────────────────────────────────────────────
  memberPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: AUTH_STATE_PATH })
    const page = await context.newPage()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page)
    await page.close()
    await context.close()
  },

  memberRequest: async ({ playwright, baseURL }, use) => {
    const context = await playwright.request.newContext({
      baseURL: baseURL!,
      storageState: AUTH_STATE_PATH,
    })
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(context)
    await context.dispose()
  },

  // ── Pro persona ──────────────────────────────────────────────────────────
  proPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: AUTH_STATE_PATH })
    const page = await context.newPage()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page)
    await page.close()
    await context.close()
  },

  proRequest: async ({ playwright, baseURL }, use) => {
    const context = await playwright.request.newContext({
      baseURL: baseURL!,
      storageState: AUTH_STATE_PATH,
    })
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(context)
    await context.dispose()
  },

  // ── Free persona ─────────────────────────────────────────────────────────
  freePage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: AUTH_STATE_PATH })
    const page = await context.newPage()
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page)
    await page.close()
    await context.close()
  },

  freeRequest: async ({ playwright, baseURL }, use) => {
    const context = await playwright.request.newContext({
      baseURL: baseURL!,
      storageState: AUTH_STATE_PATH,
    })
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(context)
    await context.dispose()
  },
})

export { expect } from '@playwright/test'
