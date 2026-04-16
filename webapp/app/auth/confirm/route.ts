import { createClient } from "@/lib/supabase/server";
import { validateRedirect } from "@/features/_shared/utils";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

async function getRedirectForUser(
  supabase: Awaited<ReturnType<typeof createClient>>,
  fallback: string,
): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return fallback;

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  return profile?.onboarding_completed ? "/protected/home" : "/onboarding";
}

export async function GET(request: NextRequest): Promise<void> {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = validateRedirect(searchParams.get("next") ?? undefined) ?? "/onboarding";

  const supabase = await createClient();

  // Handle OAuth callback (code exchange)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const destination = await getRedirectForUser(supabase, next);
      redirect(destination);
    }
    redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
  }

  // Handle email verification via token_hash
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      redirect(next);
    }

    redirect(`/auth/error?error=${encodeURIComponent(error.message)}`);
  }

  // No valid verification method provided
  redirect("/auth/error?error=Invalid verification link");
}
