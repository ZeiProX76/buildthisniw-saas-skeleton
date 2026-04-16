"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "@/features/_shared/components/locale-switcher";
import { ThemeSwitcher } from "@/features/_shared/components/theme-switcher";

const navLinkKeys = [
  { key: "howItWorks" as const, href: "#how-it-works" },
  { key: "features" as const, href: "#features" },
  { key: "faq" as const, href: "#faq" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const tNav = useTranslations("Marketing.nav");
  const tCommon = useTranslations("Common");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <header
      className={cn(
        "fixed left-1/2 -translate-x-1/2 z-50 w-full",
        "transition-[top,max-width,background-color,box-shadow,border-radius] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
        scrolled
          ? "top-4 max-w-6xl rounded-full bg-background/80 backdrop-blur-xl shadow-lg shadow-foreground/[0.03]"
          : "top-0 max-w-7xl rounded-none bg-transparent shadow-none"
      )}
    >
      {/* Pill border — fades in on scroll */}
      <div
        className={cn(
          "absolute inset-0 rounded-full ring-1 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none",
          scrolled ? "ring-border/40 opacity-100" : "ring-transparent opacity-0"
        )}
      />

      <nav
        className={cn(
          "relative flex items-center justify-between",
          "transition-[padding,gap] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled ? "px-6 sm:px-8 py-3.5 gap-4 sm:gap-6" : "px-4 sm:px-8 py-5 sm:py-6 gap-6 sm:gap-10"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "transition-[width,height] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105",
              scrolled ? "w-8 h-8" : "w-9 h-9"
            )}
          >
            <defs>
              <linearGradient id="hdr-top" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A5D0FF" />
                <stop offset="100%" stopColor="#7CB5FF" />
              </linearGradient>
              <linearGradient id="hdr-left" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#5B9BFF" />
                <stop offset="100%" stopColor="#2D6FD6" />
              </linearGradient>
              <linearGradient id="hdr-right" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1A4FA8" />
              </linearGradient>
            </defs>
            <polygon points="16,4 27,10 16,16 5,10" fill="url(#hdr-top)" />
            <polygon points="5,10 16,16 16,28 5,22" fill="url(#hdr-left)" />
            <polygon points="27,10 16,16 16,28 27,22" fill="url(#hdr-right)" />
          </svg>
          <span className={cn(
            "hidden sm:inline font-semibold text-foreground transition-[font-size] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            scrolled ? "text-sm" : "text-base"
          )}>
            Build This Now
          </span>
        </Link>

        {/* Nav links — hidden on small screens */}
        <div className="hidden md:flex items-center gap-1">
          {navLinkKeys.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className={cn(
                "text-muted-foreground hover:text-foreground font-medium rounded-full",
                "transition-[font-size,padding,color] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
                scrolled ? "text-[13px] px-3.5 py-1.5" : "text-sm px-4 py-2"
              )}
            >
              {tNav(link.key)}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <ThemeSwitcher />
          <LocaleSwitcher />
          <Button
            variant="ghost"
            asChild
            className={cn(
              "text-muted-foreground hover:text-foreground",
              "transition-[height,padding,font-size] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
              scrolled ? "h-9 px-3.5 text-sm" : "h-10 px-4 text-base"
            )}
          >
            <Link href="/auth/login">{tCommon("signIn")}</Link>
          </Button>
          <Button
            asChild
            className={cn(
              "rounded-full",
              "transition-[height,padding,font-size] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
              scrolled ? "h-9 px-5 text-sm" : "h-10 px-6 text-base"
            )}
          >
            <Link href="/auth/login">{tCommon("getStarted")}</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
