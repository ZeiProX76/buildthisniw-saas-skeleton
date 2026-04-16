import { defineConfig, devices } from '@playwright/test'
import { execFileSync } from 'child_process'
import { basename, resolve } from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

/**
 * Auto-detect a running portless app.
 * If found, reuse it (no server spawn). Otherwise, find a free port and start one.
 */
function detectPortlessUrl(): string | null {
  try {
    // Infer the app name the same way portless does: git root basename
    let name: string
    try {
      name = basename(
        execFileSync('git', ['rev-parse', '--show-toplevel'], { timeout: 3000 })
          .toString()
          .trim(),
      ).replace(/_/g, '-')
    } catch {
      name = basename(resolve('..')).replace(/_/g, '-')
    }
    const url = execFileSync('npx', ['portless', 'get', name], {
      timeout: 5000,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim()
    if (url.startsWith('http')) return url
  } catch { /* portless not running or app not registered */ }
  return null
}

const portlessUrl = process.env.PORTLESS_URL || detectPortlessUrl()

let testBaseURL: string
let webServer: any

if (portlessUrl) {
  // Reuse the running portless app — no server spawn needed
  testBaseURL = portlessUrl
  webServer = undefined
} else {
  // Find a free port in 4000–4999 so tests never collide with dev servers
  const findPortScript = `
const net = require('net');
(async () => {
  for (let p = 4000; p <= 4999; p++) {
    const free = await new Promise(r => {
      const s = net.createServer();
      s.once('error', () => r(false));
      s.once('listening', () => { s.close(() => r(true)); });
      s.listen(p, '127.0.0.1');
    });
    if (free) { console.log(p); return; }
  }
  console.error('No free port in 4000-4999');
  process.exit(1);
})();
`
  const testPort = Number(
    execFileSync('node', ['-e', findPortScript], { timeout: 5000 })
      .toString()
      .trim(),
  )
  testBaseURL = `http://localhost:${testPort}`
  webServer = {
    command: `npx next dev -p ${testPort}`,
    port: testPort,
    reuseExistingServer: false,
  }
}

// Inject so Next.js and test fixtures pick up the correct URL
process.env.NEXT_PUBLIC_SITE_URL = testBaseURL

export default defineConfig({
  globalSetup: './tests/e2e/global-setup.ts',
  globalTeardown: './tests/e2e/global-teardown.ts',
  testDir: './tests/e2e',
  outputDir: '../test-results',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    baseURL: testBaseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // ─── Auth Setup ────────────────────────────────────────────
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },

    // ─── Authenticated Tests ───────────────────────────────────
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testIgnore: /marketing-pages|auth-pages|auth-oauth|auth-confirm|public-api/,
    },

    // ─── Public Tests (no auth) ────────────────────────────────
    {
      name: 'public',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /auth-(oauth|confirm).*\.spec\.ts|marketing-pages\.e2e\.spec\.ts|auth-pages\.e2e\.spec\.ts|public-api\.spec\.ts/,
    },
  ],
  ...(webServer ? { webServer } : {}),
})
