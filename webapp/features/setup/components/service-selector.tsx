'use client'

import {
  Database,
  CreditCard,
  Bug,
  Cog,
  Mail,
  Shield,
  BookOpen,
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import type { ServiceSelection } from '../lib/generate-setup-prompt'

type BadgeType = 'REQUIRED' | 'RECOMMENDED' | 'OPTIONAL'

const BADGE_STYLES: Record<BadgeType, string> = {
  REQUIRED: 'bg-primary/10 text-primary border-primary/20',
  RECOMMENDED: 'bg-warning/10 text-warning border-warning/20',
  OPTIONAL: 'bg-muted text-muted-foreground border-border',
}

const SERVICES: {
  key: keyof ServiceSelection
  label: string
  icon: React.ComponentType<{ className?: string }>
  desc: string
  badge: BadgeType
  canUncheck: boolean
}[] = [
  { key: 'supabase', label: 'Supabase', icon: Database, desc: 'Database, auth, real-time', badge: 'REQUIRED', canUncheck: false },
  { key: 'stripe', label: 'Stripe', icon: CreditCard, desc: 'Payments and billing', badge: 'RECOMMENDED', canUncheck: true },
  { key: 'sentry', label: 'Sentry', icon: Bug, desc: 'Error tracking and monitoring', badge: 'RECOMMENDED', canUncheck: true },
  { key: 'inngest', label: 'Inngest', icon: Cog, desc: 'Background jobs, cron, queues', badge: 'OPTIONAL', canUncheck: true },
  { key: 'resend', label: 'Resend', icon: Mail, desc: 'Transactional emails', badge: 'OPTIONAL', canUncheck: true },
  { key: 'turnstile', label: 'Turnstile', icon: Shield, desc: 'Bot protection', badge: 'OPTIONAL', canUncheck: true },
  { key: 'context7', label: 'Context7', icon: BookOpen, desc: 'Live library docs for Claude', badge: 'RECOMMENDED', canUncheck: true },
]

export function ServiceSelector({
  mode,
  onModeChange,
  selections,
  onToggle,
}: {
  mode: 'default' | 'custom'
  onModeChange: (mode: 'default' | 'custom') => void
  selections: ServiceSelection
  onToggle: (key: keyof ServiceSelection) => void
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-card-foreground">Services</h3>
        <div className="flex rounded-lg border bg-muted/50 p-0.5">
          <button
            onClick={() => onModeChange('default')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              mode === 'default'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Default Setup
          </button>
          <button
            onClick={() => onModeChange('custom')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
              mode === 'custom'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Customize
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {SERVICES.map((s) => {
          const Icon = s.icon
          const checked = selections[s.key]
          const disabled = mode === 'default' || !s.canUncheck

          return (
            <label
              key={s.key}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                disabled ? '' : 'hover:bg-accent/50 cursor-pointer'
              }`}
            >
              <Checkbox
                checked={checked}
                disabled={disabled}
                onCheckedChange={() => onToggle(s.key)}
                className="shrink-0"
              />
              <Icon className="size-4 text-muted-foreground shrink-0" />
              <span className="text-sm font-medium text-card-foreground flex-1">
                {s.label}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block flex-1 max-w-[200px]">
                {s.desc}
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 ${BADGE_STYLES[s.badge]}`}
              >
                {s.badge}
              </Badge>
            </label>
          )
        })}
      </div>
    </div>
  )
}
