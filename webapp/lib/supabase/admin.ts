import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client using the service role key.
 * Bypasses RLS — use ONLY in trusted server-side contexts:
 * - Inngest functions, migrations, storage signed URL generation.
 * NEVER import this from client components.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
