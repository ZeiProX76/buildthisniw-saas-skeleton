import { SignUpSuccessContent } from "./sign-up-success-content";
import type { DynamicSignUpSuccessProps } from "@/features/auth/sign-up-success/types";

/**
 * Dynamic sign-up success server component
 * Awaits searchParams and passes resolved email to client component
 */
export async function DynamicSignUpSuccess({
  searchParams,
}: DynamicSignUpSuccessProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const emailFromParams = params.email;

  return <SignUpSuccessContent emailFromParams={emailFromParams} />;
}
