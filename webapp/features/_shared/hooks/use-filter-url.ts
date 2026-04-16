'use client'

import { useCallback, useRef, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * Hook for managing URL-based filter state.
 * Updates are wrapped in startTransition to keep old UI visible during navigation.
 *
 * @example
 * ```tsx
 * const { updateFilters, updateFilterDebounced, isPending } = useFilterUrl()
 *
 * // Instant update (selects, toggles)
 * updateFilters({ category: 'technology' })
 *
 * // Debounced update (search inputs)
 * updateFilterDebounced('q', value)
 * ```
 */
export function useFilterUrl(debounceMs = 500) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const debounceTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  /** Update multiple filter params at once (instant) */
  const updateFilters = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }

      const queryString = params.toString()
      const url = queryString ? `?${queryString}` : window.location.pathname

      startTransition(() => {
        router.replace(url, { scroll: false })
      })
    },
    [router, searchParams],
  )

  /** Debounced update for a single filter key (text inputs) */
  const updateFilterDebounced = useCallback(
    (key: string, value: string) => {
      const existing = debounceTimers.current.get(key)
      if (existing) clearTimeout(existing)

      const timer = setTimeout(() => {
        updateFilters({ [key]: value || undefined })
        debounceTimers.current.delete(key)
      }, debounceMs)

      debounceTimers.current.set(key, timer)
    },
    [updateFilters, debounceMs],
  )

  /** Reset all filters */
  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.replace(window.location.pathname, { scroll: false })
    })
  }, [router])

  return {
    updateFilters,
    updateFilterDebounced,
    resetFilters,
    isPending,
    searchParams,
  }
}
