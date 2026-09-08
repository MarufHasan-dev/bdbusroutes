/**
 * Canonical public URL of the site.
 * Set NEXT_PUBLIC_SITE_URL to the real domain when deploying
 * (e.g. https://bdbuses.com). Used for sitemap, robots, canonical
 * links and Open Graph tags.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bdbusroutes.vercel.app";

export const siteName = "BD Bus Routes";
