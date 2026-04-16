import { createORPCClient } from '@orpc/client'
import { RetryAfterPlugin } from '@orpc/client/plugins'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import type { RouterClient } from '@orpc/server'
import type { AppRouter } from './router'
import { contract } from './contracts'

/**
 * Get base URL for API calls
 * Works in both browser and server contexts
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:${process.env.PORT ?? '3001'}`
}

/**
 * oRPC OpenAPI link — sends REST-style requests matching contract routes.
 * Works with the OpenAPIHandler on the server.
 */
const link = new OpenAPILink(contract, {
  url: `${getBaseUrl()}/api/rpc`,
  headers: async (): Promise<Record<string, string>> => {
    return {}
  },
  plugins: [
    new RetryAfterPlugin({
      maxAttempts: 3,
      timeout: 30000,
    }),
  ],
})

/**
 * Fully typed oRPC client for direct procedure calls
 *
 * Usage: await client.protected.stripe.getSubscription()
 */
export const client: RouterClient<AppRouter> = createORPCClient(link) as RouterClient<AppRouter>

/**
 * TanStack Query utilities for oRPC procedures
 *
 * Usage:
 *   useQuery(orpc.protected.stripe.getSubscription.queryOptions())
 *   useMutation(orpc.protected.stripe.createSubscriptionCheckout.mutationOptions())
 *   queryClient.invalidateQueries({ queryKey: orpc.protected.stripe.key() })
 */
export const orpc = createTanstackQueryUtils(client)

/**
 * Export router type for type inference
 */
export type { AppRouter } from './router'
