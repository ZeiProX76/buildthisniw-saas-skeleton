"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { Marquee } from "@/components/ui/marquee";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Alex Chen",
    role: "Indie Hacker",
    gradient: "from-blue-400 to-cyan-300",
    quote:
      "Shipped 3 MVPs in a month. One makes $4K MRR now. This changed everything for me — I stopped planning and started building.",
  },
  {
    name: "Sarah Martinez",
    role: "Solo Founder",
    gradient: "from-violet-400 to-purple-300",
    quote:
      "Like having a co-founder who's always prepared. The build plans are insanely detailed. I went from idea to paying customers in 11 days.",
  },
  {
    name: "James Park",
    role: "Developer",
    gradient: "from-amber-400 to-orange-300",
    quote:
      "From 'what should I build?' to 'it's live' in a weekend. Twice. I never thought I could ship this fast. Never going back.",
  },
  {
    name: "Priya Sharma",
    role: "Product Designer",
    gradient: "from-emerald-400 to-teal-300",
    quote:
      "Built my first SaaS. $800 MRR in month one. The market research alone is worth 10x the price. Absolutely game-changing.",
  },
  {
    name: "Marcus Johnson",
    role: "Serial Builder",
    gradient: "from-rose-400 to-pink-300",
    quote:
      "12K people watching you ship hits different. The accountability factor is real. I've launched more in 2 months than all of last year.",
  },
  {
    name: "Elena Volkov",
    role: "Freelancer",
    gradient: "from-sky-400 to-indigo-300",
    quote:
      "Used to spend 3 weeks deciding on an idea. Now I spend 3 hours building. Best investment I've ever made in my career.",
  },
];

function TestimonialCard({
  name,
  role,
  gradient,
  quote,
}: (typeof testimonials)[number]) {
  return (
    <div className="w-[22rem] h-full flex flex-col rounded-2xl border border-border bg-card p-7 shadow-lg shadow-primary/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} className="h-4 w-4 fill-warning text-warning" />
        ))}
      </div>

      <p className="text-[15px] text-foreground/90 leading-relaxed flex-1">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="flex items-center gap-3.5 pt-4 mt-6 border-t border-border">
        {/* Fake avatar with gradient */}
        <div
          className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
        >
          <span className="text-xs font-bold text-white drop-shadow-sm">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 sm:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade delay={0.1} inView>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-4">
              Wall of love
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Builders Ship. Results Follow.
            </h2>
          </div>
        </BlurFade>

        {/* CSS mask fades edges — lets the ambient gradient behind show through naturally */}
        <div className="py-6 [mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_88%,transparent_100%)]">
          <Marquee pauseOnHover className="[--duration:45s]">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
