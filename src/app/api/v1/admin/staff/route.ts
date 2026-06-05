import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { hashPassword } from '@/lib/auth';
import { logActivity } from '@/lib/activity-log';
import { adminStaffCreateSchema } from '@/lib/validation';

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

    const parsed = adminStaffCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { fullName, email, password } = parsed.data;
    const role = body.role;

    // Validate role separately (not in adminStaffCreateSchema)
    if (!['editor', 'coral_staff'].includes(role)) {
      return NextResponse.json(
        { error: 'Role không hợp lệ. Hỗ trợ: editor, coral_staff' },
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
    logActivity({
      adminId: user.userId,
      action: 'create_staff',
      targetType: 'user',
      targetId: staff.id,
      details: { fullName, email, role },
    });

    return NextResponse.json({ data: staff }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
