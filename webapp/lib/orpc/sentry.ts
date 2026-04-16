import { AsyncLocalStorage } from 'node:async_hooks'
import * as Sentry from '@sentry/nextjs'
import type { ORPCContext } from './context'

/**
 * Per-request Sentry context stored in AsyncLocalStorage.
 * Replaces module-level variables that were shared across concurrent requests,
 * causing wrong error attribution.
 */
interface SentryStore {
  context: Partial<ORPCContext>
  path: string
}

const sentryStorage = new AsyncLocalStorage<SentryStore>()

/**
 * Run a function with an isolated Sentry context store.
 * Call this at the top of each request handler (route.ts).
 */
export function runWithSentryContext<T>(fn: () => T): T {
  return sentryStorage.run({ context: {}, path: '' }, fn)
}

/**
 * Set the current request context for Sentry (within the current ALS store).
 */
export function setSentryRequestContext(context: Partial<ORPCContext>, path: readonly string[]): void {
  const store = sentryStorage.getStore()
  if (store) {
    store.context = context
    store.path = path.join('.')
  }
}

/**
 * Sentry error handler type
 */
type SentryErrorHandler = (error: unknown) => void

/**
 * Sentry middleware factory for error tracking and distributed tracing
 * Uses oRPC's onError hook
 */
export function createSentryMiddleware(): SentryErrorHandler {
  return (error: unknown): void => {
    const store = sentryStorage.getStore()
    const ctx = store?.context ?? {}
    const path = store?.path ?? ''

    // Set user if authenticated
    if (ctx.user) {
      Sentry.setUser({
        id: ctx.user.id,
        email: ctx.user.email,
      })
    } else {
      Sentry.setUser(null)
    }

    // Capture with proper tagging
    Sentry.captureException(error, {
      tags: {
        orpc_path: path,
        orpc_request_id: ctx.requestId,
        orpc_status: 'error',
      },
    })
  }
}

/**
 * Set Sentry context for the current request
 * Call this from a middleware to enable tracing
 */
export function setSentryContext(context: ORPCContext, path: readonly string[]): void {
  setSentryRequestContext(context, path)

  Sentry.setContext('orpc', {
    requestId: context.requestId,
    path: path.join('.'),
    duration: Date.now() - context.startTime,
  })

  if (context.user) {
    Sentry.setUser({
      id: context.user.id,
      email: context.user.email,
    })
  }
}
