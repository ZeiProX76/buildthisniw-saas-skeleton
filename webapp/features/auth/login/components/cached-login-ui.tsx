import { cacheLife } from "next/cache";
import { LoginForm } from "@/features/auth/login/components/login-form";

/**
 * Cached static shell for login page
 * Pre-rendered at build time and cached at the edge
 * Serves as instant fallback while dynamic content streams in
 */
export async function CachedLoginUI(): Promise<React.ReactElement> {
  "use cache";
  cacheLife("weeks");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-0 sm:p-6">
      <div className="w-full sm:max-w-md">
        {/* No props - serves as visual shell during loading */}
        <LoginForm />
      </div>
    </div>
  );
}
