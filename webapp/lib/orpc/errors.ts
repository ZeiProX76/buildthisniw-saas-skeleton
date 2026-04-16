import { ORPCError } from '@orpc/server'

/**
 * Error codes used throughout the application
 */
export type AppErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'INTERNAL_SERVER_ERROR'
  | 'RATE_LIMITED'
  | 'VALIDATION_ERROR'

/**
 * Error data types
 */
export interface AppErrorData {
  retryAfter?: number
  field?: string
  details?: Record<string, unknown>
}

/**
 * Custom application error with typed codes
 */
export class AppError extends ORPCError<AppErrorCode, AppErrorData | undefined> {
  constructor(code: AppErrorCode, message?: string, data?: AppErrorData) {
    super(code, { message, data })
  }
}

/**
 * Helper to create typed errors
 */
export const Errors = {
  unauthorized: (message = 'Unauthorized'): AppError => new AppError('UNAUTHORIZED', message),
  forbidden: (message = 'Forbidden'): AppError => new AppError('FORBIDDEN', message),
  notFound: (message = 'Resource not found'): AppError => new AppError('NOT_FOUND', message),
  badRequest: (message = 'Bad request', data?: AppErrorData): AppError =>
    new AppError('BAD_REQUEST', message, data),
  internal: (message = 'Internal server error'): AppError => new AppError('INTERNAL_SERVER_ERROR', message),
  rateLimited: (retryAfter: number): AppError =>
    new AppError('RATE_LIMITED', 'Too many requests', { retryAfter }),
  validation: (message: string, data?: AppErrorData): AppError =>
    new AppError('VALIDATION_ERROR', message, data),
}
