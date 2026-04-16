import type { Page, Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  readonly heading: Locator
  readonly sidebar: Locator
  readonly homeLink: Locator
  readonly userMenu: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByText('Welcome').first()
    this.sidebar = page.locator('aside, [role="navigation"]').first()
    this.homeLink = page.getByText('Home', { exact: true }).first()
    this.userMenu = page.locator('text=Test User').first()
  }

  async goto() {
    await this.page.goto('/protected/home', { waitUntil: 'domcontentloaded' })
  }

  async waitForContent() {
    await this.heading.waitFor({ state: 'visible', timeout: 10_000 })
  }
}
