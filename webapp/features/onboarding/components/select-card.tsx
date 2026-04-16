'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { SelectCardProps } from '../types'

/**
 * Reusable single-select card component
 * Staggered entrance animation + icon-forward layout
 */
export function SelectCard({
  label,
  icon,
  selected = false,
  onClick,
  delay = 0,
}: SelectCardProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative w-full rounded-xl border px-5 py-4 text-left transition-all duration-200',
        'flex items-center gap-4',
        'hover:border-primary/60 hover:bg-primary/5',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'active:scale-[0.98]',
        selected && 'border-primary bg-primary/5 shadow-sm',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      )}
      style={{ transitionDelay: visible ? '0ms' : `${delay}ms` }}
      aria-pressed={selected}
    >
      {icon && (
        <span className="text-2xl shrink-0">{icon}</span>
      )}
      <span className="font-medium text-[15px]">
        {label}
      </span>
      {selected && (
        <svg
          className="ml-auto w-5 h-5 text-primary shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  )
}