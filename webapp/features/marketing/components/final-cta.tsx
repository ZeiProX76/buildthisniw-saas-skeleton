"use client";

import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      {/* Primary gradient background — fading from transparent to primary */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-primary/20" />

      {/* CTA content */}
      <div className="relative z-10 pt-20 sm:pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BlurFade delay={0.1} inView>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Stop Scrolling.{" "}
              <span className="text-primary">Start Shipping.</span>
            </h2>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <p className="mt-6 text-lg text-muted-foreground">
              Your next $1K/mo side project is one click away.
            </p>
          </BlurFade>

          <BlurFade delay={0.35} inView>
            <div className="mt-10">
              <Button size="lg" className="text-base px-10 h-12">
                Get Today&apos;s Idea &mdash; Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </BlurFade>

          <BlurFade delay={0.45} inView>
            <p className="mt-6 text-xs text-muted-foreground/50">
              Free forever. No credit card required.
            </p>
          </BlurFade>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-primary/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-center gap-10">

            {/* Right: nav columns */}
            <div className="grid grid-cols-3 gap-10 text-sm">
              <div>
                <p className="font-semibold text-foreground mb-3">Product</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/landing" className="hover:text-foreground transition-colors">Features</Link></li>
                  <li><Link href="/landing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                  <li><Link href="/landing" className="hover:text-foreground transition-colors">Templates</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-3">Community</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/landing" className="hover:text-foreground transition-colors">Twitter/X</Link></li>
                  <li><Link href="/landing" className="hover:text-foreground transition-colors">Discord</Link></li>
                  <li><Link href="/landing" className="hover:text-foreground transition-colors">Blog</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-3">Legal</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                  <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Giant brand name with primary gradient fade */}
        <div className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-[clamp(3rem,10vw,8rem)] font-black tracking-tighter leading-none text-center bg-gradient-to-t from-primary/40 to-primary/5 bg-clip-text text-transparent select-none">
              BUILD THIS NOW
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-primary/10">
          <div className="flex justify-between text-xs text-muted-foreground/50">
            <p>Build This Now &copy; 2026</p>
            <p>All rights reserved.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}
