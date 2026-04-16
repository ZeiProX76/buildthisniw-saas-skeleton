import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <p className="text-8xl font-bold tracking-tighter text-primary">404</p>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">
          Page not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
