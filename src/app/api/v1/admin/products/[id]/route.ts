import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity-log';

// ============================================================
// PUT — update product
// ============================================================

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminOnly();
    const { id } = await params;
    const body = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.priceMin !== undefined && { priceMin: body.priceMin }),
        ...(body.priceMax !== undefined && { priceMax: body.priceMax }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.benefits !== undefined && { benefits: body.benefits }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    logActivity({
      adminId: admin.userId,
      action: body.isActive !== undefined
        ? (body.isActive ? 'activate_product' : 'deactivate_product')
        : 'update_product',
      targetType: 'product',
      targetId: product.id,
      details: { name: product.name },
    });

    return NextResponse.json({ data: product });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// ============================================================
// DELETE — delete product
// ============================================================

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminOnly();
    const { id } = await params;

    const existing = await prisma.product.findUnique({ where: { id }, select: { id: true, name: true } });
    if (!existing) return NextResponse.json({ error: 'Không tìm thấy sản phẩm' }, { status: 404 });

    await prisma.product.delete({ where: { id } });

    logActivity({
      adminId: admin.userId,
      action: 'delete_product',
      targetType: 'product',
      targetId: id,
      details: { name: existing.name },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
