"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            ID: {error.digest}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
