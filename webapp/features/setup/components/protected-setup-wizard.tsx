"use client";

import { useState, useCallback } from "react";
import {
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Terminal,
  ChevronDown,
  Zap,
  Info,
  Rocket,
  ChevronRight,
  Play,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// ─── Badge Styles ────────────────────────────────────────────────────

const BADGE_STYLES = {
  OPTIONAL: "bg-muted text-muted-foreground border-border",
} as const;

// ─── Copy Button ─────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="cursor-pointer gap-1.5 shrink-0 text-xs"
    >
      {copied ? (
        <>
          <Check className="size-3" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-3" />
          {label ?? "Copy"}
        </>
      )}
    </Button>
  );
}

// ─── Inline Command ──────────────────────────────────────────────────

function InlineCommand({ command, note }: { command: string; note?: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
        <code className="flex-1 text-xs sm:text-[13px] font-mono text-foreground/80 overflow-x-auto">
          {command}
        </code>
        <CopyButton text={command} />
      </div>
      {note && (
        <p className="text-xs text-muted-foreground pl-1">{note}</p>
      )}
    </div>
  );
}

// ─── Info Box ────────────────────────────────────────────────────────

function InfoBox({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "success";
}) {
  const styles =
    variant === "success"
      ? "border-emerald-500/30 bg-emerald-500/5"
      : "border-primary/20 bg-primary/5";

  const iconColor =
    variant === "success" ? "text-emerald-500" : "text-primary";

  return (
    <div className={`flex gap-3 rounded-lg border p-3.5 ${styles}`}>
      <Info className={`size-4 shrink-0 mt-0.5 ${iconColor}`} />
      <div className="text-sm text-foreground/80 leading-relaxed">
        {children}
      </div>
    </div>
  );
}

// ─── Sub-step ────────────────────────────────────────────────────────

function SubStep({
  number,
  children,
}: {
  number: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground mt-0.5">
        {number}
      </div>
      <div className="flex-1 min-w-0 text-sm text-foreground/90 leading-relaxed pt-0.5">
        {children}
      </div>
    </div>
  );
}

// ─── External Link ───────────────────────────────────────────────────

function ExtLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 underline underline-offset-2 decoration-primary/30 hover:decoration-primary/60 transition-colors duration-200"
    >
      {children}
      <ExternalLink className="size-3" />
    </a>
  );
}

// ─── Env Var Line ────────────────────────────────────────────────────

function EnvVar({ name, hint }: { name: string; hint?: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <code className="text-xs font-mono bg-muted/60 text-foreground/80 px-1.5 py-0.5 rounded">
        {name}
      </code>
      {hint && (
        <span className="text-xs text-muted-foreground">({hint})</span>
      )}
    </span>
  );
}

// ─── Accordion Step ──────────────────────────────────────────────────

