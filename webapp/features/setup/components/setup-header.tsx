"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/features/_shared/components/theme-switcher";
import { LocaleSwitcher } from "@/features/_shared/components/locale-switcher";

export function SetupHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
              <linearGradient id="setup-hdr-top" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A5D0FF" />
                <stop offset="100%" stopColor="#7CB5FF" />
              </linearGradient>
              <linearGradient id="setup-hdr-left" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#5B9BFF" />
                <stop offset="100%" stopColor="#2D6FD6" />
              </linearGradient>
              <linearGradient id="setup-hdr-right" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1A4FA8" />
              </linearGradient>
            </defs>
            <polygon points="16,4 27,10 16,16 5,10" fill="url(#setup-hdr-top)" />
            <polygon points="5,10 16,16 16,28 5,22" fill="url(#setup-hdr-left)" />
            <polygon points="27,10 16,16 16,28 27,22" fill="url(#setup-hdr-right)" />
          </svg>
          <span className={cn(
            "hidden sm:inline font-semibold text-foreground transition-[font-size] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]",
            scrolled ? "text-sm" : "text-base"
          )}>
            Build This Now
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
      </nav>
    </header>
  );
}
