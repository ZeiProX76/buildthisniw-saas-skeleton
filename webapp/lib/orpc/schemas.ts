// PROTECTED — READ ONLY. Do not modify existing schemas. Add feature-specific schemas in your procedure file.
import { z } from 'zod'

/**
 * SECURE BASE SCHEMAS
 *
 * All schemas include:
 * - Length limits (prevent buffer attacks)
 * - Trim (prevent whitespace attacks)
 * - Strict mode (prevent mass assignment)
 *
 * USAGE: Extend these for your procedures
 * const MySchema = SecureObject.extend({ ... })
 */

// ============================================
// STRING LENGTH LIMITS (prevent buffer attacks)
// ============================================

/** Short text: names, titles, labels */
export const SecureShortText = z
  .string()
  .trim()
  .max(100, 'Must be 100 characters or less')

/** Medium text: descriptions, summaries */
export const SecureMediumText = z
  .string()
  .trim()
  .max(500, 'Must be 500 characters or less')

/** Long text: bios, content, messages */
export const SecureLongText = z
  .string()
  .trim()
  .max(5000, 'Must be 5000 characters or less')

/** Email: RFC 5321 max length is 254 */
export const SecureEmail = z
  .string()
  .trim()
  .max(254, 'Email too long')
  .email('Invalid email format')
  .toLowerCase()

/** Password: reasonable max to prevent DoS (bcrypt is O(cost * length)) */
export const SecurePassword = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be 128 characters or less')

/** URL: prevent open redirect and SSRF */
export const SecureUrl = z
  .string()
  .trim()
  .max(2048, 'URL too long')
  .url('Invalid URL format')

/** Avatar/Image URL: stricter validation */
export const SecureImageUrl = z
  .string()
  .trim()
  .max(2048, 'URL too long')
  .url('Invalid URL format')
  .refine(
    (url) => {
      // Only allow http/https protocols
      try {
        const parsed = new URL(url)
        return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      } catch {
        return false
      }
    },
    { message: 'Only HTTP/HTTPS URLs allowed' }
  )

/** ID: UUID format */
export const SecureId = z.string().uuid('Invalid ID format')

/** Optional ID */
export const SecureOptionalId = z.string().uuid('Invalid ID format').optional()

// ============================================
// SECURE OBJECT BUILDER (prevents mass assignment)
// ============================================

/**
 * Create a strict object schema
 * IMPORTANT: .strict() drops any unrecognized keys (mass assignment protection)
 *
 * @example
 * const UserSchema = secureObject({
 *   email: SecureEmail,
 *   name: SecureShortText,
 * })
 */
export function secureObject<T extends z.ZodRawShape>(shape: T) {
  return z.object(shape).strict()
}

/**
 * Extend an existing secure object/clear
 * 
 *
 * @example
 * const CreateUserSchema = extendSecureObject(UserSchema, {
 *   password: SecurePassword,
 * })
 */
export function extendSecureObject<
  T extends z.ZodRawShape,
  U extends z.ZodRawShape,
>(base: z.ZodObject<T>, extension: U) {
  return base.extend(extension).strict()
}

// ============================================
// COMMON SECURE SCHEMAS
// ============================================

/** Pagination: safe integer bounds */
export const PaginationSchema = secureObject({
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

/** Search query: trimmed and limited */
export const SearchSchema = secureObject({
  query: z.string().trim().max(200, 'Search query too long'),
})

/** Date range: ISO strings with validation */
export const DateRangeSchema = secureObject({
  startDate: z.string().datetime({ message: 'Invalid start date' }),
  endDate: z.string().datetime({ message: 'Invalid end date' }),
}).refine(
  ({ startDate, endDate }) => new Date(startDate) <= new Date(endDate),
  { message: 'Start date must be before end date' }
)

// ============================================
// SCHEMA UTILITIES
// ============================================

/**
 * Make any schema optional with nullish
 * More explicit than .optional() for API responses
 */
export function optional<T extends z.ZodTypeAny>(schema: T): z.ZodOptional<z.ZodNullable<T>> {
  return schema.nullish()
}

/**
 * Default empty string for optional text fields
 */
export function optionalText(
  schema: typeof SecureShortText | typeof SecureMediumText | typeof SecureLongText,
) {
  return schema.nullish().transform((val) => val ?? '')
}

/**
 * Coerce to boolean (for query params)
 */
export const BooleanParam = z
  .union([z.boolean(), z.string().transform((val) => val === 'true' || val === '1')])
  .default(false)

// ============================================
// EXPORT SECURE BASE FOR PROCEDURES
// ============================================

/**
 * Use these as building blocks for all procedure inputs
 *
 * @example
 * // In your procedure file:
 * import { SecureEmail, SecurePassword, secureObject } from '@/lib/orpc/schemas'
 *
 * const SignInSchema = secureObject({
 *   email: SecureEmail,
 *   password: SecurePassword,
 * })
 *
 * export const signIn = publicProcedure
 *   .input(SignInSchema)
 *   .handler(async ({ input }) => {
 *     // input is validated, trimmed, strict
 *   })
 */
