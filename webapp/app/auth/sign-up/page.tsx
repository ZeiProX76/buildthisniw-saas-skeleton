import { Suspense } from "react";
import { CachedSignUpUI, DynamicSignUpForm } from "@/features/auth/sign-up/components";
import type { SignUpPageProps } from "@/features/auth/sign-up/types";

/**
 * Sign-up page with PPR (Partial Prerendering)
 * - CachedUI: Static shell, instant from cache
 * - DynamicForm: Streams in with searchParams
 */
export default function SignUpPage({
  searchParams,
}: SignUpPageProps): React.ReactElement {
  return (
    <Suspense fallback={<CachedSignUpUI />}>
      <DynamicSignUpForm searchParams={searchParams} />
    </Suspense>
  );
}
