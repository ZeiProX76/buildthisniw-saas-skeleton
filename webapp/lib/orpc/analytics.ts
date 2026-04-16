import type { ORPCContext } from './context'

/**
 * Analytics event payload
 */
export interface AnalyticsEvent {
  event: 'orpc_call'
  path: string
  userId?: string
  durationMs: number
  success: boolean
  requestId: string
}

/**
 * Analytics transport function - implement based on your analytics provider
 * (PostHog, Mixpanel, Amplitude, etc.)
 */
type AnalyticsTransport = (event: AnalyticsEvent) => Promise<void>

// Default no-op transport - override this in your app
let analyticsTransport: AnalyticsTransport = async (): Promise<void> => {}

/**
 * Set the analytics transport function
 */
export function setAnalyticsTransport(transport: AnalyticsTransport): void {
  analyticsTransport = transport
}

/**
 * Analytics handler type
 */
type AnalyticsHandler = (isSuccess: boolean, context: ORPCContext, path: string[]) => void

/**
 * Create analytics handler using onFinish pattern
 * IMPORTANT: Analytics should never block or break the app
 */
export function createAnalyticsHandler(): AnalyticsHandler {
  return (isSuccess: boolean, context: ORPCContext, path: string[]): void => {
    // Fire-and-forget: don't await, silently fail
    void analyticsTransport({
      event: 'orpc_call',
      path: path.join('.'),
      userId: context.user?.id,
      durationMs: Date.now() - context.startTime,
      success: isSuccess,
      requestId: context.requestId,
    }).catch(() => {
      // Silently fail - analytics should never break the app
    })
  }
}

/**
 * Track custom analytics event
 */
export function trackAnalytics(event: Omit<AnalyticsEvent, 'event'>): void {
  void analyticsTransport({
    event: 'orpc_call',
    ...event,
  }).catch(() => {})
}
