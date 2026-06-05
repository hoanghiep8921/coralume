import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validation';
import { createToken, verifyPassword } from '@/lib/auth';
import { userNeedsTotpChallenge } from '@/lib/two-factor';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production-min-32-chars!!!'
);

/**
 * Create a short-lived 2FA challenge token (5 min expiry).
 */
async function createTotpChallengeToken(userId: string): Promise<string> {
  return new SignJWT({ userId, type: '2fa-challenge' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(JWT_SECRET);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResponse = rateLimit(request, RATE_LIMITS.auth);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();

    // 1. Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // 2. Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // 3. Verify password
    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng', code: 'INVALID_CREDENTIALS' },
        { status: 401 }
      );
    }

    // 4. Check if 2FA is required
    const needs2FA = await userNeedsTotpChallenge(user.id);
    if (needs2FA) {
      const challengeToken = await createTotpChallengeToken(user.id);
      return NextResponse.json({
        data: {
          requires2FA: true,
          challengeToken,
          message: 'Vui lòng nhập mã xác thực 2 lớp từ ứng dụng Authenticator.',
        },
      });
    }

    // 5. Create JWT and set cookie (no 2FA)
    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

    const response = NextResponse.json({
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[POST /api/v1/auth/login]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
