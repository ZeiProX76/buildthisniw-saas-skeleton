import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import {
  ArrowRight,
  LayoutDashboard,
  Lightbulb,
  Map,
  Code2,
  Users,
  Settings,
  CheckCircle2,
  Circle,
  TrendingUp,
  BarChart3,
  Globe,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Sidebar nav items ── */
const sidebarNav = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Lightbulb, label: "Ideas", active: false },
  { icon: Map, label: "Build Plans", active: false },
  { icon: Code2, label: "Templates", active: false },
  { icon: Users, label: "Community", active: false },
  { icon: Settings, label: "Settings", active: false },
];

/* ── Build plan tasks ── */
const buildTasks = [
  { task: "Set up Next.js + Supabase", time: "1h", done: true },
  { task: "Build auth flow (login/signup)", time: "2h", done: true },
  { task: "Create main dashboard UI", time: "3h", done: true },
  { task: "Add Stripe checkout", time: "2h", done: false },
  { task: "Deploy to Vercel", time: "30m", done: false },
];

/* ── Market signals ── */
const marketSignals = [
  { icon: TrendingUp, label: "Google Trends", value: "+340%", positive: true },
  { icon: BarChart3, label: "Search Volume", value: "12K/mo", positive: true },
  { icon: Globe, label: "Reddit Buzz", value: "87%", positive: true },
  { icon: MessageSquare, label: "Competition", value: "Low", positive: true },
];

