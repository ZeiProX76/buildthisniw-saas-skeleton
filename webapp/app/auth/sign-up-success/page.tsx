import { Suspense } from "react";
import { CachedSignUpSuccessUI, DynamicSignUpSuccess } from "@/features/auth/sign-up-success/components";
import type { SignUpSuccessPageProps } from "@/features/auth/sign-up-success/types";

/**
 * Sign-up success page with PPR (Partial Prerendering)
 * - CachedUI: Static shell, instant from cache
 * - DynamicForm: Streams in with searchParams
 */
export default function SignUpSuccessPage({
  searchParams,
}: SignUpSuccessPageProps): React.ReactElement {
  return (
    <Suspense fallback={<CachedSignUpSuccessUI />}>
      <DynamicSignUpSuccess searchParams={searchParams} />
    </Suspense>
  );
}
