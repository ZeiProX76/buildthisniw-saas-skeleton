import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProtectedNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24">
      <div className="mx-auto max-w-md text-center">
        <p className="text-7xl font-bold tracking-tighter text-primary">404</p>
        <h1 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This page doesn't exist or you don't have access to it.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/protected/home">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
