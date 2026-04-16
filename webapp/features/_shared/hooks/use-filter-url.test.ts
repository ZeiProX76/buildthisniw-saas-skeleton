import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFilterUrl } from './use-filter-url'

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams('category=technology&sort_by=created_at'),
}))

describe('useFilterUrl', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns expected API', () => {
    const { result } = renderHook(() => useFilterUrl())
    expect(result.current).toHaveProperty('updateFilters')
    expect(result.current).toHaveProperty('updateFilterDebounced')
    expect(result.current).toHaveProperty('resetFilters')
    expect(result.current).toHaveProperty('isPending')
    expect(result.current).toHaveProperty('searchParams')
  })

  it('updateFilters sets new params on URL', () => {
    const { result } = renderHook(() => useFilterUrl())

    act(() => {
      result.current.updateFilters({ status: 'published' })
    })

    expect(mockReplace).toHaveBeenCalled()
    const url = mockReplace.mock.calls[0][0] as string
    expect(url).toContain('status=published')
    // Existing params should be preserved
    expect(url).toContain('category=technology')
  })

  it('updateFilters removes params with undefined value', () => {
    const { result } = renderHook(() => useFilterUrl())

    act(() => {
      result.current.updateFilters({ category: undefined })
    })

    expect(mockReplace).toHaveBeenCalled()
    const url = mockReplace.mock.calls[0][0] as string
    expect(url).not.toContain('category=')
  })

  it('updateFilters removes params with empty string value', () => {
    const { result } = renderHook(() => useFilterUrl())

    act(() => {
      result.current.updateFilters({ category: '' })
    })

    expect(mockReplace).toHaveBeenCalled()
    const url = mockReplace.mock.calls[0][0] as string
    expect(url).not.toContain('category=')
  })

  it('updateFilterDebounced delays the call', () => {
    const { result } = renderHook(() => useFilterUrl(300))

    act(() => {
      result.current.updateFilterDebounced('q', 'hello')
    })

    // Should not have called replace yet
    expect(mockReplace).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Now it should have been called
    expect(mockReplace).toHaveBeenCalledTimes(1)
    const url = mockReplace.mock.calls[0][0] as string
    expect(url).toContain('q=hello')
  })

  it('updateFilterDebounced cancels previous timer on rapid calls', () => {
    const { result } = renderHook(() => useFilterUrl(300))

    act(() => {
      result.current.updateFilterDebounced('q', 'h')
    })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    act(() => {
      result.current.updateFilterDebounced('q', 'he')
    })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    act(() => {
      result.current.updateFilterDebounced('q', 'hel')
    })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Only the last value should be applied
    expect(mockReplace).toHaveBeenCalledTimes(1)
    const url = mockReplace.mock.calls[0][0] as string
    expect(url).toContain('q=hel')
  })

  it('updateFilterDebounced removes empty value', () => {
    const { result } = renderHook(() => useFilterUrl(300))

    act(() => {
      result.current.updateFilterDebounced('q', '')
    })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(mockReplace).toHaveBeenCalled()
    const url = mockReplace.mock.calls[0][0] as string
    expect(url).not.toContain('q=')
  })

  it('resetFilters replaces to pathname only', () => {
    const { result } = renderHook(() => useFilterUrl())

    act(() => {
      result.current.resetFilters()
    })

    expect(mockReplace).toHaveBeenCalledWith(
      expect.any(String),
      { scroll: false }
    )
  })
})
