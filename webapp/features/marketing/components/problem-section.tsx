"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { Highlighter } from "@/components/ui/highlighter";
import { Brain, Map, UserX } from "lucide-react";

const problems = [
  {
    icon: Brain,
    number: "01",
    title: "Overthinking",
    description: "Weeks of research. Someone else shipped it.",
  },
  {
    icon: Map,
    number: "02",
    title: "No Roadmap",
    description: "Committed but lost. Tutorials, no code.",
  },
  {
    icon: UserX,
    number: "03",
    title: "Building Alone",
    description: "Idea, doubt, abandon, repeat.",
  },
];

export function ProblemSection() {
  return (
    <section className="bg-foreground dark:bg-card py-24 sm:py-36">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade delay={0.1} inView>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-medium text-background/50 dark:text-muted-foreground uppercase tracking-[0.25em] mb-5">
              Sound familiar?
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-background dark:text-card-foreground leading-[1.1]">
              You Have Ideas.
              <br />
              <Highlighter
                color="oklch(0.67 0.16 245 / 0.7)"
                strokeWidth={3}
                animationDuration={1000}
                iterations={1}
                padding={2}
                isView
              >
                You Never Ship.
              </Highlighter>
            </h2>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {problems.map((problem, i) => (
            <BlurFade key={problem.title} delay={0.15 + i * 0.1} inView>
              <div className="group relative h-full rounded-2xl border border-background/10 dark:border-muted/30 bg-background/[0.04] dark:bg-muted/10 p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-background/[0.08] dark:hover:bg-muted/20 hover:border-background/20 dark:hover:border-muted/50">
                {/* Top row: number + icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-background/10 dark:text-card-foreground/10 font-mono">
                    {problem.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-background/10 dark:bg-muted/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <problem.icon className="h-5 w-5 text-background/60 dark:text-card-foreground/60 transition-colors duration-300 group-hover:text-primary" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-background dark:text-card-foreground mb-2">
                  {problem.title}
                </h3>
                <p className="text-sm text-background/50 dark:text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
