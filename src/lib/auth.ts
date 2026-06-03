import { SignJWT, jwtVerify, decodeJwt } from 'jose';
import { cookies } from 'next/headers';
import { ROLES } from '@/config/site';
import bcrypt from 'bcryptjs';

// ============================================================
// CONSTANTS
// ============================================================

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production-min-32-chars!!!'
);
const TOKEN_EXPIRY = '30d';
const COOKIE_NAME = 'token';

export type TokenPayload = {
  userId: string;
  email: string;
  role: string;
  isVerified: boolean;
};

// ============================================================
// TOKEN CREATION & VERIFICATION
// ============================================================

export async function createToken(payload: TokenPayload): Promise<string> {
  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    isVerified: payload.isVerified,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string,
      isVerified: payload.isVerified as boolean,
    };
  } catch {
    return null;
  }
}

export function decodeTokenWithoutVerify(token: string): TokenPayload | null {
  try {
    const decoded = decodeJwt(token);
    return {
      userId: decoded.userId as string,
      email: decoded.email as string,
      role: decoded.role as string,
      isVerified: decoded.isVerified as boolean,
    };
  } catch {
    return null;
  }
}

// ============================================================
// COOKIE HELPERS
// ============================================================

export async function getTokenFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token || null;
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  const token = await getTokenFromCookie();
  if (!token) return null;
  return verifyToken(token);
}

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
}

export async function removeTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

// ============================================================
// ROLE CHECKS
// ============================================================

export function hasRole(role: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(role);
}

export const ROLE_HIERARCHY: Record<string, string[]> = {
  [ROLES.VISITOR]: [ROLES.VISITOR],
  [ROLES.ADOPTER]: [ROLES.VISITOR, ROLES.ADOPTER],
  [ROLES.AMBASSADOR]: [ROLES.VISITOR, ROLES.ADOPTER, ROLES.AMBASSADOR],
  [ROLES.EDITOR]: [ROLES.VISITOR, ROLES.EDITOR],
  [ROLES.CORAL_STAFF]: [ROLES.VISITOR, ROLES.CORAL_STAFF],
  [ROLES.ADMIN]: [ROLES.VISITOR, ROLES.ADMIN, ROLES.EDITOR, ROLES.CORAL_STAFF],
};

export function canAccess(userRole: string, requiredRole: string): boolean {
  const allowed = ROLE_HIERARCHY[userRole];
  if (!allowed) return false;
  return allowed.includes(requiredRole);
}

// ============================================================
// PASSWORD HASHING
// ============================================================

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ============================================================
// EMAIL VERIFICATION TOKEN
// ============================================================

export async function createVerifyToken(
  userId: string,
  email: string
): Promise<string> {
  return new SignJWT({ userId, email, type: 'email-verify' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifyVerifyToken(
  token: string
): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.type !== 'email-verify') return null;
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}

// ============================================================
// RESET PASSWORD TOKEN
// ============================================================

export async function createResetToken(
  userId: string,
  email: string
): Promise<string> {
  return new SignJWT({ userId, email, type: 'reset-password' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET);
}

export async function verifyResetToken(
  token: string
): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.type !== 'reset-password') return null;
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    };
  } catch {
    return null;
  }
}
