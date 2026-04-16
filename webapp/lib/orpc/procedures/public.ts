import { publicProcedure } from '../base'
import { SecureMediumText, secureObject } from '../schemas'

/**
 * Health check - returns server status
 */
export const health = publicProcedure
  .route({ method: 'GET', path: '/public/health' })
  .handler(async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  }
})

/**
 * Echo - returns the input (useful for testing)
 */
export const echo = publicProcedure
  .route({ method: 'POST', path: '/public/echo' })
  .input(
    secureObject({
      message: SecureMediumText,
    }),
  )
  .handler(async ({ input }) => {
    return {
      message: input.message,
      timestamp: new Date().toISOString(),
    }
  })

/**
 * Public router
 */
export const publicRouter = {
  health,
  echo,
}
