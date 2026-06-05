import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Sitemap — SRS §6.1 NFR-003
 * Next.js built-in sitemap generator.
 * Lists all public-facing pages for search engines.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticRoutes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/san-pham", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/ve-chung-toi", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/cong-dong", priority: 0.7, changeFrequency: "daily" as const },
    { path: "/bang-xep-hang", priority: 0.7, changeFrequency: "daily" as const },
    { path: "/lien-he", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/dang-nhap", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/dang-ky", priority: 0.5, changeFrequency: "monthly" as const },
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
