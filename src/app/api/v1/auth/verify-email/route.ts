import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyVerifyToken, createToken } from '@/lib/auth';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResponse = rateLimit(request, RATE_LIMITS.auth);
    if (rateLimitResponse) return rateLimitResponse;

    const { token } = await request.json();
    if (!token) {
      return NextResponse.json(
        { error: 'Thiếu token', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    // 1. Verify the email verification token
    const payload = await verifyVerifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn', code: 'INVALID_TOKEN' },
        { status: 400 }
      );
    }

    // 2. Update user to verified
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy user', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json({
        data: { message: 'Email đã được xác thực trước đó' },
      });
    }

    await prisma.user.update({
      where: { id: payload.userId },
      data: { isVerified: true },
    });

    // 3. Create new JWT with updated verification status
    const newToken = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      isVerified: true,
    });

    const response = NextResponse.json({
      data: { message: 'Email đã được xác thực thành công' },
    });
    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[POST /api/v1/auth/verify-email]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
