import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { forgotPasswordSchema } from '@/lib/validation';
import { createResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    // 1. Validate input
    const body = await request.json();
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // 2. Find user (always return success to prevent email enumeration)
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal whether email exists
      return NextResponse.json({
        data: { message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu' },
      });
    }

    // 3. Create reset token & send via Resend
    const resetToken = await createResetToken(user.id, user.email);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/dat-lai-mat-khau?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    return NextResponse.json({
      data: { message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu' },
    });
  } catch (error) {
    console.error('[POST /api/v1/auth/forgot-password]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
