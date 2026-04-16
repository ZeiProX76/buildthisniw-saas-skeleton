'use client'

import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  /** Whether there are more pages to load */
  hasNextPage: boolean
  /** Whether a page is currently being fetched */
  isFetchingNextPage: boolean
  /** Function to fetch the next page */
  fetchNextPage: () => void
  /** Root margin for the IntersectionObserver (default: '200px') */
  rootMargin?: string
}

/**
 * Hook that triggers fetchNextPage when a sentinel element enters the viewport.
 * Returns a ref to attach to the sentinel element.
 *
 * @example
 * ```tsx
 * const sentinelRef = useInfiniteScroll({
 *   hasNextPage,
 *   isFetchingNextPage,
 *   fetchNextPage,
 * })
 *
 * return (
 *   <>
 *     {items.map(item => <Card key={item.id} />)}
 *     <div ref={sentinelRef} />
 *   </>
 * )
 * ```
 */
export function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  rootMargin = '200px',
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { rootMargin },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, rootMargin])

  return sentinelRef
}
