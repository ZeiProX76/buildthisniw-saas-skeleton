/**
 * Shared pagination types for infinite scroll and list features
 */

/** Standard paginated response shape from oRPC procedures */
export interface PaginatedResponse<T> {
  items: T[]
  page: number
  hasMore: boolean
  totalCount: number
}

/** Filter config for URL-based filter management */
export interface FilterConfig<T> {
  /** Current filter values */
  filters: T
  /** Deterministic cache key from filter values */
  filtersKey: string
}
