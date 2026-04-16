# buildthisniw — SaaS skeleton

The reference SaaS skeleton used by [`buildthisniw`](https://www.npmjs.com/package/buildthisniw). Cloned into your project by:

```bash
/skeleton saas
```

…inside a Claude Code session that already has the `buildthisniw` framework installed.

## Stack

- **Frontend** — Next.js 16 (App Router, RSC), React 19, Tailwind v4, shadcn/ui
- **Backend** — oRPC procedures, Supabase (auth + Postgres + RLS + storage + realtime)
- **Billing** — Stripe checkout + webhooks via Supabase Edge Functions
- **Background** — Inngest for jobs/cron/queues
- **Observability** — Sentry (errors), plus scaffolding for PostHog/Umami analytics
- **Email** — Resend via Edge Function, React Email templates

## What's already wired

- Email + password auth with 8-digit OTP verification
- Google OAuth
- Multi-step onboarding with preferences + auth-time gating
- Stripe checkout (one-time + subscription modes), pricing page, customer portal
- JWT custom claims via Postgres hook
- Rate limiting middleware
- Pre-commit security scan (`.githooks/pre-commit`) catching secrets + obfuscated config injection
- Playwright E2E test scaffolding
- OKLCH design tokens, gradient buttons, shadow system, dark mode

## Using this repo standalone

You can clone this without `buildthisniw` if you want — it's a regular Next.js + Supabase project.

```bash
git clone https://github.com/ZeiProX76/buildthisniw-saas-skeleton.git my-app
cd my-app/webapp
npm install
cp .env.example .env        # fill in Supabase + Stripe keys
npm run dev
```

But you lose the agent-assisted build/heal/audit flow — the value multiplier is running this alongside `npx buildthisniw init` in a Claude Code session.

## License

See `LICENSE.md`.
