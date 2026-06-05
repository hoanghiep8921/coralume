import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity-log';

export async function GET(request: NextRequest) {
  try {
    await requireAdminOnly();

    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const skip = (page - 1) * limit;

    const where = status ? { status: status as 'available' | 'assigned' | 'growing' | 'dead' } : {};

    const [corals, total] = await Promise.all([
      prisma.coral.findMany({
        where,
        include: {
          adoptions: {
            select: { id: true, user: { select: { fullName: true, email: true } }, customName: true },
          },
        },
        orderBy: { code: 'asc' },
        skip,
        take: limit,
      }),
      prisma.coral.count({ where }),
    ]);

    return NextResponse.json({
      data: { corals, total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// ============================================================
// POST — create a new coral
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdminOnly();
    const body = await request.json();

    // Auto-generate code CRL-2026-XXXX
    const year = new Date().getFullYear();
    const count = await prisma.coral.count();
    const code = body.code || `CRL-${year}-${String(count + 1).padStart(4, '0')}`;

    const coral = await prisma.coral.create({
      data: {
        code,
        species: body.species || null,
        locationZone: body.locationZone || null,
        locationGps: body.locationGps || null,
        status: body.status || 'available',
        productTier: body.productTier || 'standard',
      },
    });

    logActivity({
      adminId: admin.userId,
      action: 'create_coral',
      targetType: 'coral',
      targetId: coral.id,
      details: { code: coral.code, species: coral.species, status: coral.status },
    });

    return NextResponse.json({ data: coral }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
