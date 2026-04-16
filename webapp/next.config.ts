import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { createMDX } from "fumadocs-mdx/next";

const isDev = process.env.NODE_ENV === "development";

const devLocal = isDev ? " http://*.localhost:*" : "";

const ContentSecurityPolicy = `
  default-src 'self'${devLocal};
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://challenges.cloudflare.com https://va.vercel-scripts.com${isDev ? " https://cdn.jsdelivr.net" : ""}${devLocal};
  worker-src 'self' blob:;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://cdn.shadcnstudio.com https://*.supabase.co https://*.loom.com https://lh3.googleusercontent.com https://*.public.blob.vercel-storage.com;
  font-src 'self';
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.ingest.sentry.io https://va.vercel-scripts.com https://us.i.posthog.com https://eu.i.posthog.com${devLocal};
  frame-src 'self' https://js.stripe.com https://challenges.cloudflare.com https://www.loom.com${devLocal};
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';${isDev ? "" : "\n  upgrade-insecure-requests;"}
`;

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, "").replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shadcnstudio.com',
      },
    ],
  },
  turbopack: {
    // Prevent Turbopack from using ~/bun.lock as workspace root
    // which causes .env to be loaded from ~ instead of webapp/
    root: '..',
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX();

export default withSentryConfig(withMDX(withNextIntl(nextConfig)), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "topr",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
