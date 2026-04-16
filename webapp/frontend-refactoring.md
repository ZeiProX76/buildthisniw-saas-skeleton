# Frontend Feature-Based Refactoring

## Objective

Reorganize the frontend code structure for **better readability, debuggability, and maintainability** without changing ANY functionality.

## Core Principles

### 1. Zero Changes to Functionality
```
ZERO FUNCTIONAL CHANGES
ZERO BEHAVIOR CHANGES
ZERO VISUAL CHANGES
```
Only file organization and import paths change. Every feature works exactly as before.

### 2. Maximize Reusability & Sharing
```
EXTRACT EVERYTHING REUSABLE
SHARE EVERYTHING POSSIBLE
DRY - DON'T REPEAT YOURSELF
```
- If a type is used in multiple places → extract to shared types
- If a utility function can be reused → extract to shared utils
- If a constant appears more than once → extract to shared constants
- If a component pattern repeats → extract to shared components
- Always look for opportunities to consolidate and share code

### 3. Shared Code Location
```
features/_shared/  ← All shared code lives here (underscore = sorted first)
```
Shared utils affect **working files** - never break them, only extend with best practices.

### 3.1. Shared Registry
```
features/_shared/registry.md  ← AI-READABLE QUICK REFERENCE
```
Always check registry BEFORE creating new utils/types/constants. Extend existing ones, don't duplicate.

### 4. Protected Area Structure
```
features/protected/
├── users/          # User-facing protected pages
└── admin/          # Admin-only protected pages
```

---

## Current Structure

```
webapp/app/
├── page.tsx                    # Home page (inline components)
├── layout.tsx                  # Root layout
├── protected/
│   ├── page.tsx               # Protected page (inline UserDetails)
│   └── layout.tsx             # Protected layout (duplicated nav/footer)
├── auth/
│   ├── login/
│   │   ├── page.tsx           # PPR wrapper
│   │   ├── cached-login-ui.tsx
│   │   └── dynamic-login-form.tsx  # Has validateRedirect utility
│   ├── sign-up/
│   │   ├── page.tsx
│   │   ├── cached-sign-up-ui.tsx
│   │   └── dynamic-sign-up-form.tsx
│   ├── sign-up-success/
│   │   ├── page.tsx
│   │   ├── cached-sign-up-success-ui.tsx
│   │   ├── dynamic-sign-up-success.tsx
│   │   └── sign-up-success-content.tsx  # Has constants, hooks logic
│   ├── error/
│   │   └── page.tsx           # Inline ErrorContent component
│   ├── forgot-password/
│   │   └── page.tsx
│   └── update-password/
│       └── page.tsx
```

---

## Target Structure

```
webapp/features/
├── _shared/                         # All shared code (underscore = sorted first)
│   ├── types/
│   │   └── index.ts                 # AuthPageProps, LoginSearchParams, etc.
│   ├── constants/
│   │   └── index.ts                 # Shared constants
│   ├── utils/
│   │   └── index.ts                 # validateRedirect(), etc.
│   ├── hooks/
│   │   └── index.ts                 # Shared hooks
│   ├── components/
│   │   └── index.ts                 # Shared components
│   └── registry.md                  # AI-readable quick reference
│
├── home/
│   ├── types/
│   │   └── index.ts
│   ├── constants/
│   │   └── index.ts
│   ├── hooks/
│   │   └── index.ts
│   └── components/
│       └── index.ts
│
├── protected/
│   ├── types/
│   │   └── index.ts
│   ├── constants/
│   │   └── index.ts
│   ├── hooks/
│   │   └── index.ts
│   └── components/
│       ├── user-details.tsx
│       └── index.ts
│
└── auth/                           # Feature-specific auth code
    ├── login/
    │   ├── types/
    │   │   └── index.ts
    │   ├── constants/
    │   │   └── index.ts
    │   ├── hooks/
    │   │   └── index.ts
    │   └── components/
    │       ├── cached-login-ui.tsx
    │       ├── dynamic-login-form.tsx
    │       └── index.ts
    │
    ├── sign-up/
    │   ├── types/
    │   │   └── index.ts
    │   ├── constants/
    │   │   └── index.ts
    │   ├── hooks/
    │   │   └── index.ts
    │   └── components/
    │       ├── cached-sign-up-ui.tsx
    │       ├── dynamic-sign-up-form.tsx
    │       └── index.ts
    │
    ├── sign-up-success/
    │   ├── types/
    │   │   └── index.ts
    │   ├── constants/
    │   │   └── index.ts        # STORAGE_KEY, RESEND_COOLDOWN_SECONDS
    │   ├── hooks/
    │   │   └── index.ts        # (future: useOtpVerification)
    │   └── components/
    │       ├── cached-sign-up-success-ui.tsx
    │       ├── dynamic-sign-up-success.tsx
    │       ├── sign-up-success-content.tsx
    │       └── index.ts
    │
    ├── error/
    │   ├── types/
    │   │   └── index.ts
    │   ├── constants/
    │   │   └── index.ts
    │   ├── hooks/
    │   │   └── index.ts
    │   └── components/
    │       ├── error-content.tsx
    │       └── index.ts
    │
    ├── forgot-password/
    │   ├── types/
    │   │   └── index.ts
    │   ├── constants/
    │   │   └── index.ts
    │   ├── hooks/
    │   │   └── index.ts
    │   └── components/
    │       └── index.ts
    │
    └── update-password/
        ├── types/
        │   └── index.ts
        ├── constants/
        │   └── index.ts
        ├── hooks/
        │   └── index.ts
        └── components/
            └── index.ts
```

