// PROTECTED — APPEND ONLY. Add providers by wrapping children; do not modify existing providers or metadata.
import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryProvider } from "@/lib/query/provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { IntlProvider } from "./intl-provider";
import "./globals.css";

const defaultUrl =
  process.env.VERCEL_URL && process.env.VERCEL_URL.length > 0
    ? `https://${process.env.VERCEL_URL}`
    : process.env.PORTLESS_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Build This Now",
    template: "%s | Build This Now",
  },
  description:
    "Get a validated business idea every morning with market research, a step-by-step build plan, and starter templates. Join 12,000+ builders shipping weekly.",
  keywords: [
    "MVP",
    "startup ideas",
    "build plan",
    "side project",
    "ship fast",
    "SaaS",
    "indie hacker",
    "solopreneur",
  ],
  authors: [{ name: "Build This Now" }],
  creator: "Build This Now",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Build This Now",
    title: "Build This Now — Ship Your Next MVP in 48 Hours",
    description:
      "Get a validated business idea every morning with market research, a step-by-step build plan, and starter templates.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build This Now — Ship Your Next MVP in 48 Hours",
    description:
      "Get a validated business idea every morning with market research, a step-by-step build plan, and starter templates.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NuqsAdapter>
            <QueryProvider>
              <TooltipProvider>
                <Suspense>
                  <IntlProvider>
                    {children}
                  </IntlProvider>
                </Suspense>
              </TooltipProvider>
            </QueryProvider>
          </NuqsAdapter>
        </ThemeProvider>
        <Toaster richColors closeButton />
        <Analytics />
      </body>
    </html>
  );
}
