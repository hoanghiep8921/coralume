import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    // Top 20 all-time by adoption count
    const allTime = await prisma.user.findMany({
      where: { role: { in: ['adopter', 'ambassador'] } },
      select: {
        id: true,
        fullName: true,
        isPublic: true,
        role: true,
        _count: { select: { adoptions: true } },
      },
      orderBy: { adoptions: { _count: 'desc' } },
      take: 20,
    });

    // Current user ranking (if logged in)
    const currentUser = await getCurrentUser();
    let myRanking = null;

    if (currentUser) {
      const allAdopters = await prisma.user.findMany({
        where: { role: { in: ['adopter', 'ambassador'] } },
        select: { id: true, _count: { select: { adoptions: true } } },
        orderBy: { adoptions: { _count: 'desc' } },
      });
      const myIndex = allAdopters.findIndex((u) => u.id === currentUser.userId);
      if (myIndex >= 0) {
        const user = await prisma.user.findUnique({
          where: { id: currentUser.userId },
          select: { id: true, fullName: true, isPublic: true, role: true, _count: { select: { adoptions: true } } },
        });
        myRanking = { rank: myIndex + 1, ...user };
      }
    }

    return NextResponse.json({
      data: {
        allTime: allTime.map((u, i) => ({ rank: i + 1, ...u })),
        myRanking,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