---

## What Gets Extracted

### From Each Page

| Source File | Extract To | What |
|-------------|------------|------|
| `auth/login/page.tsx` | `features/auth/login/types/` | `PageProps` interface |
| `auth/login/dynamic-login-form.tsx` | `features/auth/login/types/` | `DynamicLoginFormProps` |
| `auth/login/dynamic-login-form.tsx` | `features/_shared/utils/` | `validateRedirect()` |
| `auth/sign-up/page.tsx` | `features/auth/sign-up/types/` | `PageProps` interface |
| `auth/sign-up-success/page.tsx` | `features/auth/sign-up-success/types/` | `PageProps` interface |
| `auth/sign-up-success/sign-up-success-content.tsx` | `features/auth/sign-up-success/types/` | `SignUpSuccessContentProps` |
| `auth/sign-up-success/sign-up-success-content.tsx` | `features/auth/sign-up-success/constants/` | `STORAGE_KEY`, `RESEND_COOLDOWN_SECONDS` |
| `auth/error/page.tsx` | `features/auth/error/types/` | `PageProps`, inline props |
| `auth/error/page.tsx` | `features/auth/error/components/` | `ErrorContent` component |
| `protected/page.tsx` | `features/protected/components/` | `UserDetails` component |

### Shared Auth Types

```typescript
// features/_shared/types/index.ts
export interface AuthPageProps<T = Record<string, string | undefined>> {
  searchParams: Promise<T>;
}

export interface LoginSearchParams {
  redirect?: string;
  email?: string;
  message?: string;
}

export interface SignUpSearchParams {
  redirect?: string;
  email?: string;
  invitationToken?: string;
}

export interface SignUpSuccessSearchParams {
  email?: string;
}

export interface ErrorSearchParams {
  error?: string;
}
```

---

## Migration Strategy

### Step 1: Create Empty Structure
Create all folders and empty index.ts files.

### Step 2: Extract Types
Move interfaces to `types/index.ts`, update imports.

### Step 3: Extract Constants
Move constants to `constants/index.ts`, update imports.

### Step 4: Extract Utilities
Move utility functions to shared `utils/`, update imports.

### Step 5: Extract Components
Move inline components to `components/`, update imports.

### Step 6: Update Page Files
Pages become thin wrappers that import from features.

---

## Example: Before & After

### Before: `auth/login/page.tsx`
```tsx
import { Suspense } from "react";
import { CachedLoginUI } from "./cached-login-ui";
import { DynamicLoginForm } from "./dynamic-login-form";

interface PageProps {
  searchParams: Promise<{
    redirect?: string;
    email?: string;
    message?: string;
  }>;
}

export default function LoginPage({
  searchParams,
}: PageProps): React.ReactElement {
  return (
    <Suspense fallback={<CachedLoginUI />}>
      <DynamicLoginForm searchParams={searchParams} />
    </Suspense>
  );
}
```

### After: `features/auth/login/types/index.ts`
```tsx
import type { LoginSearchParams } from "@/features/_shared/types";

export interface LoginPageProps {
  searchParams: Promise<LoginSearchParams>;
}
```

### After: `auth/login/page.tsx`
```tsx
import { Suspense } from "react";
import { CachedLoginUI } from "@/features/auth/login/components";
import { DynamicLoginForm } from "@/features/auth/login/components";
import type { LoginPageProps } from "@/features/auth/login/types";

export default function LoginPage({
  searchParams,
}: LoginPageProps): React.ReactElement {
  return (
    <Suspense fallback={<CachedLoginUI />}>
      <DynamicLoginForm searchParams={searchParams} />
    </Suspense>
  );
}
```

---

## Benefits

1. **Discoverability**: All code for a feature in one place
2. **Tree-shaking**: Index.ts exports only what's needed
3. **Debuggability**: Clear import paths show dependencies
4. **Scalability**: Easy to add new types/constants/hooks/components
5. **Consistency**: Same pattern across all features

---

## Shared Registry Template

`features/_shared/registry.md` - AI-readable quick reference:

```markdown
# Shared Registry

## Utils
| Name | Import | Description |
|------|--------|-------------|
| validateRedirect | `@/features/_shared/utils` | Security: validates redirect URLs |

## Types
| Name | Import | Description |
|------|--------|-------------|
| AuthPageProps | `@/features/_shared/types` | Base props for auth pages |
| LoginSearchParams | `@/features/_shared/types` | Login URL params |
| SignUpSearchParams | `@/features/_shared/types` | Sign-up URL params |
| SignUpSuccessSearchParams | `@/features/_shared/types` | Sign-up success URL params |
| ErrorSearchParams | `@/features/_shared/types` | Error page URL params |

## Constants
| Name | Import | Description |
|------|--------|-------------|
| (none yet) | - | - |

## Hooks
| Name | Import | Description |
|------|--------|-------------|
| (none yet) | - | - |

## Components
| Name | Import | Description |
|------|--------|-------------|
| (none yet) | - | - |

---
RULE: Always check registry BEFORE creating new utils/types/constants.
      Extend existing ones, don't duplicate.
```

---

## Verification Checklist

After migration, verify:

- [ ] `pnpm build` succeeds
- [ ] `pnpm lint` passes
- [ ] `pnpm type-check` passes
- [ ] All pages render correctly
- [ ] Auth flows work (login, signup, OTP, password reset)
- [ ] Protected route redirects work
- [ ] No console errors
