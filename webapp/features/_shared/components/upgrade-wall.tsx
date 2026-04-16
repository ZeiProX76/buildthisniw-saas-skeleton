'use client'

import { Lock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface UpgradeWallProps {
  feature: string
  title?: string
  description?: string
}

export function UpgradeWall({
  feature,
  title,
  description,
}: UpgradeWallProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="mx-auto w-full max-w-md text-center">
        <Lock className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
        <h2 className="text-xl font-semibold tracking-tight">
          {title ?? `Unlock ${feature}`}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {description ?? `Upgrade your plan to access ${feature}.`}
        </p>
        <Button asChild className="mt-6 transition-all duration-200 hover:scale-[1.02]">
          <Link href="/protected/billing">View Plans</Link>
        </Button>
      </div>
    </div>
  )
}
