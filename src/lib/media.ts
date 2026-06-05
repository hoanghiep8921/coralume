// ============================================================
// MEDIA HELPERS — Free CDN via Next.js
// ============================================================
//
// Images in public/ are served by Next.js static file serving.
// When deployed to Vercel, they're auto-distributed via global CDN.
//
// next/image provides (free, built-in):
//   - Automatic WebP/AVIF conversion
//   - Responsive srcset generation
//   - Lazy loading + blur-up placeholder
//   - Cache-Control: public, max-age=31536000, immutable
//
// For user-uploaded media at scale, swap with Cloudinary free tier:
//   https://cloudinary.com/pricing (25 GB storage, 25 GB bandwidth)

/**
 * Resolve a media path to a full URL.
 * Paths starting with http(s):// are returned as-is (external CDN).
 * Paths starting with / are served from Next.js public/ directory.
 */
export function resolveMediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return path;
}

/**
 * Product tier → placeholder image path.
 * SVG placeholders: tiny (< 2 KB), scalable, ocean-themed.
 * Replace with real photos when CLB provides them.
 */
export function getProductPlaceholder(slug: string): string {
  const map: Record<string, string> = {
    'seed-coral': '/images/placeholders/seed-coral.svg',
    'reef-guardian': '/images/placeholders/reef-guardian.svg',
    'diving-experience': '/images/placeholders/diving-experience.svg',
  };
  return map[slug] || '/images/placeholders/seed-coral.svg';
}
