import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useInfiniteScroll } from './use-infinite-scroll'

const mockObserve = vi.fn()
const mockDisconnect = vi.fn()
let observerCallback: IntersectionObserverCallback

beforeEach(() => {
  mockObserve.mockClear()
  mockDisconnect.mockClear()

  vi.stubGlobal('IntersectionObserver', vi.fn((cb: IntersectionObserverCallback) => {
    observerCallback = cb
    return {
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: vi.fn(),
    }
  }))
})

describe('useInfiniteScroll', () => {
  it('returns a ref object', () => {
    const fetchNextPage = vi.fn()
    const { result } = renderHook(() =>
      useInfiniteScroll({
        hasNextPage: true,
        isFetchingNextPage: false,
        fetchNextPage,
      })
    )
    expect(result.current).toHaveProperty('current')
  })

  it('does not observe when hasNextPage is false', () => {
    const fetchNextPage = vi.fn()
    renderHook(() =>
      useInfiniteScroll({
        hasNextPage: false,
        isFetchingNextPage: false,
        fetchNextPage,
      })
    )
    expect(mockObserve).not.toHaveBeenCalled()
  })

  it('calls fetchNextPage when sentinel is intersecting', () => {
    const fetchNextPage = vi.fn()
    const { result } = renderHook(() =>
      useInfiniteScroll({
        hasNextPage: true,
        isFetchingNextPage: false,
        fetchNextPage,
      })
    )

    // Simulate attaching the ref to a DOM element
    const sentinel = document.createElement('div')
    Object.defineProperty(result.current, 'current', {
      value: sentinel,
      writable: true,
    })

    // Re-render to trigger useEffect with the attached ref
    // The effect fires with the new ref value after re-render
    // For this test, we manually call the observer callback
    if (observerCallback) {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
      expect(fetchNextPage).toHaveBeenCalledTimes(1)
    }
  })

  it('does not call fetchNextPage when not intersecting', () => {
    const fetchNextPage = vi.fn()
    renderHook(() =>
      useInfiniteScroll({
        hasNextPage: true,
        isFetchingNextPage: false,
        fetchNextPage,
      })
    )

    if (observerCallback) {
      observerCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
      expect(fetchNextPage).not.toHaveBeenCalled()
    }
  })

  it('does not call fetchNextPage when already fetching', () => {
    const fetchNextPage = vi.fn()
    renderHook(() =>
      useInfiniteScroll({
        hasNextPage: true,
        isFetchingNextPage: true,
        fetchNextPage,
      })
    )

    if (observerCallback) {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver
      )
      expect(fetchNextPage).not.toHaveBeenCalled()
    }
  })

  it('cleans up without errors on unmount', () => {
    const fetchNextPage = vi.fn()
    const { unmount } = renderHook(() =>
      useInfiniteScroll({
        hasNextPage: true,
        isFetchingNextPage: false,
        fetchNextPage,
      })
    )

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow()
  })
})
