import type { Page, Locator } from '@playwright/test'

export class OnboardingPage {
  readonly page: Page
  readonly heading: Locator
  readonly nameInput: Locator
  readonly continueButton: Locator
  readonly avatarUploadButton: Locator
  readonly avatarFileInput: Locator
  readonly avatarPreview: Locator
  readonly skipAvatarButton: Locator
  readonly progressIndicator: Locator
  readonly selectCards: Locator

  constructor(page: Page) {
    this.page = page
    // Step 1: Name
    this.heading = page.getByRole('heading', { level: 1 })
    this.nameInput = page.getByLabel('Your name')
    this.continueButton = page.getByRole('button', { name: 'Continue' })

    // Step 2: Avatar
    this.avatarUploadButton = page.getByRole('button', { name: 'Upload avatar' })
    this.avatarFileInput = page.locator('input[type="file"]')
    this.avatarPreview = page.locator('img[alt="Avatar preview"]')
    this.skipAvatarButton = page.getByRole('button', { name: 'Skip for now' })

    // Step progress
    this.progressIndicator = page.locator('[aria-current="step"]')

    // Selection cards (for preference steps)
    this.selectCards = page.locator('button[aria-pressed]')
  }

  async goto() {
    await this.page.goto('/onboarding')
    await this.page.waitForLoadState('networkidle')
  }

  async waitForContent() {
    await this.heading.waitFor({ state: 'visible', timeout: 10_000 })
  }

  async fillName(name: string) {
    await this.nameInput.fill(name)
    await this.continueButton.click()
  }

  async uploadAvatar(filePath: string) {
    await this.avatarFileInput.setInputFiles(filePath)
    await this.avatarPreview.waitFor({ state: 'visible', timeout: 10_000 })
    await this.continueButton.click()
  }

  async skipAvatar() {
    await this.skipAvatarButton.click()
  }

  async selectOption(label: string) {
    await this.page.getByRole('button', { name: label }).click()
  }

  // Step 3: Motivation
  async selectMotivation(label: 'Ship my first SaaS' | 'Learn by building' | 'Ship faster with AI' | 'Explore ideas') {
    await this.selectOption(label)
  }

  // Step 4: Experience
  async selectExperience(label: 'Beginner' | 'Intermediate' | 'Advanced' | 'Agency / Team') {
    await this.selectOption(label)
  }

  // Step 5: Interest
  async selectInterest(label: 'AI & Automation' | 'Developer tools' | 'Consumer apps' | 'B2B SaaS') {
    await this.selectOption(label)
  }

  async waitForRedirect() {
    await this.page.waitForURL('/protected/home', { timeout: 10_000 })
  }
}
