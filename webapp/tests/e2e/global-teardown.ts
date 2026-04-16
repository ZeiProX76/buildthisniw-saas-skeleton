export default async function globalTeardown() {
  const pid = process.env.__INNGEST_PID
  if (pid) {
    try {
      process.kill(Number(pid), 'SIGTERM')
      console.log(`[inngest] Stopped dev server (pid ${pid})`)
    } catch {
      // Already exited
    }
  }
}
