import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';

// ============================================================
// POST — assign a coral to an adoption
// ============================================================

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminOnly();
    const { id } = await params;
    const body = await request.json();
    const { coralId } = body;

    if (!coralId) {
      return NextResponse.json({ error: 'Thiếu coralId' }, { status: 400 });
    }

    // Verify adoption exists and is pending
    const adoption = await prisma.adoption.findUnique({
      where: { id },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });

    if (!adoption) return NextResponse.json({ error: 'Không tìm thấy adoption' }, { status: 404 });
    if (adoption.status !== 'pending') {
      return NextResponse.json({ error: 'Adoption này đã được gán san hô' }, { status: 400 });
    }

    // Verify coral exists and is available
    const coral = await prisma.coral.findUnique({ where: { id: coralId } });
    if (!coral) return NextResponse.json({ error: 'Không tìm thấy san hô' }, { status: 404 });
    if (coral.status !== 'available') {
      return NextResponse.json({ error: 'San hô này không khả dụng' }, { status: 400 });
    }

    // Assign coral to adoption in a transaction
    const [updatedAdoption] = await prisma.$transaction([
      prisma.adoption.update({
        where: { id },
        data: {
          coralId,
          status: 'active',
          assignedAt: new Date(),
        },
        include: {
          user: { select: { id: true, fullName: true, email: true } },
          coral: { select: { id: true, code: true, species: true } },
          product: { select: { id: true, name: true } },
        },
      }),
      prisma.coral.update({
        where: { id: coralId },
        data: { status: 'assigned' },
      }),
    ]);

    return NextResponse.json({ data: updatedAdoption });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
