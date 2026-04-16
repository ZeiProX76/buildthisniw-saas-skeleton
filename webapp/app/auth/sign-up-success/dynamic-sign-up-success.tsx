import { SignUpSuccessContent } from "./sign-up-success-content";

interface DynamicSignUpSuccessProps {
  searchParams: Promise<{
    email?: string;
  }>;
}

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
