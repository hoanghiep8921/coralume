import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'coral_staff' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Corals needing updates (assigned/growing, no update in 30+ days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [needUpdate, recentlyUpdated, totalAssigned] = await Promise.all([
      prisma.coral.count({
        where: {
          status: { in: ['assigned', 'growing'] },
          adoptions: { some: { status: 'active' } },
          updates: { none: { createdAt: { gte: thirtyDaysAgo } } },
        },
      }),
      prisma.coral.findMany({
        where: {
          status: { in: ['assigned', 'growing', 'available'] },
          adoptions: { some: { status: 'active' } },
        },
        include: {
          updates: { orderBy: { createdAt: 'desc' }, take: 1 },
          adoptions: {
            where: { status: 'active' },
            select: { id: true, customName: true, user: { select: { fullName: true } } },
          },
        },
        orderBy: { code: 'asc' },
        take: 30,
      }),
      prisma.coral.count({ where: { status: { in: ['assigned', 'growing'] } } }),
    ]);

    return NextResponse.json({
      data: {
        needUpdate,
        totalAssigned,
        corals: recentlyUpdated,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
