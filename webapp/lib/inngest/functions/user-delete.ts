import { inngest } from '../client'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Cascade-delete all user data then remove the auth user.
 *
 * Triggered by the deleteAccount procedure via `app/user.delete`.
 * Uses admin client (service role) to bypass RLS.
 *
 * IMPORTANT: Update this list when new user-owned tables are added.
 * Tables with user_id FK (or id = user_id for profiles):
 *   import_job_errors (FK via import_jobs.id)
 *   report_runs (FK via reports.id)
 *   activity_comments, activity_reactions (FK via activity_events.id)
 *   contacts, import_jobs, generations, items, bookmarks
 *   board_cards, board_columns
 *   reports, notifications, notification_preferences
 *   credits, credit_balances, credit_ledger
 *   audit_logs, activity_events
 *   team_members, team_invites
 *   kit_step_progress, kit_purchases
 *   profiles (last — FK target)
 */
export const userDelete = inngest.createFunction(
  {
    id: 'user-delete',
    retries: 3,
    onFailure: async ({ error, event }) => {
      console.error('INNGEST FAIL', 'user-delete', error.message, event.data)
    },
  },
  { event: 'app/user.delete' },
  async ({ event, step }) => {
    const { userId } = event.data as { userId: string }
    const supabase = createAdminClient()

    // Step 1: Delete child records that depend on user-owned parent tables
    await step.run('delete-import-job-errors', async () => {
      // import_job_errors FK -> import_jobs, so delete errors for user's jobs
      const { data: jobs } = await supabase
        .from('import_jobs')
        .select('id')
        .eq('user_id', userId)

      if (jobs && jobs.length > 0) {
        const jobIds = jobs.map((j: { id: string }) => j.id)
        await supabase
          .from('import_job_errors')
          .delete()
          .in('job_id', jobIds)
      }
    })

    await step.run('delete-report-runs', async () => {
      // report_runs FK -> reports, so delete runs for user's reports
      const { data: reports } = await supabase
        .from('reports')
        .select('id')
        .eq('user_id', userId)

      if (reports && reports.length > 0) {
        const reportIds = reports.map((r: { id: string }) => r.id)
        // Also clean up storage files
        const { data: runs } = await supabase
          .from('report_runs')
          .select('storage_path')
          .in('report_id', reportIds)
          .not('storage_path', 'is', null)

        if (runs && runs.length > 0) {
          const paths = runs
            .map((r: { storage_path: string | null }) => r.storage_path)
            .filter((p): p is string => p !== null)
          if (paths.length > 0) {
            await supabase.storage.from('reports').remove(paths)
          }
        }

        await supabase
          .from('report_runs')
          .delete()
          .in('report_id', reportIds)
      }
    })

    await step.run('delete-activity-children', async () => {
      // activity_comments and activity_reactions FK -> activity_events
      const { data: events } = await supabase
        .from('activity_events')
        .select('id')
        .eq('user_id', userId)

      if (events && events.length > 0) {
        const eventIds = events.map((e: { id: string }) => e.id)
        await supabase
          .from('activity_comments')
          .delete()
          .in('event_id', eventIds)
        await supabase
          .from('activity_reactions')
          .delete()
          .in('event_id', eventIds)
      }

      // Also delete comments/reactions the user made on other people's events
      await supabase
        .from('activity_comments')
        .delete()
        .eq('user_id', userId)
      await supabase
        .from('activity_reactions')
        .delete()
        .eq('user_id', userId)
    })

    await step.run('delete-board-cards', async () => {
      // board_cards FK -> board_columns, delete cards first
      const { data: columns } = await supabase
        .from('board_columns')
        .select('id')
        .eq('user_id', userId)

      if (columns && columns.length > 0) {
        const columnIds = columns.map((c: { id: string }) => c.id)
        await supabase
          .from('board_cards')
          .delete()
          .in('column_id', columnIds)
      }
    })

    // Step 2: Delete user-owned tables (no child dependencies at this point)
    await step.run('delete-user-owned-tables', async () => {
      const tables = [
        'contacts',
        'import_jobs',
        'generations',
        'items',
        'bookmarks',
        'board_columns',
        'reports',
        'notifications',
        'notification_preferences',
        'credits',
        'credit_balances',
        'credit_ledger',
        'audit_logs',
        'activity_events',
        'team_members',
        'team_invites',
        'kit_step_progress',
        'kit_purchases',
      ]

      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('user_id', userId)

        if (error) {
          // Log but continue — some tables may not exist in all environments
          console.warn(`user-delete: failed to delete from ${table}:`, error.message)
        }
      }
    })

    // Step 3: Delete profile (FK target, must be last data deletion)
    await step.run('delete-profile', async () => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) {
        console.warn('user-delete: failed to delete profile:', error.message)
      }
    })

    // Step 4: Remove the auth user
    await step.run('delete-auth-user', async () => {
      const { error } = await supabase.auth.admin.deleteUser(userId)
      if (error) throw error
    })

    return { userId, deleted: true }
  },
)
