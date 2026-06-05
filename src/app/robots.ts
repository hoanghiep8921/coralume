import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Robots.txt — SRS §6.1 NFR-003
 * Next.js built-in robots.txt generator.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/coral-portal/",
          "/api/",
          "/dashboard/",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}