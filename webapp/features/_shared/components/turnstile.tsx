"use client";

import React from "react";
import { Turnstile as TurnstileWidget } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  className?: string;
}

export function Turnstile({
  onVerify,
  onError,
  onExpire,
  className,
}: TurnstileProps): React.ReactElement | null {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const { resolvedTheme } = useTheme();

  if (!siteKey) {
    console.warn("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set");
    return null;
  }

  const theme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <TurnstileWidget
      siteKey={siteKey}
      onSuccess={onVerify}
      onError={onError}
      onExpire={onExpire}
      options={{ theme, size: "flexible" }}
      className={className}
    />
  );
}
