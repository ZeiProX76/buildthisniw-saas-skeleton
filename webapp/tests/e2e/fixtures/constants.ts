import * as path from 'path'

if (!process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD) {
  throw new Error(
    'Missing TEST_USER_EMAIL or TEST_USER_PASSWORD env vars. Run /setup to create a test user, or set them in webapp/.env'
  )
}

export const TEST_EMAIL = process.env.TEST_USER_EMAIL
export const TEST_PASSWORD = process.env.TEST_USER_PASSWORD
export const AUTH_STATE_PATH = path.join(__dirname, '../../.auth/state.json')
export const BASE_URL = process.env.PORTLESS_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
