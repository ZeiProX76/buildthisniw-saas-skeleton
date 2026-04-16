"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { client } from "@/lib/orpc/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STORAGE_KEY = "signup_email";
const RESEND_COOLDOWN_SECONDS = 60;

interface SignUpSuccessContentProps {
  emailFromParams?: string;
}

/**
 * Client component for OTP verification
 * Receives email from server component, not useSearchParams()
 */
export function SignUpSuccessContent({
  emailFromParams,
}: SignUpSuccessContentProps): React.ReactElement {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  const isVerifyingRef = useRef(false);

  // Initialize email from props or localStorage
  useEffect(() => {
    if (emailFromParams) {
      localStorage.setItem(STORAGE_KEY, emailFromParams);
      setEmail(emailFromParams);
    } else {
      const storedEmail = localStorage.getItem(STORAGE_KEY);
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [emailFromParams]);

  // Resend cooldown timer
  useEffect((): (() => void) => {
    if (resendCooldown <= 0) return (): void => undefined;

    const timer = setInterval((): void => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return (): void => clearInterval(timer);
  }, [resendCooldown]);

  // Handle OTP verification
  const handleVerifyOtp = useCallback(
    async (token: string, userEmail: string): Promise<void> => {
      if (isVerifyingRef.current) return;
      isVerifyingRef.current = true;

      setIsLoading(true);
      setError(null);

      try {
        const result = await client.auth.verifyOtp({
          email: userEmail,
          token,
          type: "signup",
        });

        if (result.success) {
          localStorage.removeItem(STORAGE_KEY);
          await new Promise((resolve) => {
            setTimeout(resolve, 500);
          });
          router.push("/onboarding");
          router.refresh();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed");
        setOtp("");
        isVerifyingRef.current = false;
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  // Auto-submit when OTP is complete
  useEffect((): void => {
    if (otp.length === 8 && email && !isLoading && !isVerifyingRef.current) {
      void handleVerifyOtp(otp, email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, email]);

  const handleResend = async (): Promise<void> => {
    if (!email || resendCooldown > 0) return;

    setResendSuccess(false);
    setError(null);

    try {
      const result = await client.auth.resendVerification({
        email,
        type: "signup",
      });

      if (result.success) {
        setResendSuccess(true);
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend email");
    }
  };

  // No email state
  if (!email) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Session Expired</CardTitle>
              <CardDescription>
                We couldn&apos;t find your email. Please sign up again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/auth/sign-up">Go to Sign Up</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Verify Your Email</CardTitle>
              <CardDescription>
                We sent an 8-digit code to{" "}
                <strong className="text-foreground">{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-4">
                  <InputOTP
                    maxLength={8}
                    value={otp}
                    onChange={setOtp}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                      <InputOTPSlot index={6} />
                      <InputOTPSlot index={7} />
                    </InputOTPGroup>
                  </InputOTP>

                  <p className="text-sm text-muted-foreground">
                    {isLoading ? "Verifying..." : "Enter your verification code"}
                  </p>
                </div>

                {error && (
                  <p className="text-center text-sm text-destructive">{error}</p>
                )}

                {resendSuccess && (
                  <p className="text-center text-sm text-success">
                    A new code has been sent to your email.
                  </p>
                )}

                <div className="text-center">
                  <Button
                    variant="link"
                    className="text-sm"
                    onClick={() => void handleResend()}
                    disabled={resendCooldown > 0 || isLoading}
                  >
                    {resendCooldown > 0
                      ? `Resend code in ${resendCooldown}s`
                      : "Resend code"}
                  </Button>
                </div>

                <div className="text-center text-sm">
                  Wrong email?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="underline underline-offset-4"
                  >
                    Sign up again
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
