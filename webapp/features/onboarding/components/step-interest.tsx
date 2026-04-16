'use client'

import { useState, useEffect } from 'react'
import { SelectCard } from './select-card'
import { INTEREST_OPTIONS, PREFERENCE_ADVANCE_DELAY } from '../constants'
import { useSaveInterest } from '../hooks'
import type { SelectStepProps, PreferenceInterest } from '../types'

/**
 * Step 5: Interest preference selection
 * "What kind of product excites you most?"
 * Saves immediately on selection, then auto-advances after 200ms
 */
export function StepInterest({ onSelect }: SelectStepProps) {
  const [selectedValue, setSelectedValue] = useState<PreferenceInterest | null>(null)
  const saveMutation = useSaveInterest()

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
        What excites you most?
      </h1>

      <div className="grid gap-3">
        {INTEREST_OPTIONS.map((option, i) => (
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
