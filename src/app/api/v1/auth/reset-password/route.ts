import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { resetPasswordSchema } from '@/lib/validation';
import { verifyResetToken, hashPassword } from '@/lib/auth';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResponse = rateLimit(request, RATE_LIMITS.authStrict);
    if (rateLimitResponse) return rateLimitResponse;

    // 1. Validate input
    const body = await request.json();
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { token, password } = body;

    // 2. Verify reset token
    const payload = await verifyResetToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn (15 phút)', code: 'INVALID_TOKEN' },
        { status: 400 }
      );
    }

    // 3. Update password
    const passwordHash = await hashPassword(password);
    await prisma.user.update({
      where: { id: payload.userId },
      data: { passwordHash },
    });

    return NextResponse.json({
      data: { message: 'Mật khẩu đã được đặt lại thành công' },
    });
  } catch (error) {
    console.error('[POST /api/v1/auth/reset-password]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
