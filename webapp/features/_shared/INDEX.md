# Shared Registry

<!-- APPEND ONLY — add entries, don't modify/remove existing ones -->

Lightweight index of everything in `features/_shared/`. Agents read THIS instead of scanning the whole directory. Only read the actual source file when you need implementation details (e.g., exact props interface).

## Hooks

| Name | Import | Use When |
|------|--------|----------|
| `useInfiniteScroll` | `@/features/_shared/hooks` | Infinite scroll list — attaches IntersectionObserver to a sentinel. Pass `{ hasNextPage, isFetchingNextPage, fetchNextPage }`. |
| `useFilterUrl` | `@/features/_shared/hooks` | URL-based filters — `updateFilters()` (instant), `updateFilterDebounced()` (search input). Wraps in `startTransition`. Returns `isPending`. |

## Components

| Name | Import | Use When |
|------|--------|----------|
| `CardSkeleton` | `@/features/_shared/components` | Skeleton for a single card in a list. `rounded-lg border bg-card p-4`. |
| `CardGridSkeleton` | `@/features/_shared/components` | Grid of CardSkeletons. Pass `count` prop. |
| `TableRowSkeleton` | `@/features/_shared/components` | Skeleton for a single table row. Pass `columns` count. |
| `TableBodySkeleton` | `@/features/_shared/components` | Multiple TableRowSkeletons. Pass `rows` and `columns`. |
| `InfiniteScrollLoader` | `@/features/_shared/components` | Loading indicator at bottom of infinite scroll lists. Shows spinner when `isFetchingNextPage`. |

**Non-barrel components** (import directly from file):

| Name | File | Use When |
|------|------|----------|
| `AppSidebar` | `@/features/_shared/components/app-sidebar` | Main app sidebar (client). Already wired in protected layout. |
| `AppSidebarServer` | `@/features/_shared/components/app-sidebar-server` | Server wrapper that fetches sidebar data. |
| `LocaleSwitcher` | `@/features/_shared/components/locale-switcher` | Language dropdown. Already in sidebar. |
| `ThemeSwitcher` | `@/features/_shared/components/theme-switcher` | Light/dark toggle. Already in sidebar. |
| `LogoutButton` | `@/features/_shared/components/logout-button` | Sign out action. Already in sidebar. |
| `AuthButton` | `@/features/_shared/components/auth-button` | Auth CTA for unauthenticated users. |
| `Turnstile` | `@/features/_shared/components/turnstile` | Cloudflare Turnstile captcha widget. |

## Types

| Name | Import | Use When |
|------|--------|----------|
| `PaginatedResponse<T>` | `@/features/_shared/types` | Standard paginated response: `{ items: T[], page, hasMore, totalCount }` |
| `FilterConfig<T>` | `@/features/_shared/types` | URL filter state: `{ filters: T, filtersKey: string }` |
| `AuthPageProps` | `@/features/_shared/types` | Base props for auth pages with `searchParams: Promise<T>` |
| `LoginSearchParams` | `@/features/_shared/types` | Login URL params: `redirect?, email?, message?` |
| `SignUpSearchParams` | `@/features/_shared/types` | Sign-up URL params: `redirect?, email?, invitationToken?` |

## Utils

| Name | Import | Use When |
|------|--------|----------|
| `validateRedirect` | `@/features/_shared/utils` | Validates redirect URLs — prevents open redirect attacks. Only allows relative paths starting with `/`. |

## Constants

(none yet)

---
RULE: Check this registry BEFORE creating new shared code. Extend existing, don't duplicate.
