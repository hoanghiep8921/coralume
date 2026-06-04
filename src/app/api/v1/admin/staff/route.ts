import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';

// GET /api/v1/admin/staff — List staff accounts (editor, coral_staff)
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    const where: Record<string, unknown> = {
      role: { in: ['editor', 'coral_staff'] },
    };

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role && ['editor', 'coral_staff'].includes(role)) {
      where.role = role;
    }

    const staff = await prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        _count: { select: { blogPosts: true, coralUpdates: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: staff });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// POST /api/v1/admin/staff — Create a new staff account
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { fullName, email, password, role } = body;

    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Thiếu thông tin: fullName, email, password, role' },
        { status: 400 }
      );
    }

    if (!['editor', 'coral_staff'].includes(role)) {
      return NextResponse.json(
        { error: 'Role không hợp lệ. Hỗ trợ: editor, coral_staff' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Mật khẩu tối thiểu 8 ký tự' },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const staff = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role,
        isVerified: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    // Log activity
    await prisma.adminActivityLog.create({
      data: {
        adminId: user.userId,
        action: 'create_staff',
        targetType: 'user',
        targetId: staff.id,
        details: { fullName, email, role },
      },
    });

    return NextResponse.json({ data: staff }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