function AccordionStep({
  number,
  title,
  description,
  optional,
  isOpen,
  isDone,
  onToggle,
  onDone,
  children,
}: {
  number: number;
  title: string;
  description: string;
  optional?: boolean;
  isOpen: boolean;
  isDone: boolean;
  onToggle: () => void;
  onDone: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border transition-all duration-300 ${
        isOpen
          ? "border-primary/30 bg-card shadow-sm"
          : isDone
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-border bg-card/50"
      }`}
    >
      {/* Header — always visible, clickable */}
      <button
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left cursor-pointer"
      >
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
            isDone
              ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/25"
              : isOpen
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {isDone ? <Check className="size-4" /> : number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2
              className={`text-base font-semibold ${
                isDone ? "text-emerald-600 dark:text-emerald-400" : "text-foreground"
              }`}
            >
              {title}
            </h2>
            {optional && (
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 ${BADGE_STYLES.OPTIONAL}`}
              >
                OPTIONAL
              </Badge>
            )}
            {isDone && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              >
                DONE
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        </div>
        <ChevronDown
          className={`size-5 shrink-0 text-muted-foreground transition-transform duration-200 mt-1 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Content — collapsible */}
      {isOpen && (
        <div className="px-4 pb-4">
          <div className="ml-11 space-y-4">
            {children}

            {/* Done button */}
            <div className="pt-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDone();
                }}
                size="sm"
                className={`cursor-pointer gap-1.5 ${
                  isDone
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : ""
                }`}
              >
                <Check className="size-3.5" />
                {isDone ? "Completed" : "Done"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export function ProtectedSetupWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set()
  );
  const [sentryExpanded, setSentryExpanded] = useState(false);

  const totalSteps = 9;

  const markDone = useCallback(
    (step: number) => {
      setCompletedSteps((prev) => {
        const next = new Set(prev);
        next.add(step);
        return next;
      });
      // Advance to next uncompleted step
      if (step < totalSteps - 1) {
        setCurrentStep(step + 1);
      }
    },
    [totalSteps]
  );

  const toggleStep = useCallback(
    (step: number) => {
      setCurrentStep((prev) => (prev === step ? -1 : step));
    },
    []
  );

  const allDone = completedSteps.size === totalSteps;
  const completedCount = completedSteps.size;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <Rocket className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Setup Guide
            </h1>
          </div>
        </div>
        <p className="text-base text-muted-foreground max-w-lg">
          Follow these {totalSteps} steps to configure your services. Then run{" "}
          <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
            claude /setup
          </code>{" "}
          and Claude handles the rest.
        </p>

        {/* Step progress */}
        <div className="flex items-center gap-3 mt-5">
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                  completedSteps.has(i)
                    ? "bg-emerald-500"
                    : i === currentStep
                      ? "bg-primary"
                      : "bg-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {completedCount}/{totalSteps}
          </span>
        </div>
      </div>

      {/* ─── Video Placeholder ────────────────────────────────── */}
      <div className="mb-8">
        <div className="relative aspect-video w-full rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
            <Play className="size-6 text-primary ml-0.5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Setup walkthrough video
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Coming soon — follow the steps below in the meantime
            </p>
          </div>
        </div>
      </div>

      {/* ─── Steps ────────────────────────────────────────────── */}
      <div className="space-y-3">
        {/* ─── Step 1: Install Claude Code ──────────────────── */}
        <AccordionStep
          number={1}
          title="Install Claude Code"
          description="Install the CLI globally. Requires Node.js 18+."
          isOpen={currentStep === 0}
          isDone={completedSteps.has(0)}
          onToggle={() => toggleStep(0)}
          onDone={() => markDone(0)}
        >
          <InlineCommand command="npm install -g @anthropic-ai/claude-code" />

          <InfoBox>
            Claude Code is the AI-powered CLI that automates the rest of the
            setup. Make sure you have{" "}
            <ExtLink href="https://nodejs.org/en/download">Node.js 18+</ExtLink>,{" "}
            <ExtLink href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm">npm 9+</ExtLink>,{" "}
            and <ExtLink href="https://git-scm.com/downloads">Git</ExtLink> installed.
          </InfoBox>
        </AccordionStep>

        {/* ─── Step 2: Supabase ─────────────────────────────── */}
        <AccordionStep
          number={2}
          title="Supabase"
          description="Database, auth, storage, and real-time. Just create an account — the MCP handles everything else."
          isOpen={currentStep === 1}
          isDone={completedSteps.has(1)}
          onToggle={() => toggleStep(1)}
          onDone={() => markDone(1)}
        >
          <div className="space-y-3">
            <SubStep number={1}>
              <ExtLink href="https://supabase.com/dashboard">
                Create a free account
              </ExtLink>
            </SubStep>
            <SubStep number={2}>
              Connect the MCP server:
              <div className="mt-2">
                <InlineCommand command="claude mcp add --transport http supabase https://mcp.supabase.com/mcp" />
              </div>
            </SubStep>
            <SubStep number={3}>
              Approve the OAuth consent when prompted in the browser
            </SubStep>
          </div>

          <InfoBox variant="success">
            That&apos;s it! Claude will automatically create your project, get
            your API keys, run migrations, deploy edge functions, and set up
            auth hooks.
          </InfoBox>
        </AccordionStep>

        {/* ─── Step 3: Stripe ───────────────────────────────── */}
        <AccordionStep
          number={3}
          title="Stripe"
          description="Payments and billing. You'll need to copy two API keys."
          isOpen={currentStep === 2}
          isDone={completedSteps.has(2)}
          onToggle={() => toggleStep(2)}
          onDone={() => markDone(2)}
        >
          <div className="space-y-3">
            <SubStep number={1}>
              <ExtLink href="https://stripe.com">
                Create a free account
              </ExtLink>
            </SubStep>
            <SubStep number={2}>
              Go to{" "}
              <ExtLink href="https://dashboard.stripe.com/test/apikeys">
                Developers &rarr; API Keys
              </ExtLink>
            </SubStep>
            <SubStep number={3}>
              Copy your Secret Key &mdash;{" "}
              <EnvVar name="STRIPE_SECRET_KEY" hint="starts with sk_test_" />
            </SubStep>
            <SubStep number={4}>
              Copy your Publishable Key &mdash;{" "}
              <EnvVar
                name="STRIPE_PUBLISHABLE_KEY"
                hint="starts with pk_test_"
              />
            </SubStep>
            <SubStep number={5}>
              Add both to{" "}
              <code className="text-xs font-mono bg-muted/60 px-1.5 py-0.5 rounded">
                webapp/.env
              </code>
              <div className="mt-2 space-y-1">
                <div className="rounded border bg-muted/20 px-3 py-2">
                  <code className="text-xs font-mono text-foreground/70 block">STRIPE_SECRET_KEY=sk_test_...</code>
                  <code className="text-xs font-mono text-foreground/70 block">STRIPE_PUBLISHABLE_KEY=pk_test_...</code>
                </div>
              </div>
            </SubStep>
            <SubStep number={6}>
              Connect the MCP server:
              <div className="mt-2">
                <InlineCommand
                  command="claude mcp add stripe -- npx -y @stripe/mcp --tools=all --api-key=$STRIPE_SECRET_KEY"
                  note="Run after setting STRIPE_SECRET_KEY in your .env"
                />
              </div>
            </SubStep>
          </div>
        </AccordionStep>

        {/* ─── Step 4: Resend ───────────────────────────────── */}
        <AccordionStep
          number={4}
          title="Resend"
          description="Transactional emails. Works immediately — no custom domain needed for dev."
          isOpen={currentStep === 3}
          isDone={completedSteps.has(3)}
          onToggle={() => toggleStep(3)}
          onDone={() => markDone(3)}
        >
          <div className="space-y-3">
            <SubStep number={1}>
              <ExtLink href="https://resend.com">
                Create a free account
              </ExtLink>
            </SubStep>
            <SubStep number={2}>
              Go to{" "}
              <ExtLink href="https://resend.com/api-keys">
                API Keys &rarr; Create API Key
              </ExtLink>
            </SubStep>
            <SubStep number={3}>
              Copy your API key &mdash;{" "}
              <EnvVar name="RESEND_API_KEY" hint="starts with re_" />
            </SubStep>
            <SubStep number={4}>
              Add to{" "}
              <code className="text-xs font-mono bg-muted/60 px-1.5 py-0.5 rounded">
                webapp/.env
              </code>
              <div className="mt-2">
                <div className="rounded border bg-muted/20 px-3 py-2">
                  <code className="text-xs font-mono text-foreground/70">RESEND_API_KEY=re_...</code>
                </div>
              </div>
            </SubStep>
            <SubStep number={5}>
              Also add it to{" "}
              <code className="text-xs font-mono bg-muted/60 px-1.5 py-0.5 rounded">
                supabase/functions/.env
              </code>{" "}
              (used by edge functions)
              <div className="mt-2">
                <div className="rounded border bg-muted/20 px-3 py-2">
                  <code className="text-xs font-mono text-foreground/70">RESEND_API_KEY=re_...</code>
                </div>
              </div>
            </SubStep>
          </div>

          <InfoBox>
            Emails send from{" "}
            <code className="text-xs font-mono">onboarding@resend.dev</code>{" "}
            in dev mode. Add your own domain later for production.
          </InfoBox>
        </AccordionStep>

        {/* ─── Step 5: Context7 ─────────────────────────────── */}
        <AccordionStep
          number={5}
          title="Context7"
          description="Gives Claude access to live library documentation. No account needed."
          isOpen={currentStep === 4}
          isDone={completedSteps.has(4)}
          onToggle={() => toggleStep(4)}
          onDone={() => markDone(4)}
        >
          <InlineCommand command="claude mcp add context7 -- npx -y @upstash/context7-mcp" />

          <InfoBox>
            Context7 fetches real-time docs for any library so Claude always
            has up-to-date API references. No signup or API key required.
          </InfoBox>
        </AccordionStep>

        {/* ─── Step 6: Jina AI ──────────────────────────────── */}
        <AccordionStep
          number={6}
          title="Jina AI"
          description="Web search, URL reading, and research capabilities for Claude."
          isOpen={currentStep === 5}
          isDone={completedSteps.has(5)}
          onToggle={() => toggleStep(5)}
          onDone={() => markDone(5)}
        >
          <div className="space-y-3">
            <SubStep number={1}>
              <ExtLink href="https://jina.ai">
                Create a free account
              </ExtLink>
            </SubStep>
            <SubStep number={2}>
              Get your API key from the dashboard
            </SubStep>
            <SubStep number={3}>
              Connect the MCP server:
              <div className="mt-2">
                <InlineCommand command="claude mcp add jina -- npx -y @anthropic-ai/claude-code-jina-mcp@latest" />
              </div>
            </SubStep>
          </div>
        </AccordionStep>

        {/* ─── Step 7: Sentry (Optional) ────────────────────── */}
        <AccordionStep
          number={7}
          title="Sentry"
          description="Error tracking. Skip for development, add for production."
          optional
          isOpen={currentStep === 6}
          isDone={completedSteps.has(6)}
          onToggle={() => toggleStep(6)}
          onDone={() => markDone(6)}
        >
          <p className="text-sm text-muted-foreground">
            Skip for now, or expand below to set up.
          </p>

          <Collapsible open={sentryExpanded} onOpenChange={setSentryExpanded}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer gap-1.5 text-xs"
              >
                <ChevronRight
                  className={`size-3.5 transition-transform duration-200 ${
                    sentryExpanded ? "rotate-90" : ""
                  }`}
                />
                Set up Sentry
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-3 rounded-lg border bg-muted/10 p-4">
                <SubStep number={1}>
                  <ExtLink href="https://sentry.io">
                    Create a Sentry account
                  </ExtLink>
                </SubStep>
                <SubStep number={2}>
                  Go to{" "}
                  <ExtLink href="https://sentry.io/settings/auth-tokens/">
                    Settings &rarr; Auth Tokens
                  </ExtLink>{" "}
                  and create a token
                </SubStep>
                <SubStep number={3}>
                  Add{" "}
                  <EnvVar
                    name="SENTRY_AUTH_TOKEN"
                    hint="starts with sntrys_"
                  />{" "}
                  to{" "}
                  <code className="text-xs font-mono bg-muted/60 px-1.5 py-0.5 rounded">
                    webapp/.env
                  </code>
                </SubStep>
                <SubStep number={4}>
                  Connect the MCP server:
                  <div className="mt-2">
                    <InlineCommand command="claude mcp add --transport http sentry https://mcp.sentry.dev/mcp" />
                  </div>
                </SubStep>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </AccordionStep>

        {/* ─── Step 8: Turnstile (Optional) ─────────────────── */}
        <AccordionStep
          number={8}
          title="Cloudflare Turnstile"
          description="Bot protection. A test key is pre-filled for development."
          optional
          isOpen={currentStep === 7}
          isDone={completedSteps.has(7)}
          onToggle={() => toggleStep(7)}
          onDone={() => markDone(7)}
        >
          <div className="rounded-lg border bg-muted/20 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Pre-configured
            </p>
            <code className="text-xs font-mono text-foreground/70 break-all">
              NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
            </code>
          </div>

          <InfoBox>
            The test key above works for development. Replace with a real key
            from{" "}
            <ExtLink href="https://dash.cloudflare.com">
              dash.cloudflare.com
            </ExtLink>{" "}
            for production.
          </InfoBox>
        </AccordionStep>

        {/* ─── Step 9: Run Setup ────────────────────────────── */}
        <AccordionStep
          number={9}
          title="Run Setup"
          description="Open Claude Code in your project directory and run the setup command."
          isOpen={currentStep === 8}
          isDone={completedSteps.has(8)}
          onToggle={() => toggleStep(8)}
          onDone={() => markDone(8)}
        >
          <InlineCommand command="claude /setup" />

          {/* What /setup automates */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer gap-1.5 text-xs text-muted-foreground hover:text-foreground -ml-2"
              >
                <Zap className="size-3.5" />
                What does /setup automate?
                <ChevronDown className="size-3.5" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="rounded-lg border bg-muted/10 p-4">
                <ul className="space-y-2 text-sm text-foreground/80">
                  {[
                    "Check system requirements",
                    "Install dependencies",
                    "Create Supabase project via MCP",
                    "Get API URL + keys \u2192 write to .env",
                    "Run base migrations (profiles, credits, auth hook)",
                    "Run billing migrations (Stripe customer resolver, credit functions)",
                    "Enable extensions (pg_cron, pgcrypto)",
                    "Deploy edge functions (send-email, stripe-checkout, stripe-portal, stripe-upgrade)",
                    "Set edge function secrets",
                    "Create Stripe products and prices",
                    "Create test user (test@example.dev)",
                    "Generate TypeScript types",
                    "Verify dev server",
                    "Run type check",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5"
                    >
                      <ChevronRight className="size-3.5 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </AccordionStep>
      </div>

      {/* ─── Completion Banner ──────────────────────────────── */}
      <div className="mt-8">
        {allDone ? (
          <Card className="border-emerald-500/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5" />
            <CardContent className="relative flex flex-col items-center gap-3 py-8 text-center sm:flex-row sm:gap-5 sm:py-6 sm:text-left">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                <Sparkles className="size-6 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-semibold text-foreground">
                  You&apos;re all set!
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Open Claude Code and run{" "}
                  <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                    /setup
                  </code>{" "}
                  to complete the automated setup.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center sm:flex-row sm:gap-4 sm:py-6 sm:text-left">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <Terminal className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Complete the steps above, then run /setup
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Required: Stripe and Resend API keys. Supabase is handled
                  automatically by the MCP.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ─── Quick Links ──────────────────────────────────── */}
      <section className="border-t mt-12 pt-8">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Quick Links
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              label: "Supabase Dashboard",
              href: "https://supabase.com/dashboard",
            },
            {
              label: "Stripe Dashboard",
              href: "https://dashboard.stripe.com/test",
            },
            {
              label: "Resend Dashboard",
              href: "https://resend.com",
            },
            {
              label: "Claude Code Docs",
              href: "https://docs.anthropic.com/en/docs/claude-code",
            },
            {
              label: "Jina AI",
              href: "https://jina.ai",
            },
            {
              label: "Sentry Dashboard",
              href: "https://sentry.io",
            },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors duration-200 cursor-pointer"
            >
              {link.label}
              <ExternalLink className="size-3 ml-auto shrink-0" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
