/**
 * Types for login feature
 * @module features/auth/login/types
 */

import type { AuthPageProps, LoginSearchParams } from "@/features/_shared/types";

/**
 * Login page props with typed searchParams
 */
export type LoginPageProps = AuthPageProps<LoginSearchParams>;

/**
 * Dynamic login form props
 */
export interface DynamicLoginFormProps {
  searchParams: Promise<LoginSearchParams>;
}
