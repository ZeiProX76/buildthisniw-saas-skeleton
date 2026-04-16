import { cacheLife } from "next/cache";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Cached static shell for sign-up-success page
 * Pre-rendered at build time and cached at the edge
 * Serves as instant fallback while dynamic content streams in
 */
export async function CachedSignUpSuccessUI(): Promise<React.ReactElement> {
  "use cache";
  cacheLife("weeks");

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
