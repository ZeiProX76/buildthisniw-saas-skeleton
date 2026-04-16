'use client'

import { useState, useEffect } from 'react'
import { SelectCard } from './select-card'
import { MOTIVATION_OPTIONS, PREFERENCE_ADVANCE_DELAY } from '../constants'
import { useSaveMotivation } from '../hooks'
import type { SelectStepProps, PreferenceMotivation } from '../types'

/**
 * Step 3: Motivation preference selection
 * "What brings you to Build This Now?"
 * Saves immediately on selection, then auto-advances after 200ms
 */
export function StepMotivation({ onSelect }: SelectStepProps) {
  const [selectedValue, setSelectedValue] = useState<PreferenceMotivation | null>(null)
  const saveMutation = useSaveMotivation()

  useEffect(() => {
    if (selectedValue) {
      // Save immediately, then auto-advance
      saveMutation.mutate(selectedValue)
      const timer = setTimeout(() => {
        onSelect(selectedValue)
      }, PREFERENCE_ADVANCE_DELAY)
      return () => clearTimeout(timer)
    }
  }, [selectedValue]) // intentionally exclude saveMutation and onSelect from deps

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">
        What brings you here?
      </h1>

      <div className="grid gap-3">
        {MOTIVATION_OPTIONS.map((option, i) => (
          <SelectCard
            key={option.value}
            label={option.label}
            icon={option.icon}
            selected={selectedValue === option.value}
            onClick={() => setSelectedValue(option.value)}
            delay={i * 60}
          />
        ))}
      </div>
    </div>
  )
}
