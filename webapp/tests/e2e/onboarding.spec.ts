import { test, expect } from './fixtures/auth'
import { OnboardingPage } from './pages/OnboardingPage'

/**
 * Onboarding E2E tests.
 *
 * IMPORTANT: Flow tests require onboarding_completed=false for the test user.
 * They are skipped in the general suite because the test user has already
 * completed onboarding. Run these specifically when testing onboarding changes
 * after resetting the test user's onboarding state in the database.
 *
 * To run: reset profiles.onboarding_completed=false for the test user,
 * then: npx playwright test tests/e2e/onboarding.spec.ts
 */

const SKIP_REASON = 'Requires onboarding_completed=false — run only when testing onboarding'

test.describe('Onboarding @journey', () => {
  test.skip(!!process.env.CI || !process.env.TEST_ONBOARDING, SKIP_REASON)

  test('page loads and displays first step', async ({ authedPage }) => {
    const onboarding = new OnboardingPage(authedPage)
    await onboarding.goto()

    await expect(onboarding.heading).toContainText("What's your name?")
    await expect(onboarding.nameInput).toBeVisible()
    await expect(onboarding.continueButton).toBeVisible()
    await expect(onboarding.progressIndicator).toBeVisible()
  })

  test('complete full onboarding flow', async ({ authedPage }) => {
    const onboarding = new OnboardingPage(authedPage)
    await onboarding.goto()

    // Step 1: Enter name
    await expect(onboarding.heading).toContainText("What's your name?")
    await onboarding.fillName('Test User')

    // Step 2: Skip avatar
    await expect(onboarding.heading).toContainText('Add a photo')
    await onboarding.skipAvatar()

    // Step 3: Select motivation
    await expect(onboarding.heading).toContainText('What brings you here?')
    await onboarding.selectMotivation('Ship my first SaaS')

    // Step 4: Select experience
    await expect(onboarding.heading).toContainText('Your experience level?')
    await onboarding.selectExperience('Intermediate')

    // Step 5: Select interest
    await expect(onboarding.heading).toContainText('What excites you most?')
    await onboarding.selectInterest('AI & Automation')

    // Should show completion screen then redirect
    await expect(onboarding.heading).toContainText("You're in!")
    await onboarding.waitForRedirect()
    await expect(authedPage).toHaveURL('/protected/home')
  })

  test('avatar step shows upload button and skip', async ({ authedPage }) => {
    const onboarding = new OnboardingPage(authedPage)
    await onboarding.goto()

    // Step 1: Enter name
    await onboarding.fillName('Avatar Test User')

    // Step 2: Avatar step
    await expect(onboarding.heading).toContainText('Add a photo')
    await expect(onboarding.avatarUploadButton).toBeVisible()
    await expect(onboarding.skipAvatarButton).toBeVisible()
  })

  test('preference questions auto-advance on selection', async ({ authedPage }) => {
    const onboarding = new OnboardingPage(authedPage)
    await onboarding.goto()

    await onboarding.fillName('Auto Advance Test')
    await onboarding.skipAvatar()

    // Step 3: Motivation — should auto-advance after click
    await expect(onboarding.heading).toContainText('What brings you here?')
    const motivationCards = await onboarding.selectCards.count()
    expect(motivationCards).toBe(4)
    await onboarding.selectMotivation('Explore ideas')

    // Should auto-advance to Step 4
    await expect(onboarding.heading).toContainText('Your experience level?')
    const experienceCards = await onboarding.selectCards.count()
    expect(experienceCards).toBe(4)
    await onboarding.selectExperience('Advanced')

    // Should auto-advance to Step 5
    await expect(onboarding.heading).toContainText('What excites you most?')
    const interestCards = await onboarding.selectCards.count()
    expect(interestCards).toBe(4)
  })

  test('empty state validation on name step', async ({ authedPage }) => {
    const onboarding = new OnboardingPage(authedPage)
    await onboarding.goto()

    await expect(onboarding.continueButton).toBeDisabled()
    await expect(onboarding.heading).toContainText("What's your name?")

    await onboarding.nameInput.fill('Test')
    await expect(onboarding.continueButton).toBeEnabled()

    await onboarding.nameInput.clear()
    await expect(onboarding.continueButton).toBeDisabled()
  })
})

test.describe('Onboarding — Auth gating', () => {
  test('unauthenticated users redirected to login', async ({ page }) => {
    await page.goto('/onboarding')
    await page.waitForURL('/auth/login')
    await expect(page).toHaveURL('/auth/login')
  })
})