export function Hero() {
  const doneCount = buildTasks.filter((t) => t.done).length;
  const progress = Math.round((doneCount / buildTasks.length) * 100);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

      {/* Animated grid */}
      <AnimatedGridPattern
        className="absolute inset-0 opacity-40 dark:opacity-20 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        numSquares={30}
        maxOpacity={0.3}
        duration={3}
        repeatDelay={1}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <BlurFade delay={0.1}>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-sm px-4 py-1.5 mb-8 shadow-md shadow-primary/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              New ideas drop every morning at 8 AM
            </span>
          </div>
        </BlurFade>

        <BlurFade delay={0.2}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            Ship Your Next MVP
            <br />
            <span className="bg-[linear-gradient(180deg,oklch(0.75_0.14_245)_0%,var(--primary)_60%,oklch(0.55_0.16_245)_100%)] bg-clip-text text-transparent">in 48 Hours</span>
          </h1>
        </BlurFade>

        <BlurFade delay={0.35}>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A validated idea, market research, and a step-by-step build plan — delivered to you every morning.
          </p>
        </BlurFade>

        <BlurFade delay={0.5}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8 h-12">
              Get Today&apos;s Idea
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              See How It Works
            </Button>
          </div>
        </BlurFade>
      </div>

      {/* Product screenshot */}
      <BlurFade delay={0.6} className="relative z-10 mt-16 mb-10 sm:mb-16 w-full max-w-6xl mx-auto px-4 sm:px-6">
        {/* Gradient glow behind top edge */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary/20 rounded-full blur-3xl" />

        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 ring-1 ring-border">
          {/* Top gradient border accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          <div className="bg-card">
            {/* Browser chrome */}
            <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
                <div className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-muted rounded-lg px-4 py-1 text-[11px] text-muted-foreground font-mono">
                  buildthisnow.com/dashboard
                </div>
              </div>
            </div>

            {/* App layout: sidebar + main */}
            <div className="flex">
              {/* Sidebar — hidden on mobile */}
              <div className="hidden sm:flex w-48 lg:w-52 border-r border-border flex-col bg-background/50 p-3">
                {/* Logo */}
                <div className="flex items-center gap-2 px-2 py-2 mb-3">
                  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <polygon points="16,4 27,10 16,16 5,10" fill="#8EC5FF" />
                    <polygon points="5,10 16,16 16,28 5,22" fill="#4490F0" />
                    <polygon points="27,10 16,16 16,28 27,22" fill="#2566C5" />
                  </svg>
                  <span className="text-xs font-bold text-foreground">Build This Now</span>
                </div>

                {/* Nav */}
                <nav className="space-y-0.5 flex-1">
                  {sidebarNav.map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors",
                        item.active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {item.label}
                    </div>
                  ))}
                </nav>

                {/* User */}
                <div className="flex items-center gap-2 px-2 py-2 mt-2 border-t border-border">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-purple-300 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">HG</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-foreground truncate">Hugues G.</p>
                    <p className="text-[8px] text-muted-foreground">Pro Plan</p>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="p-3 sm:p-6">
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[10px] text-muted-foreground">Wednesday, Feb 26</p>
                      <p className="text-base font-bold text-foreground mt-0.5">
                        Good morning, Builder
                      </p>
                    </div>
                    <Button size="sm" className="h-7 text-[11px] px-3">
                      Build This Now
                      <ArrowRight className="ml-1.5 h-3 w-3" />
                    </Button>
                  </div>

                  {/* Main idea card */}
                  <div className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-[9px] font-medium text-primary uppercase tracking-widest">
                          Today&apos;s Idea
                        </p>
                        <h3 className="text-lg font-bold text-foreground mt-0.5">
                          AI Resume Builder for Gen Z
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          TikTok-style resume builder with AI optimization. 14M potential users.
                        </p>
                      </div>
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                        $2.4B TAM
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {["Next.js", "Supabase", "Stripe", "OpenAI"].map((t) => (
                        <span
                          key={t}
                          className="text-[9px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2.5 mt-3">
                    {[
                      { label: "Market Score", value: "92", suffix: "/100" },
                      { label: "Build Time", value: "48", suffix: "h" },
                      { label: "Competition", value: "Low", suffix: "" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="rounded-lg border border-border bg-background p-2.5 text-center"
                      >
                        <p className="text-lg font-bold text-foreground">
                          {s.value}
                          <span className="text-[10px] font-normal text-muted-foreground">
                            {s.suffix}
                          </span>
                        </p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Two-column: Build Plan + Market Signals */}
                  <div className="hidden sm:grid grid-cols-2 gap-3 mt-3">
                    {/* Build Plan */}
                    <div className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-semibold text-foreground uppercase tracking-wide">48h Build Plan</p>
                        <span className="text-[9px] font-bold text-primary">{progress}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-muted mb-3 overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="space-y-2">
                        {buildTasks.map((t) => (
                          <div key={t.task} className="flex items-center gap-2">
                            {t.done ? (
                              <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />
                            ) : (
                              <Circle className="h-3 w-3 text-border flex-shrink-0" />
                            )}
                            <span className={cn("text-[10px] flex-1", t.done ? "text-muted-foreground line-through" : "text-foreground")}>
                              {t.task}
                            </span>
                            <span className="text-[8px] font-mono text-muted-foreground bg-muted rounded px-1 py-0.5">
                              {t.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Market Signals */}
                    <div className="rounded-xl border border-border bg-background p-4">
                      <p className="text-[10px] font-semibold text-foreground uppercase tracking-wide mb-3">Market Signals</p>
                      <div className="space-y-2.5">
                        {marketSignals.map((s) => (
                          <div key={s.label} className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <s.icon className="h-3 w-3 text-primary" />
                            </div>
                            <span className="text-[10px] text-muted-foreground flex-1">{s.label}</span>
                            <span className={cn("text-[10px] font-bold", s.positive ? "text-success" : "text-destructive")}>
                              {s.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Mini chart */}
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-[8px] text-muted-foreground mb-1.5">Search trend (12mo)</p>
                        <div className="flex items-end gap-[3px] h-8">
                          {[20, 25, 22, 30, 35, 40, 38, 50, 55, 65, 72, 85].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-t-sm bg-primary/30"
                              style={{ height: `${h}%` }}
                            >
                              <div
                                className="w-full h-full rounded-t-sm bg-primary/60"
                                style={{ height: `${Math.min(100, h + 15)}%` }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom row: Recent ideas skeleton */}
                  <div className="hidden sm:block mt-3 rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-semibold text-foreground uppercase tracking-wide">Previous Ideas</p>
                      <span className="text-[9px] text-primary font-medium">View all →</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { name: "Pet Health Tracker", tam: "$1.8B", score: 78, days: "2d ago" },
                        { name: "Invoice Automation", tam: "$2.1B", score: 85, days: "3d ago" },
                        { name: "Micro-SaaS Analytics", tam: "$6.7B", score: 94, days: "4d ago" },
                      ].map((idea) => (
                        <div key={idea.name} className="rounded-lg border border-border p-2.5">
                          <div className="flex items-start justify-between">
                            <p className="text-[10px] font-semibold text-foreground">{idea.name}</p>
                            <span className="text-[8px] text-muted-foreground">{idea.days}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[8px] text-muted-foreground">TAM {idea.tam}</span>
                            <span className="text-[8px] text-muted-foreground">&middot;</span>
                            <span className={cn("text-[8px] font-medium", idea.score >= 85 ? "text-success" : "text-warning")}>
                              Score: {idea.score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
    </section>
  );
}
