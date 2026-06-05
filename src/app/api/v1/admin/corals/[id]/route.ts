import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity-log';
import { adminCoralUpdateSchema } from '@/lib/validation';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminOnly();
    const { id } = await params;
    const body = await request.json();

    const parsed = adminCoralUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const data = parsed.data;

    // Fetch existing coral for activity log details
    const existing = await prisma.coral.findUnique({
      where: { id },
      select: { code: true, species: true, status: true },
    });
    if (!existing) return NextResponse.json({ error: 'Không tìm thấy san hô' }, { status: 404 });

    const updateData: Record<string, unknown> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.species !== undefined) updateData.species = data.species;
    if (data.locationZone !== undefined) updateData.locationZone = data.locationZone;
    if (data.locationGps !== undefined) updateData.locationGps = data.locationGps;

    const coral = await prisma.coral.update({
      where: { id },
      data: updateData,
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
