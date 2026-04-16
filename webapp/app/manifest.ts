import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Build This Now",
    short_name: "BuildThisNow",
    description:
      "Get a validated business idea every morning with market research, a step-by-step build plan, and starter templates.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#3B82F6",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
