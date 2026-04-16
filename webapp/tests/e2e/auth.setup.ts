import { test as setup } from '@playwright/test'
import { TEST_EMAIL, TEST_PASSWORD, AUTH_STATE_PATH, BASE_URL } from './fixtures/constants'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Auth setup: creates a Playwright storage state (cookies) by signing in
 * directly via the Supabase Auth API, bypassing the browser login form
 * (which requires Cloudflare Turnstile CAPTCHA and a working UI).
 *
 * The storage state contains the Supabase auth cookie that the Next.js
 * SSR client reads to authenticate API requests.
 */
setup('authenticate', async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL not set')

  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!supabaseKey) throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY not set')

  // Sign in via Supabase Auth REST API (no CAPTCHA required)
  const res = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Supabase sign-in failed: ${res.status} ${err}`)
  }

  const data = await res.json() as {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number
    expires_at: number
    user: { id: string; email: string }
  }

  if (!data.access_token) {
    throw new Error(`No access_token in response: ${JSON.stringify(data)}`)
  }

  // Determine domain and port from BASE_URL for cookies
  const baseUrlObj = new URL(BASE_URL)
  const domain = baseUrlObj.hostname // e.g. "build-kit-template.localhost"
  const projectRef = new URL(supabaseUrl).hostname.split('.')[0] // e.g. "xzyegbgzcvgvkbamwdpr"

  // Build Playwright storage state.
  // Next.js Supabase SSR reads the auth cookie named sb-{projectRef}-auth-token.
  // The cookie value must be a JSON-stringified token object (Supabase SSR format).
  const tokenValue = JSON.stringify({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    token_type: data.token_type,
    expires_in: data.expires_in,
    expires_at: data.expires_at,
  })

  const state = {
    cookies: [
      {
        name: `sb-${projectRef}-auth-token`,
        value: tokenValue,
        domain,
        path: '/',
        expires: data.expires_at,
        httpOnly: false,
        secure: false,
        sameSite: 'Lax' as const,
      },
    ],
    origins: [] as Array<{ origin: string; localStorage: Array<{ name: string; value: string }> }>,
  }

  // Write auth state
  const dir = path.dirname(AUTH_STATE_PATH)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(AUTH_STATE_PATH, JSON.stringify(state, null, 2))

  console.log(`Auth state written for user: ${data.user.email} (${data.user.id})`)
})
