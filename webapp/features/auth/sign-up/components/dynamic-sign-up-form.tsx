import { SignUpForm } from "@/features/auth/sign-up/components/sign-up-form";
import type { DynamicSignUpFormProps } from "@/features/auth/sign-up/types";

/**
 * Dynamic sign-up form that reads searchParams
 * Forces dynamic rendering, streams in after cached shell
 */
export async function DynamicSignUpForm({
  searchParams,
}: DynamicSignUpFormProps): Promise<React.ReactElement> {
  const params = await searchParams;

  const invitationEmail = params.email;
  const invitationToken = params.invitationToken;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-0 sm:p-6">
      <div className="w-full sm:max-w-md">
        {/* Full props - the actual working form */}
        <SignUpForm
          invitationEmail={invitationEmail}
          invitationToken={invitationToken}
        />
      </div>
    </div>
  );
}
