import type { MetadataRoute } from "next";
import { buses } from "@/lib/buses";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/buses`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/report`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...buses.map((b) => ({
      url: `${siteUrl}/buses/${b.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
