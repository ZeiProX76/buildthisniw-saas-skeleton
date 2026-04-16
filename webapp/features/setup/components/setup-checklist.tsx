"use client";

import { useState, useCallback, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Circle,
  ExternalLink,
  Copy,
  RefreshCw,
  Database,
  CreditCard,
  Mail,
  Shield,
  Bug,
  Loader2,
  Check,
  Sparkles,
  Terminal,
  BookOpen,
  Globe,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// ─── Types ───────────────────────────────────────────────────────────

type CheckStatus = "pass" | "fail" | "warn" | "unchecked";

interface SystemCheckItem {
  id: string;
  label: string;
  required: boolean;
  status: CheckStatus;
  version?: string;
  message?: string;
  hint?: string;
}

interface CheckItem {
  id: string;
  label: string;
  group: string;
  status: CheckStatus;
  message?: string;
  hint?: string;
}

type BadgeType = "REQUIRED" | "OPTIONAL";

// ─── Service Group Configuration ─────────────────────────────────────

interface GroupConfig {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: BadgeType;
  dashboardUrl?: string;
  dashboardLabel?: string;
}

const SERVICE_GROUPS: GroupConfig[] = [
  {
    key: "supabase",
    label: "Supabase",
    description: "Database, auth, and real-time",
    icon: Database,
    badge: "REQUIRED",
    dashboardUrl: "https://supabase.com/dashboard/project/_/settings/api",
    dashboardLabel: "Dashboard",
  },
  {
    key: "stripe",
    label: "Stripe",
    description: "Payments and billing",
    icon: CreditCard,
    badge: "REQUIRED",
    dashboardUrl: "https://dashboard.stripe.com/test/apikeys",
    dashboardLabel: "Dashboard",
  },
  {
    key: "resend",
    label: "Resend",
    description: "Transactional emails",
    icon: Mail,
    badge: "REQUIRED",
    dashboardUrl: "https://resend.com/api-keys",
    dashboardLabel: "Dashboard",
  },
  {
    key: "sentry",
    label: "Sentry",
    description: "Error tracking and monitoring",
    icon: Bug,
    badge: "OPTIONAL",
    dashboardUrl: "https://sentry.io/settings/auth-tokens/",
    dashboardLabel: "Dashboard",
  },
  {
    key: "turnstile",
    label: "Cloudflare Turnstile",
    description: "Bot protection",
    icon: Shield,
    badge: "OPTIONAL",
    dashboardUrl: "https://dash.cloudflare.com/?to=/:account/turnstile",
    dashboardLabel: "Dashboard",
  },
];

// ─── Env Template ────────────────────────────────────────────────────

const ENV_TEMPLATE = `# Supabase
# https://supabase.com/dashboard > Your Project > Settings > API
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# Stripe
# https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key

# Resend
# https://resend.com/api-keys
RESEND_API_KEY=re_your-api-key

# Turnstile (optional - use test key for dev)
# https://dash.cloudflare.com/?to=/:account/turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA

# Sentry (optional - for error tracking)
# https://sentry.io > Settings > Auth Tokens
# SENTRY_AUTH_TOKEN=your-sentry-auth-token`;

// ─── Badge Styles ────────────────────────────────────────────────────

const BADGE_STYLES: Record<BadgeType, string> = {
  REQUIRED: "bg-primary/10 text-primary border-primary/20",
  OPTIONAL: "bg-muted text-muted-foreground border-border",
};

// ─── Status Icon ─────────────────────────────────────────────────────

function StatusIcon({
  status,
  loading,
}: {
  status: CheckStatus;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex size-5 items-center justify-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  switch (status) {
    case "pass":
      return <CheckCircle2 className="size-5 text-success" />;
    case "fail":
      return <XCircle className="size-5 text-destructive" />;
    case "warn":
      return <AlertCircle className="size-5 text-warning" />;
    default:
      return <Circle className="size-4 text-muted-foreground/50" />;
  }
}

// ─── Check Row ───────────────────────────────────────────────────────

function CheckRow({
  check,
  loading,
}: {
  check: CheckItem;
  loading: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5 shrink-0">
        <StatusIcon status={check.status} loading={loading} />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-sm font-medium text-foreground">
          {check.label}
        </span>
        {check.message && !loading && (
          <p
            className={`text-xs mt-0.5 ${
              check.status === "fail"
                ? "text-destructive"
                : check.status === "warn"
                  ? "text-warning"
                  : "text-muted-foreground"
            }`}
          >
            {check.message}
          </p>
        )}
        {check.hint && !loading && check.status === "fail" && (
          <p className="text-xs text-muted-foreground mt-0.5">{check.hint}</p>
        )}
      </div>
    </div>
  );
}

// ─── Service Group Card ──────────────────────────────────────────────

function groupStatus(checks: CheckItem[]): CheckStatus {
  if (checks.some((c) => c.status === "fail")) return "fail";
  if (checks.some((c) => c.status === "warn")) return "warn";
  if (checks.every((c) => c.status === "pass")) return "pass";
  return "unchecked";
}

function ServiceGroupCard({
  group,
  checks,
  loading,
}: {
  group: GroupConfig;
  checks: CheckItem[];
  loading: boolean;
}) {
  const Icon = group.icon;
  const status = loading ? "unchecked" : groupStatus(checks);
  const passCount = checks.filter((c) => c.status === "pass").length;

  const borderClass =
    status === "pass"
      ? "border-success/40"
      : status === "fail"
        ? "border-destructive/40"
        : "border-border";

  return (
    <div
      className={`rounded-lg border p-4 transition-colors duration-300 ${borderClass}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-md ${
            status === "pass"
              ? "bg-success/15 text-success"
              : status === "fail"
                ? "bg-destructive/15 text-destructive"
                : "bg-accent text-muted-foreground"
          }`}
        >
          <Icon className="size-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">
              {group.label}
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 ${BADGE_STYLES[group.badge]}`}
            >
              {group.badge}
            </Badge>
            {!loading && (
              <span className="text-xs text-muted-foreground ml-auto">
                {passCount}/{checks.length}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{group.description}</p>
        </div>
        {group.dashboardUrl && (
          <a
            href={group.dashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 shrink-0"
          >
            <ExternalLink className="size-3" />
            <span className="hidden sm:inline">{group.dashboardLabel}</span>
          </a>
        )}
      </div>
      <div className="space-y-0.5 ml-11">
        {checks.map((check) => (
          <CheckRow key={check.id} check={check} loading={loading} />
        ))}
      </div>
    </div>
  );
}

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

// ─── Code Block with Copy ────────────────────────────────────────────

function CodeBlock({ code, className }: { code: string; className?: string }) {
  return (
    <div className={`group relative rounded-lg border bg-muted/30 ${className ?? ""}`}>
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <CopyButton text={code} />
      </div>
      <pre className="p-4 pr-20 overflow-x-auto text-[13px] leading-relaxed font-mono text-foreground/80">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Step Header ─────────────────────────────────────────────────────

function StepHeader({
  number,
  title,
  description,
  done,
}: {
  number: number;
  title: string;
  description: string;
  done?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
          done
            ? "bg-success text-success-foreground"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {done ? <Check className="size-4" /> : number}
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export function SetupChecklist() {
  const [systemChecks, setSystemChecks] = useState<SystemCheckItem[]>([]);
  const [checks, setChecks] = useState<CheckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [envOpen, setEnvOpen] = useState(false);

  const runChecks = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch("/api/setup/check", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSystemChecks(data.system ?? []);
      setChecks(data.checks ?? []);
    } catch {
      setSystemChecks([]);
      setChecks([
        { id: "supabase-url", label: "Supabase URL", group: "supabase", status: "unchecked", message: "Check API not available" },
        { id: "supabase-key", label: "Supabase Key", group: "supabase", status: "unchecked", message: "Check API not available" },
        { id: "stripe-secret", label: "Stripe Secret Key", group: "stripe", status: "unchecked", message: "Check API not available" },
        { id: "stripe-public", label: "Stripe Publishable Key", group: "stripe", status: "unchecked", message: "Check API not available" },
        { id: "resend", label: "Resend API Key", group: "resend", status: "unchecked", message: "Check API not available" },
        { id: "turnstile", label: "Turnstile Site Key", group: "turnstile", status: "unchecked", message: "Check API not available" },
        { id: "sentry", label: "Sentry Auth Token", group: "sentry", status: "unchecked", message: "Check API not available" },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    runChecks(false);
  }, [runChecks]);

  // Stats
  const requiredGroups = new Set(["supabase", "stripe", "resend"]);
  const requiredChecks = checks.filter((c) => requiredGroups.has(c.group));
  const requiredPassing = requiredChecks.filter(
    (c) => c.status === "pass"
  ).length;
  const totalRequired = requiredChecks.length;
  const allRequiredPassing =
    totalRequired > 0 && requiredPassing === totalRequired;
  const progressPercent =
    totalRequired > 0 ? Math.round((requiredPassing / totalRequired) * 100) : 0;

  // Group checks by service
  const groupedChecks = SERVICE_GROUPS.map((group) => ({
    group,
    checks: checks.filter((c) => c.group === group.key),
  })).filter((g) => g.checks.length > 0);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Project Setup
        </h1>
        <p className="mt-2 text-base text-muted-foreground max-w-lg">
          Configure your services and you&apos;re ready to build.
        </p>

        {/* Progress */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              {loading
                ? "Checking..."
                : `${requiredPassing} of ${totalRequired} required checks passing`}
            </span>
            {!loading && (
              <span
                className={`text-xs font-medium tabular-nums ${
                  allRequiredPassing
                    ? "text-success"
                    : progressPercent > 50
                      ? "text-warning"
                      : "text-muted-foreground"
                }`}
              >
                {progressPercent}%
              </span>
            )}
          </div>
          <Progress
            value={loading ? 0 : progressPercent}
            className={`h-2 transition-all duration-500 ${
              allRequiredPassing
                ? "[&>[data-slot=progress-indicator]]:bg-success"
                : ""
            }`}
          />
        </div>
      </div>

      <div className="space-y-12">
        {/* ─── System Requirements ──────────────────────────────── */}
        {systemChecks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="size-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                System Requirements
              </h3>
              {!loading &&
                systemChecks.every((s) => s.status === "pass") && (
                  <CheckCircle2 className="size-4 text-success ml-auto" />
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {systemChecks.map((sc) => (
                <div
                  key={sc.id}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    sc.status === "pass"
                      ? "border-success/30 bg-success/5"
                      : sc.status === "fail"
                        ? "border-destructive/30 bg-destructive/5"
                        : "border-border"
                  }`}
                >
                  <StatusIcon status={sc.status} loading={loading} />
                  <span className="font-medium">{sc.label}</span>
                  <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                    {sc.message ?? ""}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Step 1: Install Claude Code ──────────────────────── */}
        <section>
          <StepHeader
            number={1}
            title="Install Claude Code"
            description="Install Claude Code globally if you haven't already."
          />
          <CodeBlock code="npm install -g @anthropic-ai/claude-code" />
        </section>

        {/* ─── Step 2: Environment Variables ────────────────────── */}
        <section>
          <StepHeader
            number={2}
            title="Environment Variables"
            description="Create a .env file in the webapp/ directory with your API keys."
            done={allRequiredPassing}
          />

          {/* Env template (collapsible) */}
          <Collapsible open={envOpen} onOpenChange={setEnvOpen}>
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer gap-1.5 text-xs"
                  >
                    <ChevronDown
                      className={`size-3.5 transition-transform ${envOpen ? "rotate-180" : ""}`}
                    />
                    .env template
                  </Button>
                </CollapsibleTrigger>
                <CopyButton text={ENV_TEMPLATE} label="Copy template" />
              </div>
            </div>
            <CollapsibleContent>
              <CodeBlock code={ENV_TEMPLATE} className="mb-5" />
            </CollapsibleContent>
          </Collapsible>

          {/* Check results */}
          <div className="space-y-3">
            {groupedChecks.map(({ group, checks: groupChecks }) => (
              <ServiceGroupCard
                key={group.key}
                group={group}
                checks={groupChecks}
                loading={loading || refreshing}
              />
            ))}
          </div>

          {/* Re-check */}
          <div className="mt-4 flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => runChecks(true)}
              disabled={loading || refreshing}
              className="cursor-pointer gap-1.5"
            >
              <RefreshCw
                className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              Re-check
            </Button>
            <p className="text-xs text-muted-foreground">
              Restart the dev server after updating .env if checks
              don&apos;t update.
            </p>
          </div>
        </section>

        {/* ─── Step 3: Start Building ───────────────────────────── */}
        <section>
          <StepHeader
            number={3}
            title="Start Building"
            description="Open the project in Claude Code and run /setup to verify everything."
          />

          <CodeBlock code={`cd your-project\nclaude`} className="mb-5" />

          {allRequiredPassing ? (
            <Card className="border-success/40 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-success/5" />
              <CardContent className="relative flex flex-col items-center gap-3 py-8 text-center sm:flex-row sm:gap-5 sm:py-6 sm:text-left">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-success/15">
                  <Sparkles className="size-6 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-foreground">
                    You&apos;re all set!
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    All required services are configured. Open Claude Code and
                    start building.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex items-center gap-4 py-6">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                  <ArrowRight className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Complete the required checks above
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Configure Supabase, Stripe, and Resend to get started.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* ─── Quick Links ──────────────────────────────────────── */}
        <section className="border-t pt-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Quick Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: Database,
                label: "Supabase Dashboard",
                href: "https://supabase.com/dashboard",
              },
              {
                icon: CreditCard,
                label: "Stripe Dashboard",
                href: "https://dashboard.stripe.com/test",
              },
              {
                icon: Mail,
                label: "Resend Dashboard",
                href: "https://resend.com",
              },
              {
                icon: BookOpen,
                label: "Claude Code Docs",
                href: "https://docs.anthropic.com/en/docs/claude-code",
              },
              {
                icon: Globe,
                label: "Context7 Docs",
                href: "https://context7.com",
              },
              {
                icon: Bug,
                label: "Sentry Dashboard",
                href: "https://sentry.io",
              },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                <link.icon className="size-4 shrink-0" />
                {link.label}
                <ExternalLink className="size-3 ml-auto shrink-0" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
