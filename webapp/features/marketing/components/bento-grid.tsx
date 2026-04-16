"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  User,
  TriangleAlert,
  BadgeCheck,
  ShoppingCart,
  Rocket,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

// ---------------------------------------------------------------------------
// Shared: Brand logo SVG (used in multiple cards)
// ---------------------------------------------------------------------------
function BrandLogo({ className, id = "bl" }: { className?: string; id?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A5D0FF" />
          <stop offset="100%" stopColor="#7CB5FF" />
        </linearGradient>
        <linearGradient id={`${id}-left`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#5B9BFF" />
          <stop offset="100%" stopColor="#2D6FD6" />
        </linearGradient>
        <linearGradient id={`${id}-right`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1A4FA8" />
        </linearGradient>
      </defs>
      <polygon points="16,4 27,10 16,16 5,10" fill={`url(#${id}-top)`} />
      <polygon points="5,10 16,16 16,28 5,22" fill={`url(#${id}-left)`} />
      <polygon points="27,10 16,16 16,28 27,22" fill={`url(#${id}-right)`} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Shared: New-user badge
// ---------------------------------------------------------------------------
function NewUserBadge() {
  return (
    <span className="inline-flex w-fit shrink-0 items-center justify-center overflow-hidden border border-border text-foreground bg-background gap-1.5 rounded-md px-2.5 py-1.25 text-sm font-normal whitespace-nowrap shadow-md">
      <span className="bg-primary/10 grid size-5 place-content-center rounded-sm">
        <User className="size-4" aria-hidden="true" />
      </span>
      New user
    </span>
  );
}

// ---------------------------------------------------------------------------
// Funnel flow element (framer-motion) for User Analytics card
// Avatars: wide at top → converge at logo. Badges: logo → spread to bottom.
// Uses 5 interpolated keyframes + linear ease for smooth constant flow.
// ---------------------------------------------------------------------------
function FunnelItem({
  children,
  startX,
  startY,
  midX,
  midY,
  endX,
  endY,
  startScale = 0.8,
  endScale = 0.6,
  delay = 0,
  duration = 8,
}: {
  children: React.ReactNode;
  startX: number;
  startY: number;
  midX: number;
  midY: number;
  endX: number;
  endY: number;
  startScale?: number;
  endScale?: number;
  delay?: number;
  duration?: number;
}) {
  // Interpolate quarter-points for 5-keyframe smoothness
  const q1x = (startX + midX) / 2;
  const q1y = (startY + midY) / 2;
  const q3x = (midX + endX) / 2;
  const q3y = (midY + endY) / 2;
  const q1s = (startScale + 1) / 2;
  const q3s = (1 + endScale) / 2;

  return (
    <motion.div
      className="absolute left-1/2"
      style={{ top: 0 }}
      animate={{
        x: [startX, q1x, midX, q3x, endX],
        y: [startY, q1y, midY, q3y, endY],
        opacity: [0, 0.8, 1, 0.8, 0],
        scale: [startScale, q1s, 1, q3s, endScale],
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay,
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Card 1: User Analytics
// ---------------------------------------------------------------------------
// Avatars: start spread wide at top, converge toward center logo (~y=200)
const avatarData = [
  { src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png", alt: "User 1", startX: -80, startY: 0, midX: -45, midY: 100, endX: -15, endY: 210, delay: 0, duration: 8 },
  { src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png", alt: "User 2", startX: 70, startY: 5, midX: 48, midY: 90, endX: 5, endY: 195, delay: 1.6, duration: 9 },
  { src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png", alt: "User 3", startX: -55, startY: 10, midX: -40, midY: 105, endX: -10, endY: 200, delay: 0.8, duration: 8.5 },
  { src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png", alt: "User 4", startX: 50, startY: 0, midX: 20, midY: 85, endX: 0, endY: 205, delay: 2.4, duration: 7.5 },
  { src: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png", alt: "User 5", startX: -5, startY: 15, midX: -2, midY: 95, endX: 0, endY: 190, delay: 1.2, duration: 8 },
];

// Badges: emerge from near logo (~y=235), spread outward toward bottom
const badgeData = [
  { startX: -10, startY: 235, midX: -45, midY: 275, endX: -85, endY: 360, delay: 0.4, duration: 9 },
  { startX: 5, startY: 240, midX: -30, midY: 270, endX: -65, endY: 340, delay: 2, duration: 8 },
  { startX: -5, startY: 238, midX: -22, midY: 280, endX: -78, endY: 320, delay: 1.2, duration: 10 },
  { startX: 8, startY: 242, midX: 40, midY: 310, endX: 53, endY: 360, delay: 2.8, duration: 8.5 },
  { startX: 0, startY: 240, midX: -55, midY: 290, endX: -100, endY: 358, delay: 0.8, duration: 9 },
];

function UserAnalyticsCard() {
  return (
    <div className="bg-card flex flex-col gap-6 overflow-hidden rounded-xl pb-6">
      <div className="relative flex min-h-97 flex-1 items-end">
        {/* Mountain SVG background */}
        <svg
          className="absolute top-0 left-1/2 -z-1 -translate-x-1/2"
          height="389"
          width="390"
          fill="none"
          viewBox="0 0 390 389"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_28527_188135)">
            <rect height="389" width="389.333" fill="var(--secondary)" fillOpacity="0.4" />
            <path
              d="M151.116 164.302L0.00195312 61.0625V388.44H389.332V61.0625L237.447 164.302C237.447 164.302 233.621 171.033 231.733 175.844C222.917 198.309 234.257 235.355 225.105 251.844C214.837 270.343 178.11 277.641 165.262 251.844C156.829 234.909 165.644 198.31 156.829 175.844C154.941 171.033 151.116 164.302 151.116 164.302Z"
              fill="var(--card)"
            />
          </g>
        </svg>

        {/* Center logo */}
        <BrandLogo className="absolute top-50 left-1/2 z-10 size-16 -translate-x-1/2" id="bl-analytics" />

        {/* Avatars: flow from top (spread) → converge at logo */}
        {avatarData.map((a, i) => (
          <FunnelItem
            key={`avatar-${i}`}
            startX={a.startX}
            startY={a.startY}
            midX={a.midX}
            midY={a.midY}
            endX={a.endX}
            endY={a.endY}
            startScale={0.8}
            endScale={0.6}
            delay={a.delay}
            duration={a.duration}
          >
            <span className="relative flex shrink-0 overflow-hidden rounded-full size-10">
              <Image className="aspect-square size-full" alt={a.alt} src={a.src} width={40} height={40} />
            </span>
          </FunnelItem>
        ))}

        {/* Badges: emerge below logo → spread outward to bottom */}
        {badgeData.map((b, i) => (
          <FunnelItem
            key={`badge-${i}`}
            startX={b.startX}
            startY={b.startY}
            midX={b.midX}
            midY={b.midY}
            endX={b.endX}
            endY={b.endY}
            startScale={0.65}
            endScale={0.85}
            delay={b.delay}
            duration={b.duration}
          >
            <NewUserBadge />
          </FunnelItem>
        ))}
      </div>
      <div className="space-y-2 px-6">
        <h3 className="text-2xl font-semibold">User analytics</h3>
        <p className="text-muted-foreground text-sm">
          Monitor new and returning users effortlessly, gaining complete
          visibility into who engages with product.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini bar chart (static SVG)
// ---------------------------------------------------------------------------
function MiniBarChart({ color }: { color: string }) {
  const heights = [20.75, 37.68, 26.31, 40.76, 37.68];
  return (
    <div className="flex aspect-video justify-center text-xs min-h-13 max-w-18">
      <svg
        className="recharts-surface"
        height="52"
        width="72"
        viewBox="0 0 72 52"
        style={{ width: "100%", height: "100%" }}
      >
        {heights.map((h, i) => {
          const x = 7 + i * 12.4;
          const y = 47 - h;
          return (
            <rect key={i} x={x} y={y} width="8" height={h} rx="2" fill={color} />
          );
        })}
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 2: Product Metrics
// ---------------------------------------------------------------------------
function ProductMetricsCard() {
  return (
    <div className="bg-card flex flex-col gap-6 overflow-hidden rounded-xl pb-6">
      <div className="relative flex min-h-97 flex-1 items-center justify-center overflow-hidden">
        {/* Pulsing circles */}
        <svg
          className="pointer-events-none absolute"
          height="550px"
          width="550px"
          fill="none"
          viewBox="0 0 550 550"
          xmlns="http://www.w3.org/2000/svg"
        >
          {[240, 205, 170, 135, 100].map((r, i) => (
            <circle
              key={r}
              cx="275"
              cy="275"
              r={r}
              fill="color-mix(in oklab, var(--primary) 05%, transparent)"
              className="animate-pulse-circle"
              style={{
                animationDelay: `${i * 0.3}s`,
                transformOrigin: "50% 50%",
                transformBox: "fill-box" as const,
              }}
            />
          ))}
        </svg>

        {/* Product insight card */}
        <div className="bg-card text-card-foreground flex flex-col rounded-xl border py-6 shadow-sm gap-4 z-10 w-full max-w-68">
          <div className="flex justify-between items-start gap-2 px-6">
            <div className="flex flex-col gap-1">
              <span className="text-lg font-semibold">Product insight</span>
              <span className="text-muted-foreground text-sm">
                Published on 12 MAY 2025 - 6:10 PM
              </span>
            </div>
            <Image
              className="w-20.5 rounded-md"
              alt="Product"
              src="https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/widgets/image-7.png"
              width={82}
              height={82}
            />
          </div>
          <div className="px-6 space-y-4">
            <div className="bg-border h-px w-full" role="none" />
            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col gap-1">
                <span className="text-xs">Product reached</span>
                <span className="text-2xl font-semibold">21,153</span>
              </div>
              <MiniBarChart color="var(--primary)" />
            </div>
            <div className="flex items-center justify-between gap-1">
              <div className="flex flex-col gap-1">
                <span className="text-xs">Order placed</span>
                <span className="text-2xl font-semibold">2,123</span>
              </div>
              <MiniBarChart color="color-mix(in oklab, var(--primary) 10%, transparent)" />
            </div>
          </div>
        </div>

        {/* Edge gradients */}
        <div className="from-card pointer-events-none absolute inset-x-0 top-0 h-15 bg-gradient-to-b to-transparent" />
        <div className="from-card pointer-events-none absolute inset-y-0 right-0 w-15 bg-gradient-to-l to-transparent" />
        <div className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-15 bg-gradient-to-t to-transparent" />
        <div className="from-card pointer-events-none absolute inset-y-0 left-0 w-15 bg-gradient-to-r to-transparent" />
      </div>
      <div className="space-y-2 px-6">
        <h3 className="text-2xl font-semibold">Product Metrics</h3>
        <p className="text-muted-foreground text-sm">
          Visualize key product metrics to making it easy to track growth,
          performance, and trends.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 3: Check Orders Status (donut chart)
// ---------------------------------------------------------------------------
function CheckOrdersCard() {
  return (
    <div className="bg-card flex flex-col gap-6 overflow-hidden rounded-xl py-6">
      <div className="relative flex h-46 items-start justify-center overflow-hidden">
        <div className="bg-card text-card-foreground flex flex-col rounded-xl border py-6 shadow-sm group max-w-65 justify-between gap-2">
          <div className="grid auto-rows-min items-start px-6 gap-1">
            <div className="flex items-center gap-2">
              <div className="text-lg font-semibold">$27.9k</div>
              <span className="text-sm">+49%</span>
            </div>
            <div className="text-muted-foreground text-base">Total Growth</div>
          </div>
          <div className="px-6 transition-transform duration-300 group-hover:-translate-y-2">
            <div className="flex aspect-video justify-center text-xs h-37.5 w-full">
              <svg
                height="150"
                width="210"
                viewBox="0 0 210 150"
                style={{ width: "100%", height: "100%" }}
              >
                {/* Donut segments */}
                <g>
                  <path
                    d="M 180,75 A 75,75,0,0,0,33.97,50.92 L 57.65,58.94 A 50,50,0,0,1,155,75 Z"
                    fill="var(--primary)"
                    stroke="#fff"
                  />
                  <path
                    d="M 32.81,54.67 A 75,75,0,0,0,90.86,148.66 L 95.58,124.10 A 50,50,0,0,1,56.87,61.45 Z"
                    fill="color-mix(in oklab, var(--primary) 60%, transparent)"
                    stroke="#fff"
                  />
                  <path
                    d="M 94.74,149.29 A 75,75,0,0,0,179.90,78.93 L 154.93,77.62 A 50,50,0,0,1,98.16,124.53 Z"
                    fill="color-mix(in oklab, var(--primary) 20%, transparent)"
                    stroke="#fff"
                  />
                  <text x="105" y="75" textAnchor="middle" dominantBaseline="middle">
                    <tspan className="fill-foreground text-xl font-medium" x="105" y="75">
                      $23K
                    </tspan>
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t to-transparent" />
      </div>
      <div className="space-y-2 px-6">
        <h3 className="text-2xl font-semibold">Check orders status</h3>
        <p className="text-muted-foreground text-sm">
          Consistent UI, powered by a shared framework. From buttons to layouts
          — everything aligns.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 4: Enterprise Collaboration (orbiting logos)
// ---------------------------------------------------------------------------
const orbitLogos = {
  outer: [
    {
      angle: 45,
      light: "https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-65.png?width=30&format=auto",
      dark: "https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-65-dark.png?width=30&format=auto",
      alt: "Amazon",
    },
    {
      angle: 135,
      light: "https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-66.png?width=30&format=auto",
      alt: "Netflix",
    },
    {
      angle: 225,
      light: "https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-70.png?width=30&format=auto",
      alt: "Subway",
    },
    {
      angle: 315,
      light: "https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-69.png?width=30&format=auto",
      alt: "Starbucks",
    },
  ],
  middle: [
    {
      angle: 90,
      light: "https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-71.png?width=30&format=auto",
      dark: "https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-71-dark.png?width=30&format=auto",
      alt: "Nike",
    },
    {
      angle: 270,
      light: "https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-72.png?width=30&format=auto",
      alt: "H&M",
    },
  ],
  inner: [
    {
      angle: 0,
      light: "https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-73.png?width=30&format=auto",
      dark: "https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-73-dark.png?width=30&format=auto",
      alt: "Adidas",
    },
    {
      angle: 180,
      light: "https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-67.png?width=30&format=auto",
      alt: "Prime Video",
    },
  ],
};

function OrbitRing({
  radius,
  items,
  duration,
}: {
  radius: number;
  items: typeof orbitLogos.outer;
  duration: number;
}) {
  return (
    <>
      <svg className="pointer-events-none absolute inset-0 size-full" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="50%" r={radius} fill="none" stroke="var(--border)" strokeWidth="1" />
      </svg>
      {items.map((item) => (
        <div
          key={item.alt}
          className="animate-orbit absolute flex transform-gpu items-center justify-center rounded-full"
          style={
            {
              "--duration": duration,
              "--radius": radius,
              "--angle": item.angle,
            } as React.CSSProperties
          }
        >
          <span className="bg-background grid size-13 place-content-center rounded-full border shadow-sm">
            <Image className={`size-7.5${item.dark ? " dark:hidden" : ""}`} alt={item.alt} src={item.light} width={30} height={30} />
            {item.dark && (
              <Image className="hidden size-7.5 dark:inline-block" alt={`${item.alt} Dark`} src={item.dark} width={30} height={30} />
            )}
          </span>
        </div>
      ))}
    </>
  );
}

function EnterpriseCollaborationCard() {
  return (
    <div className="bg-card flex flex-col overflow-hidden rounded-xl pb-6">
      <div className="relative flex min-h-58 flex-1 items-center justify-center overflow-hidden">
        <div className="absolute flex size-88 flex-col items-center justify-center">
          <OrbitRing radius={175} items={orbitLogos.outer} duration={30} />
          <OrbitRing radius={135.5} items={orbitLogos.middle} duration={30} />
          <OrbitRing radius={90} items={orbitLogos.inner} duration={30} />
          <BrandLogo className="absolute top-1/2 left-1/2 z-10 size-20.5 -translate-x-1/2 -translate-y-1/2" id="bl-collab" />
        </div>
        <div className="from-card pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b to-transparent" />
        <div className="from-card pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l to-transparent" />
        <div className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t to-transparent" />
        <div className="from-card pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r to-transparent" />
      </div>
      <div className="space-y-2 px-6">
        <h3 className="text-2xl font-semibold">Enterprise collaboration</h3>
        <p className="text-muted-foreground text-sm">
          Collaborate with leading companies, expand network by gaining
          insights from top-performing teams.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 5: Stay Informed (notification carousel)
// ---------------------------------------------------------------------------
const notifications = [
  { icon: TriangleAlert, label: "Order canceled", time: "10:00 AM" },
  { icon: BadgeCheck, label: "Payment successful", time: "09:13 PM" },
  { icon: ShoppingCart, label: "3 new order placed", time: "12:24 AM", highlighted: true },
  { icon: BadgeCheck, label: "Payment successful", time: "09:30 PM" },
  { icon: ShoppingCart, label: "2 new orders placed", time: "04:12 PM" },
  { icon: BadgeCheck, label: "Payment successful", time: "03:45 PM" },
];

function StayInformedCard() {
  return (
    <div className="bg-card flex flex-col gap-6 overflow-hidden rounded-xl pb-6">
      <div className="min-h-52 flex-1">
        <div className="relative" role="region" aria-roledescription="carousel">
          <div className="overflow-hidden">
            <div
              className="flex flex-col -mt-1 max-h-52 items-center"
              style={{ transform: "translate3d(0px, -60.99px, 0px)" }}
            >
              {notifications.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className={`min-w-0 shrink-0 grow-0 basis-full w-full max-w-60 cursor-grab pt-1 select-none active:cursor-grabbing ${
                      item.highlighted ? "z-10" : "z-1"
                    }`}
                    role="group"
                    aria-roledescription="slide"
                  >
                    <div
                      className={`bg-background flex items-center gap-3 rounded-md border px-4 py-2 transition-transform duration-500 ${
                        item.highlighted
                          ? "origin-center scale-115 shadow-lg"
                          : "scale-100"
                      }`}
                    >
                      <span className="relative flex shrink-0 overflow-hidden size-9 rounded-sm">
                        <span className="text-muted-foreground flex size-full items-center justify-center bg-primary/10 rounded-sm">
                          <Icon className="text-primary size-6 stroke-1" aria-hidden="true" />
                        </span>
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-muted-foreground text-sm font-light">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="from-card pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b to-transparent" />
          <div className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t to-transparent" />
        </div>
      </div>
      <div className="space-y-2 px-6">
        <h3 className="text-2xl font-semibold">Stay informed</h3>
        <p className="text-muted-foreground text-sm">
          Receive all updates related to your products and users in one place so
          you never miss any information.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 6: Turn Viewers to Orders (dual vertical marquee)
// ---------------------------------------------------------------------------
const viewerItems = [
  { name: "John Doe", date: "12 Nov '25", avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" },
  { name: "Fanny Hansen", date: "28 Oct '25", avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-2.png" },
  { name: "Todd Payne", date: "19 Nov '25", avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-3.png" },
  { name: "Cecilia Manning", date: "3 Dec '25", avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-4.png" },
];

const purchaseItems = [
  { amount: "$149" },
  { amount: "$89" },
  { amount: "$279" },
  { amount: "$325" },
];

function ViewerCard({ name, date, avatar }: { name: string; date: string; avatar: string }) {
  return (
    <div className="bg-card flex items-start gap-3 rounded-md border px-4 py-1.5">
      <span className="relative flex shrink-0 overflow-hidden size-7 rounded-lg">
        <Image className="aspect-square size-full" alt={name} src={avatar} width={28} height={28} />
      </span>
      <div className="flex flex-col">
        <span className="font-medium">Product viewer</span>
        <span className="text-muted-foreground text-sm">{date}</span>
      </div>
    </div>
  );
}

function PurchaseCard({ amount }: { amount: string }) {
  return (
    <div className="bg-card flex items-start gap-3 rounded-md border px-4 py-1.5">
      <span className="relative flex shrink-0 overflow-hidden size-7 rounded-lg">
        <span className="flex size-full items-center justify-center rounded-lg bg-green-600/10 text-xs dark:bg-green-400/10">
          <BadgeCheck className="size-4 text-green-600 dark:text-green-400" aria-hidden="true" />
        </span>
      </span>
      <div className="flex flex-col">
        <span className="font-medium">Product purchased</span>
        <span className="text-muted-foreground text-sm">{amount}</span>
      </div>
    </div>
  );
}

function TurnViewersToOrdersCard() {
  return (
    <div className="bg-card flex flex-col gap-6 overflow-hidden rounded-xl pb-6">
      <div className="relative min-h-97 flex-1">
        {/* Top half: product viewers marquee */}
        <div className="group flex gap-(--marquee-gap) overflow-hidden p-3 flex-col absolute top-0 left-1/2 h-1/2 w-full max-w-60 -translate-x-1/2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`viewers-${i}`} className="flex shrink-0 justify-around gap-(--marquee-gap) [animation-delay:var(--marquee-delay)] animate-marquee-vertical flex-col [animation-direction:reverse]">
              {viewerItems.map((v) => (
                <ViewerCard key={v.name} name={v.name} date={v.date} avatar={v.avatar} />
              ))}
            </div>
          ))}
        </div>

        {/* Bottom half: product purchased marquee */}
        <div className="group flex gap-(--marquee-gap) overflow-hidden p-3 flex-col absolute bottom-0 left-1/2 h-1/2 w-full max-w-60 -translate-x-1/2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`purchases-${i}`} className="flex shrink-0 justify-around gap-(--marquee-gap) [animation-delay:var(--marquee-delay)] animate-marquee-vertical flex-col [animation-direction:reverse]">
              {purchaseItems.map((p, j) => (
                <PurchaseCard key={j} amount={p.amount} />
              ))}
            </div>
          ))}
        </div>

        {/* Blur bands between halves */}
        <div className="from-foreground/[0.07] absolute inset-x-0 bottom-1/2 h-15 w-full -translate-y-10.5 bg-gradient-to-t to-transparent to-60% backdrop-blur-[1.5px]" />
        <div className="from-foreground/[0.07] absolute inset-x-0 top-1/2 h-15 w-full translate-y-10.5 bg-gradient-to-b to-transparent to-60% backdrop-blur-[1.5px]" />

        {/* Curved side shapes */}
        <svg className="absolute top-1/2 left-0 -translate-y-1/2" height="144" width="55" fill="none" viewBox="0 0 55 144" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.4993 19.52C33.2382 26.5336 54.7912 28.9577 54.7912 28.9577V114.495C54.7912 114.495 33.2382 116.92 22.4993 123.933C10.4369 131.811 0 143.453 0 143.453V0C0 0 10.4369 11.642 22.4993 19.52Z" fill="var(--card)" />
        </svg>
        <svg className="absolute top-1/2 right-0 -translate-y-1/2 rotate-y-180" height="144" width="55" fill="none" viewBox="0 0 55 144" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.4993 19.52C33.2382 26.5336 54.7912 28.9577 54.7912 28.9577V114.495C54.7912 114.495 33.2382 116.92 22.4993 123.933C10.4369 131.811 0 143.453 0 143.453V0C0 0 10.4369 11.642 22.4993 19.52Z" fill="var(--card)" />
        </svg>

        {/* Center brand strip */}
        <div className="bg-card absolute inset-x-0 top-1/2 flex h-21.5 w-full -translate-y-1/2 items-center justify-center">
          <div className="text-card-foreground flex items-center gap-3.5">
            <BrandLogo className="size-11.5" id="btn-strip" />
            <span className="text-2xl font-semibold">Build This Now</span>
          </div>
        </div>

        {/* Edge gradients */}
        <div className="from-card pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b to-transparent" />
        <div className="from-card pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent" />
        <div className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t to-transparent" />
        <div className="from-card pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r to-transparent" />
      </div>
      <div className="space-y-2 px-6">
        <h3 className="text-2xl font-semibold">Turn viewers to orders</h3>
        <p className="text-muted-foreground text-sm">
          Have a clear accounts of product reach and orders with options to
          check viewers and orders.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 7: Simplify Product Management (particles canvas)
// ---------------------------------------------------------------------------
function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      o: Math.random() * 0.4 + 0.1,
    }));

    let raf: number;
    function tick() {
      ctx!.clearRect(0, 0, w, h);
      for (const p of particles) {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(128, 128, 128, ${p.o})`;
        ctx!.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
      }
      raf = requestAnimationFrame(tick);
    }
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const cleanup = draw();
    return cleanup;
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
    />
  );
}

function SimplifyProductCard() {
  return (
    <div className="bg-card flex flex-col gap-6 overflow-hidden rounded-xl pb-6">
      <div className="relative min-h-71 flex-1">
        <div className="absolute inset-0">
          <ParticlesCanvas />
        </div>
        <button className="inline-flex shrink-0 items-center justify-center text-sm font-medium transition-all outline-none hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs absolute top-6 left-6 z-10 size-10.5 rounded-full border-white bg-white/50 hover:bg-white/60">
          <Rocket className="size-5" aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-2 px-6">
        <h3 className="text-2xl font-semibold">
          Simplify your product management and scale it with ease
        </h3>
        <p className="text-muted-foreground text-sm">
          Track users, monitor performance, and manage updates without
          complexity. Our platform keeps everything organized so your product
          grows faster, smarter, and with less effort.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 8: Customizable Templates (stacked dashboard images)
// ---------------------------------------------------------------------------
function CustomizableTemplatesCard() {
  return (
    <div className="bg-card flex flex-col gap-6 overflow-hidden rounded-xl pb-6">
      <div className="relative flex min-h-71 flex-1 items-center justify-center overflow-hidden px-6 pt-6">
        <div className="relative w-full" style={{ perspective: "3500px" }}>
          <Image
            className="relative w-full rounded-lg border shadow-lg"
            style={{ transform: "rotateZ(6deg)" }}
            alt="Dashboard template 1"
            src="https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-52.png"
            width={400}
            height={300}
          />
          <Image
            className="absolute inset-0 w-full rounded-lg border shadow-lg"
            style={{ transform: "rotateZ(4deg)" }}
            alt="Dashboard template 2"
            src="https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-53.png"
            width={400}
            height={300}
          />
          <Image
            className="absolute inset-0 w-full rounded-lg border shadow-lg"
            style={{ transform: "rotateZ(2deg)" }}
            alt="Dashboard template 3"
            src="https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-54.png"
            width={400}
            height={300}
          />
          <Image
            className="absolute inset-0 w-full rounded-lg border shadow-lg"
            style={{ transform: "rotateZ(0deg)" }}
            alt="Dashboard template 4"
            src="https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-55.png"
          />
        </div>
        <div className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-15 bg-gradient-to-t to-transparent" />
      </div>
      <div className="space-y-2 px-6">
        <h3 className="text-2xl font-semibold">Customizable Templates</h3>
        <p className="text-muted-foreground text-sm">
          Pre-built page layouts and components that you can customize to match
          your brand and requirements.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 9: Build UI with AI Prompts
// ---------------------------------------------------------------------------
function BuildUIWithAICard() {
  return (
    <div className="bg-card flex flex-col gap-6 overflow-hidden rounded-xl pb-6">
      <div className="relative flex min-h-71 flex-1 items-end overflow-hidden">
        <Image
          className="w-full rounded-t-lg border-x border-t object-cover object-top"
          alt="Product categories"
          src="https://cdn.shadcnstudio.com/ss-assets/blocks/bento-grid/image-60.png"
          width={600}
          height={400}
        />
        <div className="from-card pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent" />
      </div>
      <div className="space-y-4 px-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">Build UI with AI Prompts</h3>
          <p className="text-muted-foreground text-sm">
            Describe what you want to build and let AI generate the components,
            layouts, and styles for you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-background flex flex-1 items-center gap-2 rounded-lg border px-3 py-2">
            <span className="text-muted-foreground text-sm">Make cards small</span>
          </div>
          <button className="bg-primary text-primary-foreground inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium">
            <Sparkles className="size-4" aria-hidden="true" />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 10: Best Technologies (orbiting tech logos)
// ---------------------------------------------------------------------------
const techLogos = [
  { angle: 0, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/react-logo.png?width=28&format=auto", alt: "React Logo", imgClass: "size-7 rounded-full" },
  { angle: 60, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/shadcn-logo.png?width=28&format=auto", alt: "Shadcn Logo", imgClass: "size-7 rounded dark:invert" },
  { angle: 120, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/vite-logo.png?width=26&format=auto", alt: "Vite Logo", imgClass: "size-6.5" },
  { angle: 180, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/nextjs-logo.png?width=28&format=auto", alt: "Next.js Logo", imgClass: "size-7 rounded-full dark:invert" },
  { angle: 240, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/tailwind-logo.png?width=28&format=auto", alt: "Tailwind Logo", imgClass: "w-7 rounded-full" },
  { angle: 300, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/motion-logo.png?width=28&format=auto", alt: "Motion Logo", imgClass: "size-7 rounded-full" },
];

function BestTechnologiesCard() {
  return (
    <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 h-full border-0 shadow-none">
      <div className="flex justify-center px-6">
        <div className="relative flex size-75 shrink-0 items-center justify-center">
          {/* Outer orbit ring */}
          <svg className="pointer-events-none absolute inset-0 size-full" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="50%" fill="none" r="125" stroke="var(--border)" strokeWidth="1" />
          </svg>

          {/* Orbiting tech logos */}
          {techLogos.map((logo) => (
            <div
              key={logo.alt}
              className="animate-orbit absolute flex transform-gpu items-center justify-center rounded-full"
              style={
                {
                  "--duration": 30,
                  "--radius": 125,
                  "--angle": logo.angle,
                } as React.CSSProperties
              }
            >
              <div className="bg-background grid size-13 place-content-center rounded-full border shadow-sm">
                <Image className={logo.imgClass} alt={logo.alt} src={logo.src} width={52} height={52} />
              </div>
            </div>
          ))}

          {/* Inner pulsing circles (stroke only) */}
          <svg className="absolute size-61.5" height="1em" width="1em" fill="none" viewBox="0 0 246 246" xmlns="http://www.w3.org/2000/svg">
            <circle
              cx="123"
              cy="123"
              r="80"
              stroke="var(--border)"
              strokeOpacity="0.8"
              strokeWidth="1.125"
              className="animate-pulse-circle"
              style={{ transformOrigin: "50% 50%", transformBox: "fill-box" as const }}
            />
            <circle
              cx="123"
              cy="123"
              r="50"
              stroke="var(--border)"
              strokeOpacity="1"
              strokeWidth="1.125"
              className="animate-pulse-circle"
              style={{ animationDelay: "0.3s", transformOrigin: "50% 50%", transformBox: "fill-box" as const }}
            />
          </svg>

          {/* Center logo */}
          <BrandLogo className="size-16" id="bl-tech" />

          {/* Bottom gradient */}
          <div className="from-card pointer-events-none absolute inset-x-0 -bottom-1.5 h-10 bg-gradient-to-t from-10% to-transparent" />
        </div>
      </div>
      <div className="space-y-4 px-6">
        <h3 className="text-2xl font-semibold">Best technologies</h3>
        <p className="text-muted-foreground text-lg">
          Experience faster workflows and smoother performance, built with
          the best web technologies.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 11: Built-in Automation Controls (3 sub-cards)
// ---------------------------------------------------------------------------
function BuiltInAutomationCard() {
  return (
    <div className="text-card-foreground flex flex-col gap-6 rounded-xl py-6 bg-muted h-full border-0 shadow-none">
      <div className="flex-1 px-4">
        <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <div className="flex gap-6 px-1 py-7 max-md:flex-col">
            {/* Sub-card 1: Feature list */}
            <div className="flex-1">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 h-full min-w-52 shadow-lg">
                <div className="px-6 flex flex-col items-start gap-4">
                  <BrandLogo className="size-7" id="bl-auto-1" />
                  <div className="bg-muted flex items-center gap-3 rounded-sm p-2">
                    <svg className="size-5 shrink-0" height="24" width="24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                    </svg>
                    <span>Authentication</span>
                  </div>
                  <div className="bg-muted flex items-center gap-3 rounded-sm p-2">
                    <svg className="size-5 shrink-0" height="24" width="24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                    </svg>
                    <span>Desktop size</span>
                  </div>
                  <div className="bg-muted flex items-center gap-3 rounded-sm p-2">
                    <svg className="size-5 shrink-0" height="24" width="24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                    </svg>
                    <span>Payments</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-card 2: Commit timeline */}
            <div className="flex-1">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 h-full min-w-52 pb-0 shadow-lg">
                <div className="flex flex-1 flex-col gap-4 px-4">
                  <div className="flex gap-2">
                    <BrandLogo className="size-7" id="bl-auto-2a" />
                    <Image className="size-7 dark:invert" alt="GitHub Logo" src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/github-icon.png?width=28&format=auto" width={28} height={28} />
                  </div>
                  <div className="relative flex h-full max-h-46 flex-col gap-4 overflow-hidden pt-4 pl-7.5">
                    <span className="bg-border absolute inset-y-0 left-2.75 w-0.5 rounded-full" />
                    {["28, APR", "04, APR", "23, MAR"].map((date) => (
                      <div key={date} className="relative space-y-2">
                        <svg className="absolute top-0.5 -left-7" height="11" width="20" fill="none" viewBox="0 0 20 11" xmlns="http://www.w3.org/2000/svg">
                          <rect height="11" width="20" fill="var(--card)" />
                          <path d="M12.5 5.5C12.5 6.88071 11.3807 8 10 8C8.61929 8 7.5 6.88071 7.5 5.5M12.5 5.5C12.5 4.11929 11.3807 3 10 3C8.61929 3 7.5 4.11929 7.5 5.5M12.5 5.5H17.5M7.5 5.5H2.5" stroke="var(--border)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                        <div className="text-xs">Commits on {date}</div>
                        <div className="bg-muted flex items-center gap-2 rounded-sm p-1.5">
                          <Image className="size-5 shrink-0 dark:invert" alt="GitHub" src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/github-icon.png?width=20&format=auto" width={20} height={20} />
                          <div className="flex-1 space-y-1.5">
                            <div className="bg-card-foreground h-0.75 w-full max-w-20 rounded-full" />
                            <div className="bg-muted-foreground h-0.75 w-full max-w-12.5 rounded-full" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="from-card absolute inset-x-0 top-0 h-4 bg-gradient-to-b to-transparent" />
                    <div className="from-card absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t to-transparent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-card 3: Workflow diagram */}
            <div className="flex-1">
              <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 h-full min-w-52 overflow-hidden shadow-lg">
                <div className="px-6 flex h-full flex-col gap-4">
                  <div className="flex gap-2">
                    <BrandLogo className="size-7" id="bl-auto-3a" />
                    <Image className="size-7" alt="React Logo" src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/react-logo.png?width=28&format=auto" width={28} height={28} />
                  </div>
                  <div className="grid h-full place-content-center">
                    <div className="relative z-1 flex h-full flex-col items-center justify-center">
                      {/* Left icon */}
                      <span className="bg-muted absolute top-1/2 left-0 grid size-9 -translate-x-full -translate-y-1/2 place-content-center rounded-sm">
                        <svg className="size-5 shrink-0" height="24" width="24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
                          <circle cx="13.5" cy="6.5" fill="currentColor" r=".5" />
                          <circle cx="17.5" cy="10.5" fill="currentColor" r=".5" />
                          <circle cx="6.5" cy="12.5" fill="currentColor" r=".5" />
                          <circle cx="8.5" cy="7.5" fill="currentColor" r=".5" />
                        </svg>
                        <span className="outline-border bg-primary absolute top-1/2 right-0 size-1.5 translate-x-1/2 -translate-y-1/2 rounded-full outline-1 outline-offset-1" />
                      </span>
                      {/* Curved connecting lines */}
                      <svg height="45" width="80" fill="none" viewBox="0 0 80 45" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.5 44.5H11.5941C18.9211 44.5 25.7672 40.8523 29.854 34.771L46.3467 10.2289C50.4335 4.14757 57.2796 0.499893 64.6066 0.499893H79.5007" stroke="var(--border)" strokeLinecap="round" />
                      </svg>
                      <svg className="-z-1 rotate-x-180" height="45" width="80" fill="none" viewBox="0 0 80 45" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.5 44.5H11.5941C18.9211 44.5 25.7672 40.8523 29.854 34.771L46.3467 10.2289C50.4335 4.14757 57.2796 0.499893 64.6066 0.499893H79.5007" stroke="var(--border)" strokeLinecap="round" />
                      </svg>
                      {/* Top-right icon */}
                      <span className="bg-muted absolute top-0 right-0 grid size-9 translate-x-full -translate-y-1/2 place-content-center rounded-sm">
                        <svg className="size-5 shrink-0" height="24" width="24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 6V2H8" />
                          <path d="M15 11v2" />
                          <path d="M2 12h2" />
                          <path d="M20 12h2" />
                          <path d="M20 16a2 2 0 0 1-2 2H8.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 4 20.286V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
                          <path d="M9 11v2" />
                        </svg>
                        <span className="outline-border bg-primary absolute top-1/2 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full outline-1 outline-offset-1" />
                        <span className="outline-border bg-primary absolute top-1/2 right-0 size-1.5 translate-x-1/2 -translate-y-1/2 rounded-full outline-1 outline-offset-1" />
                        <span className="bg-border absolute top-1/2 right-0 -z-1 h-px w-8 translate-x-full -translate-y-1/2" />
                      </span>
                      {/* Bottom-right icon */}
                      <span className="bg-muted absolute right-0 bottom-0 grid size-9 translate-x-full translate-y-1/2 place-content-center rounded-sm">
                        <svg className="size-5 shrink-0" height="24" width="24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 12.15V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2h-3.35" />
                          <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                          <path d="m5 16-3 3 3 3" />
                          <path d="m9 22 3-3-3-3" />
                        </svg>
                        <span className="outline-border bg-primary absolute top-1/2 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full outline-1 outline-offset-1" />
                        <span className="outline-border bg-primary absolute top-1/2 right-0 size-1.5 translate-x-1/2 -translate-y-1/2 rounded-full outline-1 outline-offset-1" />
                        <span className="bg-border absolute top-1/2 right-0 -z-1 h-px w-8 translate-x-full -translate-y-1/2" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4 px-6">
        <h3 className="text-2xl font-semibold">Built-in automation controls</h3>
        <p className="text-muted-foreground text-lg">
          Automate handoff and workflow logic with AI-assisted blocks that
          connect your design files to production-ready output.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 12: Ready to Launch (leaf SVG with brand icons)
// ---------------------------------------------------------------------------
function ReadyToLaunchCard() {
  return (
    <div className="text-card-foreground flex flex-col gap-6 rounded-xl py-6 bg-muted h-full border-0 shadow-none">
      <div className="relative flex flex-1 justify-center px-6 py-4">
        <svg
          height="316"
          width="228"
          fill="none"
          viewBox="0 0 228 316"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M147.241 258.834L79.9575 258.503C70.338 237.008 62.9021 214.618 57.7627 191.674C49.7705 157.677 50.589 122.287 60.1405 88.8689C69.692 55.4508 87.6588 25.116 112.332 0.750042C142.983 31.4016 188.145 93.971 169.338 191.661C164.244 214.757 156.841 237.26 147.241 258.834Z"
            fill="var(--card)"
            fillOpacity="0.2"
          />
          <path
            d="M147.241 258.834L79.9575 258.503C70.338 237.008 62.9021 214.618 57.7627 191.674C49.7705 157.677 50.589 122.287 60.1405 88.8689C69.692 55.4508 87.6588 25.116 112.332 0.750042C142.983 31.4016 188.145 93.971 169.338 191.661C164.244 214.757 156.841 237.26 147.241 258.834Z"
            fill="url(#rtl-paint0)"
          />
          <path
            d="M79.9575 258.503L24.1637 314.297C24.1637 314.297 -3.8439 274.015 1.40543 246.904C7.31216 216.656 57.1992 191.11 57.1992 191.11"
            fill="var(--card)"
            fillOpacity="0.2"
          />
          <path
            d="M79.9575 258.503L24.1637 314.297C24.1637 314.297 -3.8439 274.015 1.40543 246.904C7.31216 216.656 57.1992 191.11 57.1992 191.11"
            fill="url(#rtl-paint1)"
          />
          <path
            d="M147.241 258.834L203.585 315.179C203.585 315.179 231.198 275.17 225.683 248.006C219.478 217.699 169.338 191.661 169.338 191.661"
            fill="var(--card)"
            fillOpacity="0.2"
          />
          <path
            d="M147.241 258.834L203.585 315.179C203.585 315.179 231.198 275.17 225.683 248.006C219.478 217.699 169.338 191.661 169.338 191.661"
            fill="url(#rtl-paint2)"
          />
          <path
            d="M147.241 258.834L79.9575 258.503M147.241 258.834C156.841 237.26 164.244 214.757 169.338 191.661M147.241 258.834L203.585 315.179C203.585 315.179 231.198 275.17 225.683 248.006C219.478 217.699 169.338 191.661 169.338 191.661M79.9575 258.503C70.338 237.008 62.9021 214.618 57.7627 191.674C49.7705 157.677 50.5891 122.287 60.1405 88.8689C69.692 55.4508 87.6588 25.116 112.332 0.750041C142.983 31.4016 188.145 93.971 169.338 191.661M79.9575 258.503L24.1637 314.297C24.1637 314.297 -3.8439 274.015 1.40543 246.904C7.31216 216.656 57.1992 191.11 57.1992 191.11"
            stroke="url(#rtl-paint3)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <defs>
            <linearGradient id="rtl-paint0" gradientUnits="userSpaceOnUse" x1="60.4973" x2="203.164" y1="92.5114" y2="213.278">
              <stop stopColor="var(--primary)" stopOpacity="0.4" />
              <stop offset="1" stopColor="var(--card)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rtl-paint1" gradientUnits="userSpaceOnUse" x1="60.4973" x2="203.164" y1="92.5114" y2="213.278">
              <stop stopColor="var(--primary)" stopOpacity="0.4" />
              <stop offset="1" stopColor="var(--card)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rtl-paint2" gradientUnits="userSpaceOnUse" x1="60.4973" x2="203.164" y1="92.5114" y2="213.278">
              <stop stopColor="var(--primary)" stopOpacity="0.4" />
              <stop offset="1" stopColor="var(--card)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rtl-paint3" gradientUnits="userSpaceOnUse" x1="-6.35296" x2="253.678" y1="123.272" y2="299.475">
              <stop stopColor="var(--primary)" />
              <stop offset="1" stopColor="var(--muted)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute bottom-18 flex items-center gap-6">
          <span className="bg-card grid size-12 place-content-center overflow-hidden rounded-full border shadow-[4px_15px_32px_0_rgba(0,0,0,0.40)]">
            <BrandLogo className="size-8" id="bl-rtl" />
          </span>
          <span className="bg-card grid size-12 place-content-center overflow-hidden rounded-full border shadow-[4px_15px_32px_0_rgba(0,0,0,0.40)]">
            <Image className="size-8" alt="React Logo" src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/react-logo.png?width=32&format=auto" width={32} height={32} />
          </span>
          <span className="bg-card grid size-12 place-content-center overflow-hidden rounded-full border shadow-[4px_15px_32px_0_rgba(0,0,0,0.40)]">
            <Image className="size-8 dark:invert" alt="Next.js Logo" src="https://cdn.shadcnstudio.com/ss-assets/brand-logo/nextjs-logo.png?width=32&format=auto" width={32} height={32} />
          </span>
        </div>
      </div>
      <div className="space-y-4 px-6">
        <h3 className="text-2xl font-semibold">Ready to launch, built to scale</h3>
        <p className="text-muted-foreground text-lg">
          Quickly deploy your UI from design to code with AI and
          cloud-ready performance.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 13: Seamless Integrations (orbiting logos)
// ---------------------------------------------------------------------------
const integrationRings = {
  outer: {
    radius: 280,
    duration: 40,
    items: [
      { angle: 0, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/react-logo.png?width=28&format=auto", alt: "React" },
      { angle: 90, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/vite-logo.png?width=28&format=auto", alt: "Vite" },
      { angle: 180, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/react-logo.png?width=28&format=auto", alt: "React 2" },
      { angle: 270, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/vite-logo.png?width=28&format=auto", alt: "Vite 2" },
    ],
  },
  middle: {
    radius: 220,
    duration: 35,
    reverse: true,
    items: [
      { angle: 45, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/figma-icon.png?width=28&format=auto", alt: "Figma" },
      { angle: 135, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/claude-icon.png?width=28&format=auto", alt: "Claude" },
      { angle: 225, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/figma-icon.png?width=28&format=auto", alt: "Figma 2" },
      { angle: 315, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/claude-icon.png?width=28&format=auto", alt: "Claude 2" },
    ],
  },
  inner: {
    radius: 160,
    duration: 30,
    items: [
      { angle: 30, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/laravel-icon.png?width=28&format=auto", alt: "Laravel", imgClass: "" },
      { angle: 120, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/remix-icon.png?width=28&format=auto", alt: "Remix", imgClass: "dark:invert" },
      { angle: 210, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/laravel-icon.png?width=28&format=auto", alt: "Laravel 2", imgClass: "" },
      { angle: 300, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/remix-icon.png?width=28&format=auto", alt: "Remix 2", imgClass: "dark:invert" },
    ],
  },
  innermost: {
    radius: 100,
    duration: 25,
    reverse: true,
    items: [
      { angle: 0, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/nextjs-logo.png?width=28&format=auto", alt: "Next.js", imgClass: "dark:invert" },
      { angle: 180, src: "https://cdn.shadcnstudio.com/ss-assets/brand-logo/nextjs-logo.png?width=28&format=auto", alt: "Next.js 2", imgClass: "dark:invert" },
    ],
  },
};

function SeamlessIntegrationsCard() {
  return (
    <div className="text-card-foreground flex flex-col rounded-xl py-6 bg-muted h-full gap-10 overflow-hidden border-0 pt-0 shadow-none">
      <div className="relative flex h-80 justify-center overflow-hidden">
        <div className="relative flex size-151 flex-col items-center justify-center">
          {/* Rings + orbiting logos */}
          {(
            [
              integrationRings.outer,
              integrationRings.middle,
              integrationRings.inner,
              integrationRings.innermost,
            ] as const
          ).map((ring) => (
            <React.Fragment key={ring.radius}>
              <svg className="pointer-events-none absolute inset-0 size-full" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50%" cy="50%" fill="none" r={ring.radius} stroke="var(--border)" strokeWidth="2" />
              </svg>
              {ring.items.map((item) => (
                <div
                  key={item.alt}
                  className="animate-orbit absolute flex transform-gpu items-center justify-center rounded-full"
                  style={
                    {
                      "--duration": ring.duration,
                      "--radius": ring.radius,
                      "--angle": item.angle,
                      ...("reverse" in ring && ring.reverse
                        ? { animationDirection: "reverse" as const }
                        : {}),
                    } as React.CSSProperties
                  }
                >
                  <span className="bg-card grid size-11 place-content-center overflow-hidden rounded-full">
                    <Image
                      className={`size-7 ${"imgClass" in item && item.imgClass ? item.imgClass : ""}`}
                      alt={item.alt}
                      src={item.src}
                      width={28}
                      height={28}
                    />
                  </span>
                </div>
              ))}
            </React.Fragment>
          ))}
          {/* Center logo */}
          <BrandLogo
            className="absolute top-1/2 left-1/2 z-10 size-16 -translate-x-1/2 -translate-y-[calc(50%+1rem)]"
            id="bl-integrations"
          />
        </div>
        <div className="from-muted pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-20% to-transparent" />
        <div className="from-muted pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l to-transparent" />
        <div className="from-muted pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-20% to-transparent" />
        <div className="from-muted pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r to-transparent" />
      </div>
      <div className="space-y-4 px-6">
        <h3 className="text-2xl font-semibold">Seamless Integrations</h3>
        <p className="text-muted-foreground text-lg">
          Effortlessly connect with design, dev, and deployment tools.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export function BentoGrid() {
  return (
    <section className="bg-muted py-8 sm:py-16 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {/* Column 1: 2 rows */}
        <div className="grid grid-rows-2 gap-6">
          <UserAnalyticsCard />
          <ProductMetricsCard />
        </div>

        {/* Column 2: 3 rows */}
        <div className="grid grid-rows-3 gap-6">
          <CheckOrdersCard />
          <EnterpriseCollaborationCard />
          <StayInformedCard />
        </div>

        {/* Column 3: 2 rows */}
        <div className="grid gap-6 max-md:grid-rows-2 md:max-lg:col-span-2 md:max-lg:grid-cols-2 lg:grid-rows-2">
          <TurnViewersToOrdersCard />
          <SimplifyProductCard />
        </div>

        {/* Full-width cards */}
        <div className="md:col-span-2 lg:col-span-3">
          <CustomizableTemplatesCard />
        </div>
        <div className="md:col-span-2 lg:col-span-3">
          <BuildUIWithAICard />
        </div>

        {/* Best technologies + Ready to launch row */}
        <div className="overflow-hidden md:col-span-2 lg:col-span-2">
          <BestTechnologiesCard />
        </div>
        <div className="overflow-hidden md:col-span-2 lg:col-span-1">
          <ReadyToLaunchCard />
        </div>

        {/* Built-in automation controls — full width */}
        <div className="overflow-hidden md:col-span-2 lg:col-span-3">
          <BuiltInAutomationCard />
        </div>

        {/* Seamless integrations */}
        <div className="overflow-hidden md:col-span-2 lg:col-span-2">
          <SeamlessIntegrationsCard />
        </div>
      </div>
    </section>
  );
}
