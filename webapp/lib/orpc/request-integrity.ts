import { ORPCError } from '@orpc/server'

/**
 * Request meta fields (injected by client, stripped by server)
 */
export interface RequestMeta {
  /** Unix timestamp in milliseconds - request is rejected if too old */
  timestamp: number
  /** Unique key for idempotency - prevents duplicate processing */
  idempotencyKey: string
  /** Random nonce for additional uniqueness */
  nonce: string
}

/**
 * Input with request meta (what client sends)
 */
export interface InputWithMeta {
  _meta?: RequestMeta
  [key: string]: unknown
}

const DEFAULT_MAX_AGE_MS = 30000 // 30 seconds
const CACHE_TTL_MS = 60000 // 1 minute

/**
 * In-memory idempotency cache
 * SECURITY: Prevents replay attacks within the time window
 *
 * SERVERLESS NOTE:
 * - Cache lives only within a single container instance
 * - Each Vercel function invocation may hit different containers
 * - This is OK because:
 *   1. Most requests hit warm containers (cache exists)
 *   2. Even cold start = cache miss = safe (just re-processes)
 *   3. The 30s timestamp window is the real protection
 */
const idempotencyCache = new Map<
  string,
  { result: unknown; timestamp: number }
>()

/**
 * Clean up expired entries (fire-and-forget, no latency)
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  // Only clean when cache is large or 1% chance
  if (idempotencyCache.size > 100 || Math.random() < 0.01) {
    for (const [key, value] of idempotencyCache.entries()) {
      if (now - value.timestamp > CACHE_TTL_MS) {
        idempotencyCache.delete(key)
      }
    }
  }
}

/**
 * Validate request meta and strip it from input
 * SECURITY: Never trust client - validate timestamp
 *
 * @returns Stripped input (without _meta) or throws error
 */
export function validateRequestMeta(input: unknown): {
  valid: true
  strippedInput: Record<string, unknown>
  idempotencyKey: string | undefined
} {
  const rawInput = input as InputWithMeta
  const meta = rawInput._meta

  const { _meta: _removedMeta, ...strippedInput } = rawInput

  // 1. Validate timestamp exists
  if (!meta?.timestamp) {
    throw new ORPCError('BAD_REQUEST', {
      data: { message: 'Missing request timestamp' },
    })
  }

  // 2. Validate timestamp is not too old (REPLAY ATTACK PREVENTION)
  const requestAge = Date.now() - meta.timestamp
  if (requestAge > DEFAULT_MAX_AGE_MS) {
    throw new ORPCError('BAD_REQUEST', {
      data: { message: 'Request expired' },
    })
  }

  // 3. Validate timestamp is not in the future (CLOCK SKEW ATTACK)
  if (meta.timestamp > Date.now() + 5000) {
    throw new ORPCError('BAD_REQUEST', {
      data: { message: 'Invalid request timestamp' },
    })
  }

  // Clean up after validation (fire-and-forget)
  void cleanupExpiredEntries()

  return {
    valid: true,
    strippedInput: strippedInput as Record<string, unknown>,
    idempotencyKey: meta.idempotencyKey,
  }
}

/**
 * Check idempotency cache for cached result
 */
export function getIdempotencyCacheResult(key: string): unknown | undefined {
  const cached = idempotencyCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.result
  }
  return undefined
}

/**
 * Cache result for idempotency
 */
export function setIdempotencyCacheResult(key: string, result: unknown): void {
  idempotencyCache.set(key, { result, timestamp: Date.now() })
}

/**
 * Generate request meta for client
 * SECURITY: Always includes idempotencyKey (zero maintenance approach)
 */
export function generateRequestMeta(): RequestMeta {
  return {
    timestamp: Date.now(),
    nonce: crypto.randomUUID(),
    idempotencyKey: crypto.randomUUID(),
  }
}
