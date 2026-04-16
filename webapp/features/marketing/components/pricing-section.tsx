"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "One idea per week to start.",
    features: [
      "1 idea per week",
      "Basic market data",
      "Community access",
      "Build outline",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "Daily ideas. Full research. Templates.",
    features: [
      "Daily ideas at 8 AM",
      "Full market research",
      "48h build blueprints",
      "Starter templates",
      "Priority community",
      "Revenue playbook",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    name: "Team",
    price: "$79",
    period: "/month",
    description: "Ship together, faster.",
    features: [
      "Everything in Pro",
      "Up to 5 members",
      "Custom idea briefs",
      "Team collaboration",
      "API access",
      "Dedicated support",
    ],
    cta: "Start Team",
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade delay={0.1} inView>
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-4">
              Pricing
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              Less Than a Coffee a Day
            </h2>
            <p className="mt-4 text-muted-foreground text-base">
              No hidden fees. Cancel anytime.
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <BlurFade key={plan.name} delay={0.15 + i * 0.1} inView>
              <div
                className={cn(
                  "relative rounded-2xl border bg-card p-8 lg:p-9 h-full flex flex-col",
                  "transition-all duration-300 hover:-translate-y-2",
                  plan.popular
                    ? "border-primary/50 ring-1 ring-primary/20 shadow-xl shadow-primary/10 hover:shadow-2xl hover:shadow-primary/15 scale-[1.02]"
                    : "border-border shadow-lg shadow-foreground/[0.03] hover:shadow-2xl hover:shadow-primary/10"
                )}
              >
                {/* Gradient top accent on popular */}
                {plan.popular && (
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-t-2xl" />
                )}

                {/* Inner glow on popular */}
                {plan.popular && (
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/[0.04] to-transparent rounded-t-2xl pointer-events-none" />
                )}

                {plan.popular && (
                  <span className="relative inline-block self-start text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary/10 rounded-full px-3 py-1 mb-5 shadow-sm">
                    Most Popular
                  </span>
                )}

                <h3 className="text-xl font-semibold text-foreground">
                  {plan.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>

                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {plan.description}
                </p>

                <div className="mt-8 mb-8 h-px bg-border" />

                <ul className="space-y-3.5 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10">
                  {plan.popular ? (
                    <Button
                      className="w-full"
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full shadow-lg shadow-foreground/5"
                    >
                      {plan.cta}
                    </Button>
                  )}
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
