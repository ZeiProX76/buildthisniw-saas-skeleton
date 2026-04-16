import { oc } from '@orpc/contract'
import { z } from 'zod'
import { SecureMediumText } from '../schemas'

const pub = oc.route({ tags: ['public'] })

const health = pub
  .route({ method: 'GET', path: '/public/health' })
  .output(z.object({
    status: z.string(),
    timestamp: z.string(),
  }))

const echo = pub
  .route({ method: 'POST', path: '/public/echo' })
  .input(z.object({
    message: SecureMediumText,
  }).strict())
  .output(z.object({
    message: z.string(),
    timestamp: z.string(),
  }))

export default { health, echo }
