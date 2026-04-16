import { QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        onError: (error) => {
          const message = error instanceof Error ? error.message : 'Something went wrong'
          toast.error(message)
        },
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always create a new QueryClient
    return makeQueryClient()
  }
  // Browser: reuse singleton
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}
