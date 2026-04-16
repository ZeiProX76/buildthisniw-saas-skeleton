import type { Page, Locator } from '@playwright/test'

export class BillingPage {
  readonly page: Page
  readonly heading: Locator
  readonly planCards: Locator
  readonly currentPlanBadge: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByRole('heading', { level: 1 })
    this.planCards = page.locator('[data-testid="plan-card"]')
    this.currentPlanBadge = page.locator('[data-testid="current-plan"]')
  }

  async goto() {
    await this.page.goto('/protected/billing', { waitUntil: 'domcontentloaded' })
  }

  async waitForContent() {
    await this.page.waitForLoadState('networkidle')
  }

  async clickUpgrade() {
    const upgradeBtn = this.page.getByRole('button', { name: /upgrade|buy|get started/i }).first()
    await upgradeBtn.click()
  }

  async hasPlansVisible(): Promise<boolean> {
    return this.page
      .locator('text=/plan|pricing|billing|free|pro|premium/i')
      .first()
      .isVisible()
      .catch(() => false)
  }
}
