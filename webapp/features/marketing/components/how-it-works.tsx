"use client";

import { useRef } from "react";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Sparkles, ListChecks, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Sparkles,
    title: "Pick Today's Idea",
    description:
      "Every morning, we drop a validated business idea with full market research, TAM analysis, and competitor breakdown.",
  },
  {
    number: "02",
    icon: ListChecks,
    title: "Follow the Blueprint",
    description:
      "A 48-hour step-by-step plan breaks the build into 2-hour sprints. Every task is clear. Every decision is made.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Ship & Validate",
    description:
      "Deploy your MVP, share it with the community, and start getting real users. From zero to live in a weekend.",
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const stepRefs = [step1Ref, step2Ref, step3Ref];

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-muted/30 dark:bg-muted/10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade delay={0.1} inView>
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-4">
              How it works
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              3 Steps to Your Next MVP
            </h2>
          </div>
        </BlurFade>

        <div ref={containerRef} className="relative max-w-5xl mx-auto">
          {/* Animated beams connecting steps (desktop only) */}
          <div className="hidden lg:block">
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={step1Ref}
              toRef={step2Ref}
              pathColor="oklch(0.67 0.16 245 / 0.15)"
              gradientStartColor="oklch(0.67 0.16 245)"
              gradientStopColor="oklch(0.60 0.26 302)"
              pathWidth={2}
              curvature={-40}
              duration={4}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={step2Ref}
              toRef={step3Ref}
              pathColor="oklch(0.67 0.16 245 / 0.15)"
              gradientStartColor="oklch(0.60 0.26 302)"
              gradientStopColor="oklch(0.70 0.17 251)"
              pathWidth={2}
              curvature={40}
              duration={4}
              delay={1}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, i) => (
              <BlurFade key={step.number} delay={0.2 + i * 0.15} inView>
                <div
                  ref={stepRefs[i]}
                  className="relative text-center flex flex-col items-center"
                >
                  {/* Step number badge */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-card border border-border/60 flex items-center justify-center shadow-lg">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm max-w-xs">
                    {step.description}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
