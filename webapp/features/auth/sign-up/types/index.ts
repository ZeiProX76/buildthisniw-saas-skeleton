/**
 * Types for sign-up feature
 * @module features/auth/sign-up/types
 */

import type { AuthPageProps, SignUpSearchParams } from "@/features/_shared/types";

/**
 * Sign-up page props with typed searchParams
 */
export type SignUpPageProps = AuthPageProps<SignUpSearchParams>;

/**
 * Dynamic sign-up form props
 */
export interface DynamicSignUpFormProps {
  searchParams: Promise<SignUpSearchParams>;
}
