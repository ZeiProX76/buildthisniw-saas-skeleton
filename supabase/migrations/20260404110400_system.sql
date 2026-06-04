-- Migration Group 5: System tables
-- Operational tables for monitoring, error tracking, and system health.

-- 5a: Email error tracking
-- Edge functions write here when email delivery fails.
-- UI reads to show actionable errors instead of generic "unexpected_failure".
CREATE TABLE public.system_email_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  email text NOT NULL,
  action text NOT NULL,           -- 'signup', 'recovery', 'magiclink', etc.
  error_code text,                -- 'validation_error', 'rate_limit', etc.
  error_message text NOT NULL,
  context jsonb DEFAULT '{}'::jsonb  -- extra details (status code, provider, etc.)
);

ALTER TABLE public.system_email_errors ENABLE ROW LEVEL SECURITY;

-- Anon can read recent errors (needed for pre-auth signup flow)
CREATE POLICY "anon_read_recent_email_errors"
  ON public.system_email_errors FOR SELECT
  TO anon
  USING (created_at > now() - interval '5 minutes');

-- Authenticated can also read recent errors (for password reset flow etc.)
CREATE POLICY "authenticated_read_recent_email_errors"
  ON public.system_email_errors FOR SELECT
  TO authenticated
  USING (created_at > now() - interval '5 minutes');

-- No INSERT/UPDATE/DELETE policies — only service_role can write (edge functions).

-- Auto-cleanup: purge errors older than 1 hour
-- This runs every 10 minutes via pg_cron (if available)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'cleanup_email_errors',
      '*/10 * * * *',
      $$DELETE FROM public.system_email_errors WHERE created_at < now() - interval '1 hour'$$
    );
  END IF;
END
$$;
