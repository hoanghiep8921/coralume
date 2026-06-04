import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';

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
