"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";

export default function ProtectedError({
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
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-md text-center">
        <p className="text-7xl font-bold tracking-tighter text-destructive">Error</p>
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. Our team has been notified.
        </p>
        {error.digest && (
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            ID: {error.digest}
          </p>
        )}
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/protected/home")}
          >
            Back to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
