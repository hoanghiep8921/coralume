import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { registerSchema } from '@/lib/validation';
import { hashPassword, createToken, createVerifyToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    // 1. Validate input
    const body = await request.json();
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { fullName, email, password, phone } = validation.data;

    // 2. Check email uniqueness
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được đăng ký', code: 'CONFLICT' },
        { status: 409 }
      );
    }

    // 3. Hash password & create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        phone: phone || null,
        role: 'adopter',
        isVerified: false,
      },
    });

    // 4. Create email verification token & send via Resend
    const verifyToken = await createVerifyToken(user.id, user.email);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/verify-email?token=${verifyToken}`;
    await sendVerificationEmail(user.email, verifyUrl);

    // 5. Create JWT and set cookie
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
    console.error('[POST /api/v1/auth/register]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
