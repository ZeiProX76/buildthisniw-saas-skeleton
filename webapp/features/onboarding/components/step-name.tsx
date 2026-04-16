'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUpdateName } from '../hooks'
import type { StepNameProps } from '../types'

/**
 * Step 1: Name input
 * Collects the user's display name
 * Pre-fills from Google OAuth name if available
 */
export function StepName({ defaultValue = '', googleName, onComplete }: StepNameProps) {
  const [name, setName] = useState(defaultValue || googleName || '')
  const [error, setError] = useState<string | null>(null)
  const updateName = useUpdateName()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Please enter your name')
      return
    }

    try {
      await updateName.mutateAsync(trimmedName)
      onComplete(trimmedName)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save name')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">
        What&apos;s your name?
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="text-lg py-6 px-4"
            autoFocus
            disabled={updateName.isPending}
            aria-label="Your name"
            aria-invalid={!!error}
            aria-describedby={error ? 'name-error' : undefined}
          />
          {error && (
            <p id="name-error" className="mt-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={updateName.isPending || !name.trim()}
        >
          {updateName.isPending ? 'Saving...' : 'Continue'}
        </Button>
      </form>
    </div>
  )
}
