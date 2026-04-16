import { oc } from '@orpc/contract'
import { z } from 'zod'

const credits = oc
  .route({ tags: ['credits'] })
  .errors({ UNAUTHORIZED: {} })

const getBalance = credits
  .route({ method: 'GET', path: '/protected/credits/balance' })
  .output(z.array(z.object({
    creditType: z.string(),
    balance: z.number(),
    allocation: z.number(),
    period: z.string(),
    periodStart: z.string().nullable(),
  })))

export default { getBalance }
