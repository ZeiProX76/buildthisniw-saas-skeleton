// PROTECTED — APPEND ONLY. Add new router namespaces; do not modify existing entries.
import { health, echo } from './procedures/public'
import { protectedRouter } from './procedures/protected'
import { authRouter } from './procedures/auth'

/**
 * Main application router
 * Implements the contract defined in contracts/index.ts
 */
export const appRouter = {
  public: {
    health,
    echo,
  },
  auth: authRouter,
  protected: protectedRouter,
}

/**
 * Export router type for client
 */
export type AppRouter = typeof appRouter
