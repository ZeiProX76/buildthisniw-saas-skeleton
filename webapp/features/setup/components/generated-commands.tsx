'use client'

import { useMemo } from 'react'
import { CopyCommand } from './copy-command'
import {
  generateMcpCommands,
  generateSetupPrompt,
  type ServiceSelection,
} from '../lib/generate-setup-prompt'

const STEP_STYLES = 'flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold'

export function GeneratedCommands({
  selections,
}: {
  selections: ServiceSelection
}) {
  const mcpCommands = useMemo(() => generateMcpCommands(selections), [selections])
  const setupPrompt = useMemo(() => generateSetupPrompt(selections), [selections])

  return (
    <div className="rounded-xl border bg-card">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold text-card-foreground">
          Setup Commands
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Run these in your terminal. Updates based on your service selection.
        </p>
      </div>

      <div className="p-6 space-y-8">
        {/* Step 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={STEP_STYLES}>1</div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">Install Claude Code</p>
            </div>
          </div>
          <div className="ml-10">
            <CopyCommand code="npm install -g @anthropic-ai/claude-code" />
          </div>
        </div>

        {/* Step 2 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={STEP_STYLES}>2</div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">Add MCP Servers</p>
              <p className="text-xs text-muted-foreground">Connect Claude to your services</p>
            </div>
          </div>
          <div className="ml-10">
            <CopyCommand code={mcpCommands} />
          </div>
        </div>

        {/* Step 3 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={STEP_STYLES}>3</div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">Download and Open</p>
              <p className="text-xs text-muted-foreground">Open the project in Claude Code</p>
            </div>
          </div>
          <div className="ml-10">
            <CopyCommand code={`cd your-project-name\nclaude`} />
          </div>
        </div>

        {/* Step 4 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={STEP_STYLES}>4</div>
            <div>
              <p className="text-sm font-semibold text-card-foreground">Run Setup</p>
              <p className="text-xs text-muted-foreground">Paste this prompt into Claude</p>
            </div>
          </div>
          <div className="ml-10">
            <CopyCommand code={setupPrompt} />
          </div>
        </div>
      </div>
    </div>
  )
}
