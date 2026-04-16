import { cacheLife } from "next/cache";
import { SignUpForm } from "@/features/auth/sign-up/components/sign-up-form";

/**
 * Cached static shell for sign-up page
 * Pre-rendered at build time and cached at the edge
 * Serves as instant fallback while dynamic content streams in
 */
export async function CachedSignUpUI(): Promise<React.ReactElement> {
  "use cache";
  cacheLife("weeks");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-0 sm:p-6">
      <div className="w-full sm:max-w-md">
        {/* No props - serves as visual shell during loading */}
        <SignUpForm />
      </div>
    </div>
  );
}
