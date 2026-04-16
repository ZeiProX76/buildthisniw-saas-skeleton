import { Suspense } from "react";
import { CachedLoginUI, DynamicLoginForm } from "@/features/auth/login/components";
import type { LoginPageProps } from "@/features/auth/login/types";

/**
 * Login page with PPR (Partial Prerendering)
 * - CachedUI: Static shell, instant from cache
 * - DynamicForm: Streams in with searchParams
 */
export default function LoginPage({
  searchParams,
}: LoginPageProps): React.ReactElement {
  return (
    <Suspense fallback={<CachedLoginUI />}>
      <DynamicLoginForm searchParams={searchParams} />
    </Suspense>
  );
}
