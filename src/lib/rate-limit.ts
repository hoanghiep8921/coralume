import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================
// IN-MEMORY RATE LIMITER
// ============================================================
// Uses a simple sliding window in memory.
// For production, replace with Upstash Redis:
//   https://upstash.com/docs/redis/sdks/ratelimit-ts/algorithms

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

/**
 * Rate limit configuration for different endpoint types
 */
interface RateLimitConfig {
  /** Max requests allowed in the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

/** Predefined rate limit tiers */
export const RATE_LIMITS = {
  /** Login/register — prevent brute force */
  auth: { maxRequests: 5, windowSeconds: 60 },
  /** Password reset / 2FA — very sensitive */
  authStrict: { maxRequests: 3, windowSeconds: 60 },
  /** Payment/order creation */
  payment: { maxRequests: 10, windowSeconds: 60 },
  /** General API write operations */
  write: { maxRequests: 30, windowSeconds: 60 },
  /** Contact form / newsletter */
  form: { maxRequests: 3, windowSeconds: 60 },
  /** File upload */
  upload: { maxRequests: 10, windowSeconds: 60 },
} as const satisfies Record<string, RateLimitConfig>;

/**
 * Get client IP from request headers
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return '127.0.0.1';
}

/**
 * Apply rate limiting to a request.
 *
 * @returns NextResponse with 429 if rate limited, null if allowed
 */
export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  identifier?: string
): NextResponse | null {
  cleanup();

  const ip = getClientIp(request);
  const key = `rl:${identifier || 'default'}:${ip}`;
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  const existing = store.get(key);

  if (!existing || now > existing.resetAt) {
    // New window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  existing.count++;

  if (existing.count > config.maxRequests) {
    const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
    return new NextResponse(
      JSON.stringify({ error: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(config.maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(existing.resetAt / 1000)),
        },
      }
    );
  }

  return null;
}

/**
 * Apply rate limiting by user ID (for authenticated endpoints).
 * Falls back to IP-based if no userId provided.
 */
export function rateLimitByUser(
  request: NextRequest,
  config: RateLimitConfig,
  userId?: string
): NextResponse | null {
  return rateLimit(request, config, userId || `ip:${getClientIp(request)}`);
}
