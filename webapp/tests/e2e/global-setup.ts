import { execSync, spawn, type ChildProcess } from 'child_process'

const INNGEST_PORT = 8288
const INNGEST_HEALTH = `http://localhost:${INNGEST_PORT}/v1/health`
const MAX_WAIT_MS = 30_000

let inngestProcess: ChildProcess | null = null

function isInngestRunning(): boolean {
  try {
    // Try the health endpoint first, fall back to root path (newer CLI versions removed /v1/health)
    try {
      execSync(`curl -sf ${INNGEST_HEALTH}`, { timeout: 3000, stdio: 'ignore' })
      return true
    } catch {
      // Fall back: check if the dev server root responds (serves the UI)
      execSync(`curl -sf http://localhost:${INNGEST_PORT}/`, { timeout: 3000, stdio: 'ignore' })
      return true
    }
  } catch {
    return false
  }
}

function waitForHealth(timeoutMs: number): Promise<void> {
  const start = Date.now()
  return new Promise((resolve, reject) => {
    const check = () => {
      if (isInngestRunning()) return resolve()
      if (Date.now() - start > timeoutMs) return reject(new Error(`Inngest dev server did not start within ${timeoutMs}ms`))
      setTimeout(check, 500)
    }
    check()
  })
}

export default async function globalSetup() {
  // The app URL is set by playwright.config.ts before globalSetup runs
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!appUrl) {
    throw new Error('NEXT_PUBLIC_SITE_URL not set — cannot start Inngest dev server without app URL')
  }

  const sdkUrl = `${appUrl}/api/inngest`

  if (isInngestRunning()) {
    console.log(`[inngest] Dev server already running at localhost:${INNGEST_PORT}`)
    return
  }

  console.log(`[inngest] Starting dev server → sdk-url: ${sdkUrl}`)
  inngestProcess = spawn('npx', ['inngest-cli@latest', 'dev', '-u', sdkUrl], {
    stdio: 'ignore',
    detached: true,
    cwd: process.cwd(),
  })

  // Store PID so globalTeardown can kill it
  process.env.__INNGEST_PID = String(inngestProcess.pid)

  inngestProcess.unref()

  try {
    await waitForHealth(MAX_WAIT_MS)
    console.log(`[inngest] Dev server ready`)
  } catch (err) {
    inngestProcess.kill()
    throw new Error(`[inngest] Failed to start dev server: ${err}`)
  }
}
