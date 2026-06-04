import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, canAccess } from '@/lib/auth';

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

// Admin-only routes
const ADMIN_PREFIXES = ['/admin'];

// Coral portal-only routes
const PORTAL_PREFIXES = ['/coral-portal'];

// Auth routes — redirect to dashboard if already logged in
const AUTH_ONLY_ROUTES = ['/dang-nhap', '/dang-ky', '/quen-mat-khau'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Verify token if present
  const user = token ? await verifyToken(token) : null;

  // 1. Auth-only routes (login, register) — redirect to dashboard if logged in
  if (AUTH_ONLY_ROUTES.includes(pathname) && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Protected routes — require authentication
  if (
    PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    if (!user) {
      const loginUrl = new URL('/dang-nhap', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!user.isVerified && pathname.startsWith('/thanh-toan')) {
      // Require email verification before payment
      return NextResponse.redirect(new URL('/verify-email', request.url));
    }
    return NextResponse.next();
  }

  // 3. Admin routes — require admin role
  if (ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!user) {
      const loginUrl = new URL('/dang-nhap', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!canAccess(user.role, 'editor')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 4. Coral portal routes — require coral_staff or admin role
  if (PORTAL_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!user) {
      const loginUrl = new URL('/dang-nhap', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== 'coral_staff' && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 5. Public routes — allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (handled by route handlers)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
