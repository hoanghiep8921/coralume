import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, verifyToken } from '@/lib/auth';
import { updateProfileSchema } from '@/lib/validation';
import { getTokenFromCookie } from '@/lib/auth';

// GET /api/v1/me — Get current user profile
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isVerified: true,
        isPublic: true,
        emailNotify: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: profile });
  } catch (error) {
    console.error('[GET /api/v1/me]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}

// PUT /api/v1/me — Update current user profile
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.userId },
      data: validation.data,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        role: true,
        isVerified: true,
        isPublic: true,
        emailNotify: true,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('[PUT /api/v1/me]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
