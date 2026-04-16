import type { MetadataRoute } from "next";

const baseUrl =
  process.env.VERCEL_URL && process.env.VERCEL_URL.length > 0
    ? `https://${process.env.VERCEL_URL}`
    : process.env.PORTLESS_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/landing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/sign-up`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
