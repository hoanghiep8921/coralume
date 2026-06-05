import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ============================================================
  // Admin path rewrite (SRS §4.10 — security through obscurity)
  // Set NEXT_PUBLIC_ADMIN_PATH env var to customize admin URL.
  // Example: NEXT_PUBLIC_ADMIN_PATH=/quan-ly-he-thong-2026
  // ============================================================
  async rewrites() {
    const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH;
    if (adminPath && adminPath !== '/admin') {
      return {
        beforeFiles: [
          {
            source: `${adminPath}/:path*`,
            destination: '/admin/:path*',
          },
        ],
      };
    }
    return [];
  },

  // ============================================================
  // Security Headers (SRS NFR-020: HTTPS, XSS, Clickjack, MIME)
  // ============================================================
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // HSTS — enforce HTTPS for 2 years, include subdomains
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Content Security Policy — defense-in-depth XSS protection
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https: http:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.coralume.vn https://*.google-analytics.com https://www.facebook.com",
              "frame-src 'self' https://www.google.com https://www.facebook.com",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },
        ],
      },
      // Cache static assets for 1 year
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
