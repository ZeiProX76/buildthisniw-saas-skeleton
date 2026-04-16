"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { client } from "@/lib/orpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Turnstile } from "@/features/_shared/components/turnstile";
import { GoogleOAuthButton } from "@/features/auth/_shared/components/google-oauth-button";
import { AuthDivider } from "@/features/auth/_shared/components/auth-divider";

interface SignUpFormProps extends React.ComponentPropsWithoutRef<"div"> {
  invitationEmail?: string;
  invitationToken?: string;
}

export function SignUpForm({
  className,
  invitationEmail,
  invitationToken: _invitationToken,
  ...props
}: SignUpFormProps): React.ReactElement {
  const [email, setEmail] = useState(invitationEmail ?? "");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await client.auth.signUp({
        email,
        password,
        captchaToken: captchaToken ?? undefined,
      });

      if (result.success) {
        // Pass email as URL param for OTP verification page
        const encodedEmail = encodeURIComponent(email);
        router.push(`/auth/sign-up-success?email=${encodedEmail}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="w-full sm:rounded-3xl sm:shadow-xl sm:border sm:border-border sm:bg-card px-5 py-6 sm:px-8 sm:py-10">
        {/* Logo + heading */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <span className="text-lg sm:text-xl font-bold tracking-tight text-primary">Your Logo</span>
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Create your account
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5 mb-4 sm:mb-5">
          <GoogleOAuthButton mode="signup" />
          <AuthDivider />
        </div>

        <form onSubmit={handleSignUp}>
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="h-10 sm:h-11"
                value={email}
                onChange={(e): void => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="h-10 sm:h-11"
                value={password}
                onChange={(e): void => setPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="repeat-password">Confirm password</Label>
              <Input
                id="repeat-password"
                type="password"
                required
                className="h-10 sm:h-11"
                value={repeatPassword}
                onChange={(e): void => setRepeatPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Turnstile
              onVerify={setCaptchaToken}
              onExpire={() => setCaptchaToken(null)}
              onError={() => setError("Captcha verification failed")}
              className="w-full"
            />
            <Button type="submit" className="w-full h-10 sm:h-11" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </div>
          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
