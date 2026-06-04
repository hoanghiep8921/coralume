import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const type = searchParams.get('type') || 'allTime';

    // Build date filter for monthly
    let dateFilter: Record<string, Date> | undefined;
    if (type === 'monthly') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { gte: startOfMonth };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
      role: { in: ['adopter', 'ambassador'] },
    };
    if (dateFilter) {
      whereClause.adoptions = { some: { createdAt: dateFilter } };
    }

    // For monthly: count only adoptions created this month
    const adoptionCountFilter = dateFilter
      ? { where: { createdAt: dateFilter } }
      : true;

    const rankings = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        isPublic: true,
        role: true,
        _count: { select: { adoptions: adoptionCountFilter } },
      },
      orderBy: { adoptions: { _count: 'desc' } },
      take: type === 'monthly' ? 10 : 20,
    });

    const filtered = rankings.filter((u) => u._count.adoptions > 0);
    const result = filtered.map((u, i) => ({ rank: i + 1, ...u }));

    // Current user ranking
    const currentUser = await getCurrentUser();
    let myRanking = null;

    if (currentUser) {
      const allAdopters = await prisma.user.findMany({
        where: { role: { in: ['adopter', 'ambassador'] } },
        select: { id: true, _count: { select: { adoptions: adoptionCountFilter } } },
        orderBy: { adoptions: { _count: 'desc' } },
      });
      const myIndex = allAdopters.findIndex((u) => u.id === currentUser.userId);
      if (myIndex >= 0) {
        const user = await prisma.user.findUnique({
          where: { id: currentUser.userId },
          select: { id: true, fullName: true, isPublic: true, role: true, _count: { select: { adoptions: adoptionCountFilter } } },
        });
        myRanking = { rank: myIndex + 1, ...user };
      }
    }

    return NextResponse.json({
      data: {
        rankings: result,
        myRanking,
        type,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
