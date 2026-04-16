"use client";

import React, { useEffect, useState } from "react";
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

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
  redirectTo?: string;
  invitationEmail?: string;
  message?: string;
}

export function LoginForm({
  className,
  redirectTo,
  invitationEmail,
  message,
  ...props
}: LoginFormProps): React.ReactElement {
  const [email, setEmail] = useState(invitationEmail ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  // Store redirect URL for OAuth flows (cookie instead of sessionStorage to avoid XSS exposure)
  useEffect(() => {
    if (redirectTo) {
      document.cookie = `redirectAfterLogin=${encodeURIComponent(redirectTo)}; path=/; max-age=300; SameSite=Lax`;
    }
  }, [redirectTo]);

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await client.auth.signIn({
        email,
        password,
        captchaToken: captchaToken ?? undefined,
      });

      if (result.success) {
        // Explicit redirects (props/sessionStorage) take priority,
        // then use backend's redirectTo (based on onboarding status),
        // fallback to /protected/home
        const cookieMatch = document.cookie.match(/redirectAfterLogin=([^;]+)/);
        const storedRedirect = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
        const destination =
          redirectTo ?? storedRedirect ?? result.redirectTo ?? "/protected/home";

        // Clear stored redirect cookie
        document.cookie = "redirectAfterLogin=; path=/; max-age=0";

        router.push(destination);
        router.refresh();
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
              Welcome back
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5 mb-4 sm:mb-5">
          <GoogleOAuthButton mode="login" />
          <AuthDivider />
        </div>

        <form onSubmit={handleLogin}>
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
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="ml-auto inline-block text-xs sm:text-sm underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                className="h-10 sm:h-11"
                value={password}
                onChange={(e): void => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && (
              <p className="text-sm text-success">{message}</p>
            )}
            <Turnstile
              onVerify={setCaptchaToken}
              onExpire={() => setCaptchaToken(null)}
              onError={() => setError("Captcha verification failed")}
              className="w-full"
            />
            <Button type="submit" className="w-full h-10 sm:h-11" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
