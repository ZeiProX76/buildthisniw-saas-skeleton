'use client'

/**
 * DangerZoneForm — delete account confirmation.
 * Requires: type display_name exactly + check "I understand" checkbox.
 * Both required to enable the confirm button.
 * On confirm: triggers Inngest cascade → sign out → redirect to /.
 * Uses React Hook Form + Zod (designer fills). TODO: designer
 */
export function DangerZoneForm() {
  return <div data-slot="danger-zone-form">TODO: designer</div>
}
