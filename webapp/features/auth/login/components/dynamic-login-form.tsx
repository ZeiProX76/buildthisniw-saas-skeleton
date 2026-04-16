import { LoginForm } from "@/features/auth/login/components/login-form";
import type { DynamicLoginFormProps } from "@/features/auth/login/types";
import { validateRedirect } from "@/features/_shared/utils";

/**
 * Dynamic login form that reads searchParams
 * Forces dynamic rendering, streams in after cached shell
 */
export async function DynamicLoginForm({
  searchParams,
}: DynamicLoginFormProps): Promise<React.ReactElement> {
  const params = await searchParams;

  const redirectTo = validateRedirect(params.redirect);
  const invitationEmail = params.email;
  const message = params.message;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-0 sm:p-6">
      <div className="w-full sm:max-w-md">
        {/* Full props - the actual working form */}
        <LoginForm
          redirectTo={redirectTo}
          invitationEmail={invitationEmail}
          message={message}
        />
      </div>
    </div>
  );
}
