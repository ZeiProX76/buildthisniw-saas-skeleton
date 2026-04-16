'use client'

import { useState, useEffect } from 'react'
import { SelectCard } from './select-card'
import { EXPERIENCE_OPTIONS, PREFERENCE_ADVANCE_DELAY } from '../constants'
import { useSaveExperience } from '../hooks'
import type { SelectStepProps, PreferenceExperience } from '../types'

/**
 * Step 4: Experience preference selection
 * "How experienced are you with building SaaS products?"
 * Saves immediately on selection, then auto-advances after 200ms
 */
export function StepExperience({ onSelect }: SelectStepProps) {
  const [selectedValue, setSelectedValue] = useState<PreferenceExperience | null>(null)
  const saveMutation = useSaveExperience()

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
        Your experience level?
      </h1>

      <div className="grid gap-3">
        {EXPERIENCE_OPTIONS.map((option, i) => (
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
