-- Migration: Drop all stress-test feature tables and objects
-- These were created during agent stress-testing and are not production features.
-- Core tables (profiles, admins, credit_*, system_email_errors) are preserved.

-- ─────────────────────────────────────────────────────────────
-- 1. Drop functions first (they reference tables)
-- ─────────────────────────────────────────────────────────────

DROP FUNCTION IF EXISTS public.move_cards_to_column(uuid, uuid, uuid);
DROP FUNCTION IF EXISTS public.rebalance_column_positions(uuid, uuid);
DROP FUNCTION IF EXISTS public.reorder_board_columns(uuid, uuid[]);
DROP FUNCTION IF EXISTS public.is_workspace_member(uuid);
DROP FUNCTION IF EXISTS public.is_workspace_admin(uuid);

-- ─────────────────────────────────────────────────────────────
-- 2. Drop tables (CASCADE handles policies, triggers, indexes)
-- Order: children before parents (FK dependencies)
-- ─────────────────────────────────────────────────────────────

-- Activity feed
DROP TABLE IF EXISTS public.activity_comments CASCADE;
DROP TABLE IF EXISTS public.activity_reactions CASCADE;
DROP TABLE IF EXISTS public.activity_events CASCADE;

-- Kanban board
DROP TABLE IF EXISTS public.board_cards CASCADE;
DROP TABLE IF EXISTS public.board_columns CASCADE;
DROP TABLE IF EXISTS public.workspace_members CASCADE;
DROP TABLE IF EXISTS public.workspaces CASCADE;

-- Team members
DROP TABLE IF EXISTS public.team_invites CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;

-- Notifications
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.notification_preferences CASCADE;

-- Audit log
DROP TABLE IF EXISTS public.audit_logs CASCADE;

-- Bookmarks
DROP TABLE IF EXISTS public.bookmarks CASCADE;

-- Items (inline-edit table)
DROP TABLE IF EXISTS public.items CASCADE;

-- Reports
DROP TABLE IF EXISTS public.report_runs CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;

-- AI generator
DROP TABLE IF EXISTS public.generations CASCADE;

-- CSV import
DROP TABLE IF EXISTS public.import_job_errors CASCADE;
DROP TABLE IF EXISTS public.import_jobs CASCADE;
DROP TABLE IF EXISTS public.contacts CASCADE;

-- ─────────────────────────────────────────────────────────────
-- 3. Remove notifications from realtime publication (if added)
-- ─────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.notifications;
  END IF;
EXCEPTION WHEN undefined_table THEN
  NULL; -- table already dropped
END $$;

-- ─────────────────────────────────────────────────────────────
-- 4. Remove pg_cron jobs for stress-test features (if any)
-- ─────────────────────────────────────────────────────────────

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.unschedule(jobname)
    FROM cron.job
    WHERE jobname IN (
      'cleanup_audit_logs',
      'cleanup_activity_events',
      'cleanup_notifications',
      'cleanup_expired_invites'
    );
  END IF;
EXCEPTION WHEN undefined_table THEN
  NULL;
END $$;

-- ─────────────────────────────────────────────────────────────
-- 5. Core fixes (preserved from fix_rls migration)
-- ─────────────────────────────────────────────────────────────

-- FIX: GRANT consume_credits and refund_credits to service_role
-- (The billing migration REVOKEd from all roles but never GRANTed back)
DO $$
BEGIN
  GRANT EXECUTE ON FUNCTION public.consume_credits(uuid, text, integer) TO service_role;
  GRANT EXECUTE ON FUNCTION public.refund_credits(uuid, text, integer) TO service_role;
EXCEPTION WHEN undefined_function THEN
  NULL; -- functions don't exist yet if base migrations not applied
END $$;

-- FIX: Drop anon policy on system_email_errors (security — exposes email addresses)
DROP POLICY IF EXISTS "anon_read_recent_email_errors" ON public.system_email_errors;
