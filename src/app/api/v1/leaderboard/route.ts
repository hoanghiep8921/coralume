import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// ============================================================
// GET — Leaderboard rankings (monthly / all-time)
// ============================================================

interface RankingEntry {
  rank: number;
  id: string;
  fullName: string;
  avatarUrl: string | null;
  isPublic: boolean;
  role: string;
  _count: { adoptions: number };
}

interface LeaderboardResponse {
  rankings: RankingEntry[];
  myRanking: (RankingEntry & { nextRankGap: number | null }) | null;
  type: string;
}

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

    // Count filter: only count adoptions in the target period
    const adoptionCountFilter = dateFilter
      ? { where: { createdAt: dateFilter } }
      : true;

    const limit = type === 'monthly' ? 10 : 20;

    const rankings = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        isPublic: true,
        role: true,
        _count: { select: { adoptions: adoptionCountFilter } },
      },
      orderBy: { adoptions: { _count: 'desc' } },
      take: limit,
    });

    // Filter out users with 0 adoptions in the period
    const filtered = rankings.filter((u) => u._count.adoptions > 0);
    const result: RankingEntry[] = filtered.map((u, i) => ({ rank: i + 1, ...u }));

    // ============================================================
    // Current user ranking
    // ============================================================
    const currentUser = await getCurrentUser();
    let myRanking: (RankingEntry & { nextRankGap: number | null }) | null = null;

    if (currentUser) {
      const allAdopters = await prisma.user.findMany({
        where: { role: { in: ['adopter', 'ambassador'] } },
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          isPublic: true,
          role: true,
          _count: { select: { adoptions: adoptionCountFilter } },
        },
        orderBy: { adoptions: { _count: 'desc' } },
      });

      const myIndex = allAdopters.findIndex((u) => u.id === currentUser.userId);
      if (myIndex >= 0) {
        const myEntry = allAdopters[myIndex];
        const myRank = myIndex + 1;
        const myCount = myEntry._count.adoptions;

        // Calculate gap to next rank: how many more to surpass the person above
        let nextRankGap: number | null = null;
        if (myIndex > 0) {
          const above = allAdopters[myIndex - 1];
          const aboveCount = above._count.adoptions;
          nextRankGap = aboveCount - myCount + 1; // need 1 more to surpass
        }
        // If at rank 1, gap is null (already top)

        myRanking = {
          rank: myRank,
          id: myEntry.id,
          fullName: myEntry.fullName,
          avatarUrl: myEntry.avatarUrl,
          isPublic: myEntry.isPublic,
          role: myEntry.role,
          _count: { adoptions: myCount },
          nextRankGap,
        };
      }
    }

    const response: LeaderboardResponse = {
      rankings: result,
      myRanking,
      type,
    };

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error('[Leaderboard] Error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
