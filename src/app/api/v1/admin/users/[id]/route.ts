import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminOnly();
    const { id } = await params;
    const body = await request.json();

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.role && { role: body.role }),
      },
      select: { id: true, fullName: true, email: true, role: true, isActive: true },
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
