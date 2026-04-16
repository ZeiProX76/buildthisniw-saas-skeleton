"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  AnimatedList,
  AnimatedListItem,
} from "@/components/ui/animated-list";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Circle,
  Globe,
  Users,
  DollarSign,
  FileText,
  Heart,
  Receipt,
  BarChart3,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────
   Brand Logo (local, matches icon.svg)
   ──────────────────────────────────────────── */

function BrandLogo({
  className,
  id = "ps",
}: {
  className?: string;
  id?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A5D0FF" />
          <stop offset="100%" stopColor="#7CB5FF" />
        </linearGradient>
        <linearGradient id={`${id}-left`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#5B9BFF" />
          <stop offset="100%" stopColor="#2D6FD6" />
        </linearGradient>
        <linearGradient id={`${id}-right`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1A4FA8" />
        </linearGradient>
      </defs>
      <polygon points="16,4 27,10 16,16 5,10" fill={`url(#${id}-top)`} />
      <polygon points="5,10 16,16 16,28 5,22" fill={`url(#${id}-left)`} />
      <polygon points="27,10 16,16 16,28 27,22" fill={`url(#${id}-right)`} />
    </svg>
  );
}

/* ────────────────────────────────────────────
   Feature data — no bullets, just text
   ──────────────────────────────────────────── */

const features = [
  {
    label: "Daily Ideas",
    title: "Validated Ideas with Deep Market Insights",
    desc: "Every morning at 8 AM, a fresh business idea lands in your dashboard — complete with TAM analysis, competition mapping, Google Trends data, and a monetization strategy. No more guessing what to build next.",
    imagePosition: "right" as const,
  },
  {
    label: "Documentation",
    title: "From Idea to Blueprint in Minutes",
    desc: "Pre-made documentation templates structure every feature, user story, and technical requirement. Start building with clarity — not confusion. Every architecture decision is already made for you.",
    imagePosition: "left" as const,
  },
  {
    label: "Build Plans",
    title: "48-Hour Sprint Blueprints",
    desc: "Step-by-step build plans broken into 2-hour sprint blocks. Every task mapped — from auth to payments to deployment. Follow the plan and ship a working MVP in a weekend.",
    imagePosition: "right" as const,
  },
  {
    label: "Launch",
    title: "Deploy and Start Earning",
    desc: "One-click deployment configs. Stripe pre-wired. Analytics baked in. Go from code to revenue in a single afternoon. Your MVP is live before Monday.",
    imagePosition: "left" as const,
  },
];

/* ────────────────────────────────────────────
   Mockup A — Ideas AnimatedList (scroll-triggered)
   ──────────────────────────────────────────── */

const ideas = [
  {
    name: "ResumeAI",
    title: "AI Resume Builder for Gen Z",
    tam: "$4.2B",
    score: 92,
    trend: "up" as const,
    tags: ["Next.js", "OpenAI"],
    icon: FileText,
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    iconColor: "text-white",
  },
  {
    name: "PawCheck",
    title: "Pet Health Tracker & Vet Connect",
    tam: "$1.8B",
    score: 78,
    trend: "up" as const,
    tags: ["React Native", "Supabase"],
    icon: Heart,
    iconBg: "bg-gradient-to-br from-rose-400 to-pink-600",
    iconColor: "text-white",
  },
  {
    name: "InvoiceFlow",
    title: "Invoice Automation for Freelancers",
    tam: "$2.1B",
    score: 85,
    trend: "up" as const,
    tags: ["Stripe", "PDF"],
    icon: Receipt,
    iconBg: "bg-gradient-to-br from-emerald-400 to-teal-600",
    iconColor: "text-white",
  },
  {
    name: "MetricHQ",
    title: "Micro-SaaS Analytics Dashboard",
    tam: "$6.7B",
    score: 94,
    trend: "up" as const,
    tags: ["Postgres", "Charts"],
    icon: BarChart3,
    iconBg: "bg-gradient-to-br from-blue-400 to-indigo-600",
    iconColor: "text-white",
  },
  {
    name: "MealGenie",
    title: "AI Meal Planner & Grocery List",
    tam: "$3.4B",
    score: 81,
    trend: "down" as const,
    tags: ["OpenAI", "Stripe"],
    icon: UtensilsCrossed,
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-600",
    iconColor: "text-white",
  },
];

function IdeasListMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-full rounded-2xl bg-muted overflow-hidden"
    >
      {visible && (
        <AnimatedList delay={2200} className="h-full p-4 gap-3">
          {ideas.map((idea) => {
            const Icon = idea.icon;
            return (
              <AnimatedListItem key={idea.title}>
                <div className="w-full rounded-xl border border-border bg-card p-3.5 shadow-sm">
                  <div className="flex items-center gap-3">
                    {/* Colored gradient icon */}
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm",
                        idea.iconBg
                      )}
                    >
                      <Icon className={cn("h-4 w-4", idea.iconColor)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {idea.name}
                        </p>
                        <span
                          className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded-full",
                            idea.score >= 85
                              ? "text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-400/10"
                              : "text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-400/10"
                          )}
                        >
                          {idea.score}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {idea.title}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      {idea.trend === "up" ? (
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                      )}
                      <span className="text-[9px] font-semibold text-muted-foreground">
                        {idea.tam}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {idea.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedListItem>
            );
          })}
        </AnimatedList>
      )}
      {/* Edge gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-muted to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-muted to-transparent" />
    </div>
  );
}

/* ────────────────────────────────────────────
   Mockup B — Blueprint Orbit (tech stack orbiting)
   ──────────────────────────────────────────── */

const blueprintLogos = {
  outer: [
    {
      angle: 0,
      src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/react-logo.png?width=28&format=auto",
      alt: "React",
    },
    {
      angle: 72,
      src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/nextjs-logo.png?width=28&format=auto",
      alt: "Next.js",
      imgClass: "dark:invert",
    },
    {
      angle: 144,
      src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/tailwind-logo.png?width=28&format=auto",
      alt: "Tailwind",
    },
    {
      angle: 216,
      src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/motion-logo.png?width=28&format=auto",
      alt: "Motion",
    },
    {
      angle: 288,
      src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/vite-logo.png?width=28&format=auto",
      alt: "Vite",
    },
  ],
  inner: [
    {
      angle: 60,
      src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/github-icon.png?width=28&format=auto",
      alt: "GitHub",
      imgClass: "dark:invert",
    },
    {
      angle: 180,
      src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/figma-icon.png?width=28&format=auto",
      alt: "Figma",
    },
    {
      angle: 300,
      src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/shadcn-logo.png?width=28&format=auto",
      alt: "shadcn",
      imgClass: "dark:invert",
    },
  ],
};

function BlueprintOrbitMockup() {
  return (
    <div className="relative h-full rounded-2xl bg-muted overflow-hidden flex items-center justify-center">
      <div className="relative flex size-72 flex-col items-center justify-center">
        {/* Outer ring */}
        <svg
          className="pointer-events-none absolute inset-0 size-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glow layer */}
          <circle
            cx="50%"
            cy="50%"
            fill="none"
            r="130"
            stroke="var(--foreground)"
            strokeOpacity="0.06"
            strokeWidth="6"
          />
          {/* Main ring */}
          <circle
            cx="50%"
            cy="50%"
            fill="none"
            r="130"
            stroke="var(--foreground)"
            strokeOpacity="0.15"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
        </svg>
        {blueprintLogos.outer.map((item) => (
          <div
            key={item.alt}
            className="animate-orbit absolute flex transform-gpu items-center justify-center rounded-full"
            style={
              {
                "--duration": 35,
                "--radius": 130,
                "--angle": item.angle,
              } as React.CSSProperties
            }
          >
            <span className="bg-card grid size-10 place-content-center overflow-hidden rounded-full border border-foreground/10 shadow-md">
              <img
                className={cn("size-6", item.imgClass)}
                alt={item.alt}
                src={item.src}
              />
            </span>
          </div>
        ))}

        {/* Inner ring */}
        <svg
          className="pointer-events-none absolute inset-0 size-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Glow layer */}
          <circle
            cx="50%"
            cy="50%"
            fill="none"
            r="75"
            stroke="var(--foreground)"
            strokeOpacity="0.06"
            strokeWidth="6"
          />
          {/* Main ring */}
          <circle
            cx="50%"
            cy="50%"
            fill="none"
            r="75"
            stroke="var(--foreground)"
            strokeOpacity="0.15"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
        </svg>
        {blueprintLogos.inner.map((item) => (
          <div
            key={item.alt}
            className="animate-orbit absolute flex transform-gpu items-center justify-center rounded-full"
            style={
              {
                "--duration": 25,
                "--radius": 75,
                "--angle": item.angle,
                animationDirection: "reverse",
              } as React.CSSProperties
            }
          >
            <span className="bg-card grid size-10 place-content-center overflow-hidden rounded-full border border-foreground/10 shadow-md">
              <img
                className={cn("size-6", item.imgClass)}
                alt={item.alt}
                src={item.src}
              />
            </span>
          </div>
        ))}

        {/* Pulse circles */}
        <svg
          className="absolute size-28"
          fill="none"
          viewBox="0 0 110 110"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="55"
            cy="55"
            r="45"
            stroke="var(--foreground)"
            strokeOpacity="0.12"
            strokeWidth="1.5"
            className="animate-pulse-circle"
            style={{
              transformOrigin: "50% 50%",
              transformBox: "fill-box" as const,
            }}
          />
          <circle
            cx="55"
            cy="55"
            r="30"
            stroke="var(--foreground)"
            strokeOpacity="0.18"
            strokeWidth="1.5"
            className="animate-pulse-circle"
            style={{
              animationDelay: "0.3s",
              transformOrigin: "50% 50%",
              transformBox: "fill-box" as const,
            }}
          />
        </svg>

        {/* Center logo */}
        <BrandLogo className="size-12" id="bp-center" />
      </div>

      {/* Edge gradients */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-muted to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-muted to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-muted to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-muted to-transparent" />
    </div>
  );
}

/* ────────────────────────────────────────────
   Mockup C — Build Timeline (technical commits)
   ──────────────────────────────────────────── */

const commits = [
  {
    hash: "a8f3d2e",
    msg: "feat: Supabase Auth + custom JWT claims hook",
    date: "Day 1, 10:00",
    done: true,
  },
  {
    hash: "c1b7f4a",
    msg: "feat: RLS policies for multi-tenant isolation",
    date: "Day 1, 12:00",
    done: true,
  },
  {
    hash: "9e2d8c3",
    msg: "feat: Stripe checkout + subscription webhooks",
    date: "Day 1, 14:30",
    done: true,
  },
  {
    hash: "f5a1b9d",
    msg: "feat: Dashboard with role-based navigation",
    date: "Day 1, 17:00",
    done: true,
  },
  {
    hash: "3c7e6f2",
    msg: "feat: Edge function for PDF invoice generation",
    date: "Day 2, 09:00",
    done: false,
  },
  {
    hash: "d4b2a1e",
    msg: "chore: Vercel deploy + custom domain config",
    date: "Day 2, 11:00",
    done: false,
  },
];

function BuildTimelineMockup() {
  return (
    <div className="relative h-full rounded-2xl bg-muted overflow-hidden flex items-center justify-center p-4">
      <div className="bg-card rounded-xl border shadow-lg w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <BrandLogo className="size-6" id="bt-hdr" />
          <img
            className="size-6 dark:invert"
            alt="GitHub"
            src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/github-icon.png?width=24&format=auto"
          />
          <div className="flex-1" />
          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            4/6 done
          </span>
        </div>

        {/* Timeline */}
        <div className="relative px-4 py-3">
          {/* Vertical line */}
          <span className="absolute top-3 bottom-3 left-[1.85rem] w-0.5 bg-border rounded-full" />

          <div className="space-y-3">
            {commits.map((c) => (
              <div
                key={c.hash}
                className="relative flex items-start gap-3 pl-5"
              >
                {/* Node */}
                <div className="absolute left-0 top-0.5">
                  {c.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-border" />
                  )}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-[11px] font-medium leading-tight",
                      c.done ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {c.msg}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-mono text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                      {c.hash}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {c.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t bg-muted/30">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: "66%" }}
              />
            </div>
            <span className="text-[9px] font-semibold text-primary">66%</span>
          </div>
          <span className="text-[9px] text-muted-foreground">
            ~12h of 48h used
          </span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Mockup D — Launch (leaf SVG + metrics)
   ──────────────────────────────────────────── */

function LaunchLeafMockup() {
  return (
    <div className="relative h-full rounded-2xl bg-muted overflow-hidden flex flex-col items-center justify-center gap-4 py-6">
      {/* Leaf SVG */}
      <svg
        className="w-36 h-auto opacity-90"
        fill="none"
        viewBox="0 0 228 316"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M147.241 258.834L79.9575 258.503C70.338 237.008 62.9021 214.618 57.7627 191.674C49.7705 157.677 50.589 122.287 60.1405 88.8689C69.692 55.4508 87.6588 25.116 112.332 0.750042C142.983 31.4016 188.145 93.971 169.338 191.661C164.244 214.757 156.841 237.26 147.241 258.834Z"
          fill="var(--card)"
          fillOpacity="0.2"
        />
        <path
          d="M147.241 258.834L79.9575 258.503C70.338 237.008 62.9021 214.618 57.7627 191.674C49.7705 157.677 50.589 122.287 60.1405 88.8689C69.692 55.4508 87.6588 25.116 112.332 0.750042C142.983 31.4016 188.145 93.971 169.338 191.661C164.244 214.757 156.841 237.26 147.241 258.834Z"
          fill="url(#lm-p0)"
        />
        <path
          d="M79.9575 258.503L24.1637 314.297C24.1637 314.297 -3.8439 274.015 1.40543 246.904C7.31216 216.656 57.1992 191.11 57.1992 191.11"
          fill="var(--card)"
          fillOpacity="0.2"
        />
        <path
          d="M79.9575 258.503L24.1637 314.297C24.1637 314.297 -3.8439 274.015 1.40543 246.904C7.31216 216.656 57.1992 191.11 57.1992 191.11"
          fill="url(#lm-p1)"
        />
        <path
          d="M147.241 258.834L203.585 315.179C203.585 315.179 231.198 275.17 225.683 248.006C219.478 217.699 169.338 191.661 169.338 191.661"
          fill="var(--card)"
          fillOpacity="0.2"
        />
        <path
          d="M147.241 258.834L203.585 315.179C203.585 315.179 231.198 275.17 225.683 248.006C219.478 217.699 169.338 191.661 169.338 191.661"
          fill="url(#lm-p2)"
        />
        <path
          d="M147.241 258.834L79.9575 258.503M147.241 258.834C156.841 237.26 164.244 214.757 169.338 191.661M147.241 258.834L203.585 315.179C203.585 315.179 231.198 275.17 225.683 248.006C219.478 217.699 169.338 191.661 169.338 191.661M79.9575 258.503C70.338 237.008 62.9021 214.618 57.7627 191.674C49.7705 157.677 50.5891 122.287 60.1405 88.8689C69.692 55.4508 87.6588 25.116 112.332 0.750041C142.983 31.4016 188.145 93.971 169.338 191.661M79.9575 258.503L24.1637 314.297C24.1637 314.297 -3.8439 274.015 1.40543 246.904C7.31216 216.656 57.1992 191.11 57.1992 191.11"
          stroke="url(#lm-p3)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient
            id="lm-p0"
            gradientUnits="userSpaceOnUse"
            x1="60.5"
            x2="203.2"
            y1="92.5"
            y2="213.3"
          >
            <stop stopColor="var(--primary)" stopOpacity="0.4" />
            <stop offset="1" stopColor="var(--card)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="lm-p1"
            gradientUnits="userSpaceOnUse"
            x1="60.5"
            x2="203.2"
            y1="92.5"
            y2="213.3"
          >
            <stop stopColor="var(--primary)" stopOpacity="0.4" />
            <stop offset="1" stopColor="var(--card)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="lm-p2"
            gradientUnits="userSpaceOnUse"
            x1="60.5"
            x2="203.2"
            y1="92.5"
            y2="213.3"
          >
            <stop stopColor="var(--primary)" stopOpacity="0.4" />
            <stop offset="1" stopColor="var(--card)" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="lm-p3"
            gradientUnits="userSpaceOnUse"
            x1="-6.4"
            x2="253.7"
            y1="123.3"
            y2="299.5"
          >
            <stop stopColor="var(--primary)" />
            <stop offset="1" stopColor="var(--muted)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Brand icons */}
      <div className="flex items-center gap-5">
        <span className="bg-card grid size-11 place-content-center overflow-hidden rounded-full border shadow-[2px_8px_20px_0_rgba(0,0,0,0.25)]">
          <BrandLogo className="size-7" id="lm-bl" />
        </span>
        <span className="bg-card grid size-11 place-content-center overflow-hidden rounded-full border shadow-[2px_8px_20px_0_rgba(0,0,0,0.25)]">
          <img
            className="size-7"
            alt="React"
            src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/react-logo.png?width=28&format=auto"
          />
        </span>
        <span className="bg-card grid size-11 place-content-center overflow-hidden rounded-full border shadow-[2px_8px_20px_0_rgba(0,0,0,0.25)]">
          <img
            className="size-7 dark:invert"
            alt="Next.js"
            src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/nextjs-logo.png?width=28&format=auto"
          />
        </span>
      </div>

      {/* Live metrics */}
      <div className="flex gap-3">
        {[
          { icon: Globe, label: "Uptime", value: "99.9%" },
          { icon: Users, label: "Users", value: "142" },
          { icon: DollarSign, label: "MRR", value: "$890" },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-card rounded-lg border px-3 py-2 text-center shadow-sm"
          >
            <m.icon className="h-3.5 w-3.5 text-primary mx-auto mb-0.5" />
            <p className="text-xs font-bold text-foreground">{m.value}</p>
            <p className="text-[8px] text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Mockup array
   ──────────────────────────────────────────── */

const mockups = [
  <IdeasListMockup key="ideas" />,
  <BlueprintOrbitMockup key="blueprint" />,
  <BuildTimelineMockup key="build" />,
  <LaunchLeafMockup key="launch" />,
];

/* ────────────────────────────────────────────
   Section (sticky-scroll cards)
   ──────────────────────────────────────────── */

export function ProtocolSection() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const vh = window.innerHeight;

        cardsRef.current.forEach((card, i) => {
          if (!card || i >= features.length - 1) return;

          const nextCard = cardsRef.current[i + 1];
          if (!nextCard) return;

          const nextRect = nextCard.getBoundingClientRect();
          const progress = Math.max(0, Math.min(1, 1 - nextRect.top / vh));

          card.style.transform = `scale(${1 - progress * 0.06})`;
          card.style.filter = `blur(${progress * 14}px)`;
          card.style.opacity = `${1 - progress * 0.35}`;
        });

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="features" className="relative scroll-mt-24">
      {features.map((feature, i) => (
        <div
          key={feature.label}
          ref={(el) => {
            cardsRef.current[i] = el;
          }}
          className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-background"
          style={{
            zIndex: i + 1,
            willChange: "transform, filter, opacity",
          }}
        >
          {/* Subtle top border between cards */}
          {i > 0 && (
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          )}

          {/* Content — fixed height for consistency */}
          <div
            className={cn(
              "relative z-10 max-w-6xl w-full mx-auto px-6 sm:px-8 lg:px-12",
              "flex flex-col gap-8",
              "md:h-[380px] md:flex-row md:items-stretch md:gap-16",
              feature.imagePosition === "left" && "md:flex-row-reverse"
            )}
          >
            {/* Text side */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-3">
                {feature.label}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15] mb-4">
                {feature.title}
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>

            {/* Mockup side — same height as text on desktop, fixed on mobile */}
            <div className="flex-1 min-w-0 h-72 md:h-auto">
              {mockups[i]}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
