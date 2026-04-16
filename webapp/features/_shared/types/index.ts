/**
 * Shared types for features
 * @module features/_shared/types
 */

export type { PaginatedResponse, FilterConfig } from './pagination'

/**
 * Base interface for auth pages with searchParams
 */
export interface AuthPageProps<
  T = Record<string, string | undefined>,
> {
  searchParams: Promise<T>;
}

/**
 * Login page URL search parameters
 */
export interface LoginSearchParams {
  redirect?: string;
  email?: string;
  message?: string;
}

/**
 * Sign-up page URL search parameters
 */
export interface SignUpSearchParams {
  redirect?: string;
  email?: string;
  invitationToken?: string;
}

/**
 * Sign-up success page URL search parameters
 */
export interface SignUpSuccessSearchParams {
  email?: string;
}

/**
 * Error page URL search parameters
 */
export interface ErrorSearchParams {
  error?: string;
}
