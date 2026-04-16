"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import {
  AnimatedList,
  AnimatedListItem,
} from "@/components/ui/animated-list";
import {
  Lightbulb,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Circle,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Card 1: Idea Feed ── */

const ideas = [
  { title: "AI Resume Builder", market: "$4.2B", score: 92, trend: "up" as const },
  { title: "Pet Health Tracker", market: "$1.8B", score: 78, trend: "up" as const },
  { title: "Invoice Automation", market: "$2.1B", score: 85, trend: "up" as const },
  { title: "Micro-SaaS Analytics", market: "$6.7B", score: 94, trend: "up" as const },
  { title: "AI Meal Planner", market: "$3.4B", score: 81, trend: "down" as const },
];

function IdeaFeedDemo() {
  return (
    <AnimatedList delay={2500} className="h-full p-3 gap-2">
      {ideas.map((idea) => (
        <AnimatedListItem key={idea.title}>
          <div className="w-full rounded-xl border border-border bg-card p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {idea.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] text-muted-foreground">
                    TAM {idea.market}
                  </span>
                  <span className="text-[9px] text-muted-foreground">&middot;</span>
                  <span className={cn("text-[9px] font-medium", idea.score >= 85 ? "text-success" : "text-warning")}>
                    Score: {idea.score}
                  </span>
                </div>
              </div>
              {idea.trend === "up" ? (
                <TrendingUp className="h-3.5 w-3.5 text-success" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              )}
            </div>
          </div>
        </AnimatedListItem>
      ))}
    </AnimatedList>
  );
}

/* ── Card 2: Analytics Dashboard ── */

const metrics = [
  { label: "Google Trends", value: "+340%", change: "+12%", positive: true },
  { label: "Reddit Buzz", value: "87%", change: "+5%", positive: true },
  { label: "Keyword Vol.", value: "12K/mo", change: "-2%", positive: false },
  { label: "Competition", value: "Low", change: "", positive: true },
];

function MarketDataDemo() {
  return (
    <div className="h-full flex flex-col p-3 gap-3">
      {/* Metrics grid */}
      <div className="grid grid-cols-4 gap-2">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg border border-border bg-card p-2 text-center">
            <p className="text-[9px] text-muted-foreground truncate">{m.label}</p>
            <p className="text-sm font-bold text-foreground mt-0.5">{m.value}</p>
            {m.change && (
              <p className={cn("text-[8px] font-medium mt-0.5", m.positive ? "text-success" : "text-destructive")}>
                {m.change}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 rounded-lg border border-border bg-muted/30 p-2 flex flex-col justify-end">
        <div className="flex items-end gap-1 h-full">
          {[35, 45, 30, 55, 70, 60, 80, 75, 90, 85, 95, 92].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-primary/20" style={{ height: `${h}%` }}>
              <div className="w-full rounded-t-sm bg-primary/60" style={{ height: `${Math.min(100, h + 10)}%` }} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[7px] text-muted-foreground">Jan</span>
          <span className="text-[7px] text-muted-foreground">Jun</span>
          <span className="text-[7px] text-muted-foreground">Dec</span>
        </div>
      </div>
    </div>
  );
}

/* ── Card 3: Build Plan ── */

const tasks = [
  { task: "Set up Next.js + Supabase", time: "1h", done: true },
  { task: "Build auth flow (login/signup)", time: "2h", done: true },
  { task: "Create main dashboard", time: "3h", done: true },
  { task: "Add Stripe checkout", time: "2h", done: false },
  { task: "Deploy to Vercel", time: "30m", done: false },
];

function BuildPlanDemo() {
  const doneCount = tasks.filter((t) => t.done).length;
  const progress = Math.round((doneCount / tasks.length) * 100);

  return (
    <div className="h-full flex flex-col p-4 justify-center">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-[10px] font-bold text-primary">{progress}%</span>
      </div>

      <div className="space-y-2.5">
        {tasks.map((t, i) => (
          <div key={i} className="flex items-center gap-3">
            {t.done ? (
              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-border flex-shrink-0" />
            )}
            <span className={cn("text-xs flex-1", t.done ? "text-muted-foreground line-through" : "text-foreground")}>
              {t.task}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground bg-muted rounded px-1.5 py-0.5">
              {t.time}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">~8.5h of 48h</span>
        <span className="text-[10px] font-medium text-success">On track</span>
      </div>
    </div>
  );
}

/* ── Card 4: Terminal ── */

function TerminalDemo() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex-1 bg-foreground dark:bg-[#0a0a0a] rounded-b-2xl font-mono text-[11px] leading-relaxed">
        <p className="text-primary-foreground/60 dark:text-muted-foreground">
          <span className="text-success">~</span>{" "}
          <span className="text-primary">$</span> npx create-btn-app my-saas
        </p>
        <p className="text-primary-foreground/40 dark:text-muted-foreground/50 mt-1">
          Cloning starter template...
        </p>
        <div className="mt-2 space-y-0.5">
          {["Next.js 16", "Supabase Auth + DB", "Stripe Billing", "Tailwind v4", "Vercel Deploy"].map((name) => (
            <p key={name} className="flex items-center gap-2">
              <span className="text-success">&#10003;</span>
              <span className="text-primary-foreground/70 dark:text-muted-foreground">{name}</span>
            </p>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t border-primary-foreground/10 dark:border-muted-foreground/10">
          <p className="text-success font-medium flex items-center gap-1.5">
            Ready to build! <ArrowUpRight className="h-3 w-3" />
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {["React", "Postgres", "Edge Fn", "Webhooks"].map((tag) => (
            <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded bg-primary-foreground/10 dark:bg-muted-foreground/10 text-primary-foreground/50 dark:text-muted-foreground/50">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Grid ── */

const features = [
  { name: "Daily Ideas", className: "col-span-3 lg:col-span-1", demo: <IdeaFeedDemo /> },
  { name: "Market Intel", className: "col-span-3 lg:col-span-2", demo: <MarketDataDemo /> },
  { name: "Build Plans", className: "col-span-3 lg:col-span-2", demo: <BuildPlanDemo /> },
  { name: "Starter Repos", className: "col-span-3 lg:col-span-1", demo: <TerminalDemo /> },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 sm:py-28 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade delay={0.1} inView>
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.25em] mb-4">
              Everything you need
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              From Idea to Revenue
            </h2>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <div className="grid w-full auto-rows-[22rem] grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.name}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-2xl",
                  "bg-background border border-border/60",
                  // Layered shadow: ring + depth + ambient
                  "shadow-[0_0_0_1px_rgba(0,0,0,.02),0_1px_2px_rgba(0,0,0,.04),0_8px_24px_-4px_rgba(0,0,0,.08),0_24px_48px_-12px_rgba(0,0,0,.06)]",
                  // Dark mode: inner glow + subtle border
                  "dark:bg-background dark:border-white/[0.08] dark:shadow-[0_-20px_80px_-20px_rgba(255,255,255,.06)_inset,0_8px_32px_-8px_rgba(0,0,0,.5)]",
                  // Hover: lift + primary glow
                  "transition-all duration-300 hover:-translate-y-1.5",
                  "hover:shadow-[0_0_0_1px_rgba(0,0,0,.02),0_4px_8px_rgba(0,0,0,.06),0_16px_32px_-4px_rgba(0,0,0,.10),0_0_40px_-8px_oklch(0.67_0.16_245_/_0.12)]",
                  "dark:hover:shadow-[0_-20px_80px_-20px_rgba(255,255,255,.08)_inset,0_16px_48px_-8px_rgba(0,0,0,.6),0_0_40px_-8px_oklch(0.67_0.16_245_/_0.15)]",
                  feature.className
                )}
              >
                {/* Gradient top accent */}
                <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                {/* Inner top highlight */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/[0.03] to-transparent pointer-events-none" />

                {/* Bold name only */}
                <div className="relative px-5 pt-4">
                  <span className="text-sm font-bold text-foreground">
                    {feature.name}
                  </span>
                </div>
                {/* Demo fills the card */}
                <div className="relative flex-1 min-h-0">{feature.demo}</div>
              </div>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
