import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, canAccess } from '@/lib/auth';
import { ADMIN_PATH, isAdminPath } from '@/lib/admin-path';

// ============================================================
// SECURITY HEADERS
// ============================================================

const SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
};

/** Add security headers to a NextResponse */
function addSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

// ============================================================
// ROUTE PROTECTION PATTERNS
// ============================================================

// Public routes — anyone can access
const PUBLIC_ROUTES = [
  '/',
  '/ve-chung-toi',
  '/san-pham',
  '/blog',
  '/bang-xep-hang',
  '/cong-dong',
  '/lien-he',
  '/dang-nhap',
  '/dang-ky',
  '/quen-mat-khau',
  '/verify-email',
];

// Routes that require authentication
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/thanh-toan',
  '/thanh-cong',
  '/profile',
];

// Admin-only routes — protected by role check below
const ADMIN_PREFIXES = [ADMIN_PATH];

// Coral portal-only routes
const PORTAL_PREFIXES = ['/coral-portal'];

// Auth routes — redirect to dashboard if already logged in
const AUTH_ONLY_ROUTES = ['/dang-nhap', '/dang-ky', '/quen-mat-khau'];

export async function middleware(request: NextRequest) {
  // 0. HTTP → HTTPS redirect (applies to ALL routes including API)
  const proto = request.headers.get('x-forwarded-proto');
  if (proto === 'http') {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = 'https';
    return addSecurityHeaders(NextResponse.redirect(httpsUrl, 301));
  }

  const { pathname } = request.nextUrl;

  // API routes — skip auth checks, apply security headers only
  if (pathname.startsWith('/api')) {
    return addSecurityHeaders(NextResponse.next());
  }

  const token = request.cookies.get('token')?.value;

  // Verify token if present
  const user = token ? await verifyToken(token) : null;

  // 1. Auth-only routes (login, register) — redirect to dashboard if logged in
  if (AUTH_ONLY_ROUTES.includes(pathname) && user) {
    return addSecurityHeaders(NextResponse.redirect(new URL('/dashboard', request.url)));
  }

  // 2. Protected routes — require authentication
  if (
    PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    if (!user) {
      const loginUrl = new URL('/dang-nhap', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return addSecurityHeaders(NextResponse.redirect(loginUrl));
    }
    if (!user.isVerified && pathname.startsWith('/thanh-toan')) {
      // Require email verification before payment
      return addSecurityHeaders(NextResponse.redirect(new URL('/verify-email', request.url)));
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // 3. Admin routes — require admin role (path configurable via NEXT_PUBLIC_ADMIN_PATH)
  if (ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!user) {
      const loginUrl = new URL('/dang-nhap', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return addSecurityHeaders(NextResponse.redirect(loginUrl));
    }
    if (!canAccess(user.role, 'editor')) {
      return addSecurityHeaders(NextResponse.redirect(new URL('/dashboard', request.url)));
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // 4. Coral portal routes — require coral_staff or admin role
  if (PORTAL_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!user) {
      const loginUrl = new URL('/dang-nhap', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return addSecurityHeaders(NextResponse.redirect(loginUrl));
    }
    if (user.role !== 'coral_staff' && user.role !== 'admin') {
      return addSecurityHeaders(NextResponse.redirect(new URL('/dashboard', request.url)));
    }
    return addSecurityHeaders(NextResponse.next());
  }

  // 5. Public routes — allow
  return addSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - static files (by file extension)
     *
     * API routes are now INCLUDED for HTTPS redirect + security headers.
     * Auth logic is skipped for API routes inside the middleware function.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
