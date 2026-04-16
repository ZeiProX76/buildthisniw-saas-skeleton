"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Are these real business ideas?",
    answer:
      "Yes. Every idea is AI-researched with real market data \u2014 Google Trends, Reddit sentiment, keyword volume, and competitive landscape. TAM and monetization strategy included.",
  },
  {
    question: "Can I actually build an MVP in 48 hours?",
    answer:
      "The plans are designed for developers who can code. If you know React and can deploy to Vercel, yes. Each plan breaks into 2-hour sprints with clear deliverables.",
  },
  {
    question: "What if someone else builds the same idea?",
    answer:
      "Execution beats ideas every time. The market for most ideas is massive \u2014 two people building a resume tool doesn't mean it's saturated, it means it's validated.",
  },
  {
    question: "Do I keep what I build?",
    answer:
      "100%. Everything you build is yours. Your code, your product, your revenue. We're the idea engine, not an equity partner.",
  },
  {
    question: "What tech stack do the blueprints use?",
    answer:
      "Most plans use Next.js + Supabase + Stripe \u2014 the fastest path to production SaaS. We also cover Python, React Native, and AI projects.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "The Free plan is free forever \u2014 1 idea per week with basic market data and community access. Upgrade to Pro when you're ready for daily ideas.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="bg-foreground dark:bg-card py-24 sm:py-36 scroll-mt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-16">
            <p className="text-xs font-medium text-background/50 dark:text-muted-foreground uppercase tracking-[0.25em] mb-5">
              FAQ
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-background dark:text-card-foreground">
              Questions? Answered.
            </h2>
          </div>
        </BlurFade>

        <BlurFade delay={0.2} inView>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-background/10 dark:border-muted-foreground/10"
              >
                <AccordionTrigger className="text-left text-base font-medium text-background dark:text-card-foreground hover:no-underline hover:text-background/80 dark:hover:text-card-foreground/80">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-background/60 dark:text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </BlurFade>
      </div>
    </section>
  );
}
