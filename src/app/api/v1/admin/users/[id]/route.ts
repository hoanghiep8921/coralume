import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity-log';
import { adminUserUpdateSchema } from '@/lib/validation';

// ============================================================
// GET — user detail with payment history & adoptions
// ============================================================

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminOnly();
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        isActive: true,
        isPublic: true,
        emailNotify: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { adoptions: true, payments: true } },
        payments: {
          select: {
            id: true,
            amount: true,
            method: true,
            status: true,
            gatewayTxnId: true,
            createdAt: true,
            adoption: { select: { id: true, customName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        adoptions: {
          select: {
            id: true,
            customName: true,
            status: true,
            adoptedAt: true,
            assignedAt: true,
            coral: { select: { id: true, code: true, species: true } },
            product: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
    return NextResponse.json({ data: user });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// ============================================================
// PUT — update user (block/unblock, change role)
// ============================================================

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminOnly();
    const { id } = await params;
    const body = await request.json();

    const parsed = adminUserUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const data = parsed.data;

    const updateData: Record<string, unknown> = {};
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.role !== undefined) updateData.role = data.role;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, fullName: true, email: true, role: true, isActive: true },
    });

    // Log activity
    if (body.isActive !== undefined) {
      logActivity({
        adminId: admin.userId,
        action: body.isActive ? 'unblock_user' : 'block_user',
        targetType: 'user',
        targetId: user.id,
        details: { fullName: user.fullName, email: user.email },
      });
    }
    if (body.role) {
      logActivity({
        adminId: admin.userId,
        action: 'change_role',
        targetType: 'user',
        targetId: user.id,
        details: { fullName: user.fullName, newRole: body.role },
      });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// ============================================================
// DELETE — soft delete user (set isActive = false)
// ============================================================

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminOnly();
    const { id } = await params;

    const existing = await prisma.user.findUnique({ where: { id }, select: { id: true, fullName: true, email: true } });
    if (!existing) return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, fullName: true, email: true, isActive: true },
    });

    logActivity({
      adminId: admin.userId,
      action: 'delete_user',
      targetType: 'user',
      targetId: user.id,
      details: { fullName: user.fullName, email: user.email },
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
