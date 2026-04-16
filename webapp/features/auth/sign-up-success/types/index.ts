/**
 * Types for sign-up-success feature
 * @module features/auth/sign-up-success/types
 */

import type { AuthPageProps, SignUpSuccessSearchParams } from "@/features/_shared/types";

/**
 * Sign-up success page props with typed searchParams
 */
export type SignUpSuccessPageProps = AuthPageProps<SignUpSuccessSearchParams>;

/**
 * Dynamic sign-up success props
 */
export interface DynamicSignUpSuccessProps {
  searchParams: Promise<SignUpSuccessSearchParams>;
}

/**
 * Sign-up success content props
 */
export interface SignUpSuccessContentProps {
  emailFromParams?: string;
}
