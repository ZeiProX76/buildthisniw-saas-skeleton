import type { Page, Locator } from '@playwright/test'

export class ProfilePage {
  readonly page: Page
  readonly heading: Locator
  readonly accountSection: Locator
  readonly preferencesSection: Locator
  readonly editButton: Locator

  constructor(page: Page) {
    this.page = page
    this.heading = page.getByText('Profile').first()
    // h3 renders "Account" / "Preferences" in DOM — CSS text-transform:uppercase is visual only
    this.accountSection = page.getByText('Account').first()
    this.preferencesSection = page.getByText('Preferences').first()
    this.editButton = page.locator('button:has(svg), [aria-label*="edit" i]').first()
  }

  async goto() {
    await this.page.goto('/protected/profile', { waitUntil: 'domcontentloaded' })
  }

  async waitForContent() {
    await this.heading.waitFor({ state: 'visible', timeout: 10_000 })
  }

  async getUserName(): Promise<string> {
    // The name is displayed as text near the avatar, not as an input
    const nameEl = this.page.locator('h1, h2, h3').filter({ hasText: /^(?!Profile)/ }).first()
    return (await nameEl.textContent()) ?? ''
  }

  async getUserEmail(): Promise<string> {
    // Email shown in the ACCOUNT section
    const emailEl = this.page.locator('text=@').first()
    return (await emailEl.textContent()) ?? ''
  }
}
