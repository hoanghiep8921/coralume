import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity-log';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminOnly();
    const { id } = await params;
    const body = await request.json();

    // Fetch existing coral for activity log details
    const existing = await prisma.coral.findUnique({
      where: { id },
      select: { code: true, species: true, status: true },
    });
    if (!existing) return NextResponse.json({ error: 'Không tìm thấy san hô' }, { status: 404 });

    const coral = await prisma.coral.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.species && { species: body.species }),
        ...(body.locationZone && { locationZone: body.locationZone }),
      },
    });

    logActivity({
      adminId: admin.userId,
      action: 'update_coral',
      targetType: 'coral',
      targetId: coral.id,
      details: {
        code: coral.code,
        previousStatus: existing.status,
        newStatus: coral.status,
        speciesChanged: existing.species !== coral.species,
      },
    });

    return NextResponse.json({ data: coral });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
