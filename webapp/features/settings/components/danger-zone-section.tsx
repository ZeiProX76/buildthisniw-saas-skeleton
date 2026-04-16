/**
 * DangerZoneSection — delete account with confirmation.
 * Server component shell — the actual form is a client component (DangerZoneForm).
 */
import { DangerZoneForm } from './danger-zone-form'

export async function DangerZoneSection() {
  return (
    <div data-slot="danger-zone-section">
      <DangerZoneForm />
    </div>
  )
}
