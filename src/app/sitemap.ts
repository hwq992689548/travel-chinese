import type { MetadataRoute } from "next";
import { SCENES } from "@/lib/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  return [
    { url: `${site}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${site}/learn`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...SCENES.map((scene) => ({
      url: `${site}/learn/${scene.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: `${site}/privacy`, lastModified: now, priority: 0.2 },
    { url: `${site}/refund`, lastModified: now, priority: 0.2 },
  ];
}
