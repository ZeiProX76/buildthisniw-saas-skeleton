"use client";

import { useEffect, useRef } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Lightbulb, FileCode2, Wrench, Users } from "lucide-react";

const steps = [
  {
    icon: Lightbulb,
    title: "Validated Ideas",
    description: "Market-tested, every morning at 8 AM.",
  },
  {
    icon: FileCode2,
    title: "48h Build Plan",
    description: "Task-by-task. Empty repo to deployed MVP.",
  },
  {
    icon: Wrench,
    title: "Starter Templates",
    description: "Right stack, pre-wired. Clone and go.",
  },
  {
    icon: Users,
    title: "12K+ Builders",
    description: "Ship together. Get feedback. Stay accountable.",
  },
];

function AnimatedCurve() {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          path.style.transition = "stroke-dashoffset 2.5s ease-out";
          path.style.strokeDashoffset = "0";
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(path);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      viewBox="0 0 1000 100"
      fill="none"
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Glow/shadow path */}
      <path
        d="M 125 80 C 220 80, 270 30, 375 30 C 480 30, 520 10, 625 10 C 730 10, 770 50, 875 50"
        stroke="oklch(0.67 0.16 245 / 0.08)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Animated path */}
      <path
        ref={pathRef}
        d="M 125 80 C 220 80, 270 30, 375 30 C 480 30, 520 10, 625 10 C 730 10, 770 50, 875 50"
        stroke="oklch(0.67 0.16 245 / 0.25)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Dots at connection points */}
      {[
        { cx: 125, cy: 80 },
        { cx: 375, cy: 30 },
        { cx: 625, cy: 10 },
        { cx: 875, cy: 50 },
      ].map((dot, i) => (
        <circle
          key={i}
          cx={dot.cx}
          cy={dot.cy}
          r="5"
          fill="oklch(0.67 0.16 245 / 0.3)"
          stroke="oklch(0.67 0.16 245 / 0.5)"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

export function SolutionSection() {
  return (
    <section id="how-it-works" className="pt-24 sm:pt-36 pb-10 sm:pb-14 scroll-mt-24">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* DotPattern — constrained to content width, wide ellipse */}
        <DotPattern
          width={24}
          height={24}
          cr={1.5}
          className="absolute inset-0 overflow-hidden text-primary/40 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,white,transparent)]"
        />
        <BlurFade delay={0.1} inView>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.25em] mb-4">
              The fix
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Wake Up. Open App.{" "}
              <span className="text-primary">Ship by Friday.</span>
            </h2>
          </div>
        </BlurFade>

        {/* Desktop: cards with curve woven through */}
        <div className="hidden md:block">
          <div className="relative max-w-5xl mx-auto">
            {/* Cards row */}
            <div className="relative z-10 grid grid-cols-4 gap-8">
              {steps.map((step, i) => {
                // Smaller offsets so cards sit near the SVG line
                const offsets = ["mt-10", "mt-2", "mt-0", "mt-4"];
                return (
                  <BlurFade key={step.title} delay={0.25 + i * 0.12} inView>
                    <div className={`flex flex-col items-center ${offsets[i]}`}>
                      {/* Card */}
                      <div className="relative group">
                        <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl bg-card border-2 border-dashed border-primary/20 flex items-center justify-center shadow-lg transition-all duration-500 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:border-primary/40 group-hover:-translate-y-1">
                          <step.icon className="h-12 w-12 lg:h-14 lg:w-14 text-primary/60 transition-all duration-500 group-hover:text-primary group-hover:scale-110" />
                        </div>
                        {/* Number badge */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md ring-2 ring-background">
                          {i + 1}
                        </div>
                      </div>
                      {/* Label */}
                      <div className="mt-6 text-center">
                        <p className="text-sm font-semibold text-foreground">
                          {step.title}
                        </p>
                      </div>
                    </div>
                  </BlurFade>
                );
              })}
            </div>

            {/* Connecting curve — slight overlap with cards */}
            <div className="-mt-6">
              <AnimatedCurve />
            </div>
          </div>
        </div>

        {/* Mobile fallback — stacked cards */}
        <div className="md:hidden grid grid-cols-2 gap-5 mt-10">
          {steps.map((step, i) => (
            <BlurFade key={step.title} delay={0.15 + i * 0.08} inView>
              <div className="group relative rounded-2xl border-2 border-dashed border-primary/20 bg-card p-5 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 shadow-lg shadow-primary/5 hover:border-primary/40">
                <div className="mx-auto mb-3 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md shadow-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute -top-2.5 right-3 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {step.title}
                </h3>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
