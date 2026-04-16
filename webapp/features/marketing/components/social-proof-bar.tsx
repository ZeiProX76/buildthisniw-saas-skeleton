import { Marquee } from "@/components/ui/marquee";

const brands = [
  "ProductHunt",
  "Y Combinator",
  "Indie Hackers",
  "Hacker News",
  "TechCrunch",
  "Buildspace",
  "Vercel",
  "Supabase",
];

export function SocialProofBar() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-[0.2em] mb-10">
          Trusted by 12,000+ builders worldwide
        </p>
        <div className="relative">
          <Marquee pauseOnHover className="[--duration:30s] [--gap:4rem]">
            {brands.map((brand) => (
              <span
                key={brand}
                className="text-lg font-semibold text-muted-foreground/25 whitespace-nowrap select-none"
              >
                {brand}
              </span>
            ))}
          </Marquee>
          {/* Blur edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-background to-transparent" />
        </div>
      </div>
    </section>
  );
}
