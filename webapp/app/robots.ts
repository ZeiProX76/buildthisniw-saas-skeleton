import type { MetadataRoute } from "next";

const baseUrl =
  process.env.VERCEL_URL && process.env.VERCEL_URL.length > 0
    ? `https://${process.env.VERCEL_URL}`
    : process.env.PORTLESS_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
