'use client'

import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface UpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature: string
}

export function UpgradeDialog({ open, onOpenChange, feature }: UpgradeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to unlock {feature}</DialogTitle>
          <DialogDescription>
            This feature is available on paid plans. Upgrade to get access.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
          <Button asChild className="transition-all duration-200 hover:scale-[1.02]">
            <Link href="/protected/billing">View Plans</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
