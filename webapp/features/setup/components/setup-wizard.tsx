'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ServiceSelector } from './service-selector'
import { GeneratedCommands } from './generated-commands'
import {
  DEFAULT_SELECTIONS,
  type ServiceSelection,
} from '../lib/generate-setup-prompt'

const STORAGE_KEY = 'btn-setup-selections'

function loadSelections(): ServiceSelection {
  if (typeof window === 'undefined') return DEFAULT_SELECTIONS
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_SELECTIONS, ...JSON.parse(stored) }
  } catch {
    // ignore
  }
  return DEFAULT_SELECTIONS
}

export function SetupWizard() {
  const [mode, setMode] = useState<'default' | 'custom'>('default')
  const [selections, setSelections] = useState<ServiceSelection>(DEFAULT_SELECTIONS)

  // Load from localStorage on mount
  useEffect(() => {
    setSelections(loadSelections())
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selections))
    } catch {
      // ignore
    }
  }, [selections])

  const handleModeChange = (newMode: 'default' | 'custom') => {
    setMode(newMode)
    if (newMode === 'default') {
      setSelections(DEFAULT_SELECTIONS)
    }
  }

  const handleToggle = (key: keyof ServiceSelection) => {
    if (key === 'supabase') return // can't uncheck
    setSelections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Project Setup
        </h1>
        <p className="mt-2 text-base text-muted-foreground max-w-lg">
          Pick your services, copy the commands, and Claude handles the rest.
        </p>
      </div>

      {/* Video placeholder */}
      <div className="aspect-video rounded-xl bg-muted/30 border border-dashed flex flex-col items-center justify-center">
        <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Play className="size-6 text-primary ml-0.5" />
        </div>
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          Walkthrough coming soon
        </p>
      </div>

      {/* Service Selector */}
      <ServiceSelector
        mode={mode}
        onModeChange={handleModeChange}
        selections={selections}
        onToggle={handleToggle}
      />

      {/* Generated Commands */}
      <GeneratedCommands selections={selections} />

      {/* What's Next */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          After setup completes
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold mt-0.5">
              1
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground">
                Document your project
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Define what you're building so the agents know the context.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold mt-0.5">
              2
            </div>
            <div>
              <p className="text-sm font-medium text-card-foreground">
                Follow the workflows
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Design system, landing page, auth, billing. All covered in the Build Guide.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Button asChild variant="outline" className="gap-2 cursor-pointer">
            <Link href="/protected/home">
              Go to Home
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
