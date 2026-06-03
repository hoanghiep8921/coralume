import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validation';
import { hashPassword, createToken, verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 1. Validate input
    const body = await request.json();
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

    // 4. Create JWT and set cookie
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
