import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';

// ============================================================
// GET — detailed analytics
// ============================================================

export async function GET() {
  try {
    await requireAdminOnly();

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Basic counts
    const [userCount, coralCount, adoptionCount, revenueResult] = await Promise.all([
      prisma.user.count(),
      prisma.coral.count(),
      prisma.adoption.count(),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'completed' } }),
    ]);

    const totalRevenue = revenueResult._sum.amount || 0;

    // Conversion rate: visitors who became adopters
    const totalVisitors = await prisma.user.count();
    const adopters = await prisma.user.count({ where: { role: { in: ['adopter', 'ambassador'] } } });
    const conversionRate = totalVisitors > 0 ? Math.round((adopters / totalVisitors) * 1000) / 10 : 0;

    // Revenue by product tier (from completed payments via adoptions)
    const revenueByTier = await prisma.adoption.groupBy({
      by: ['productId'],
      _count: true,
      where: { status: { in: ['active', 'completed'] } },
    });

    const products = await prisma.product.findMany({ select: { id: true, name: true, tier: true } });
    const tierRevenue = products.map((p) => {
      const count = revenueByTier.find((r) => r.productId === p.id)?._count || 0;
      return { name: p.name, tier: p.tier, adoptions: count };
    });

    // User growth by month (last 6 months)
    const userGrowth: { month: string; newUsers: number; totalUsers: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const year = now.getFullYear();
      const month = now.getMonth() - i;
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 1);
      const label = `${startOfMonth.getFullYear()}-${String(startOfMonth.getMonth() + 1).padStart(2, '0')}`;

      const [newUsers, totalUpTo] = await Promise.all([
        prisma.user.count({ where: { createdAt: { gte: startOfMonth, lt: endOfMonth } } }),
        prisma.user.count({ where: { createdAt: { lt: endOfMonth } } }),
      ]);

      userGrowth.push({ month: label, newUsers, totalUsers: totalUpTo });
    }

    // Adoption by status
    const [pendingAdoptions, activeAdoptions, completedAdoptions] = await Promise.all([
      prisma.adoption.count({ where: { status: 'pending' } }),
      prisma.adoption.count({ where: { status: 'active' } }),
      prisma.adoption.count({ where: { status: 'completed' } }),
    ]);

    // Payment by method
    const paymentsByMethod = await prisma.payment.groupBy({
      by: ['method'],
      _count: true,
      _sum: { amount: true },
      where: { status: 'completed' },
    });

    // Monthly trend (last 6 months — reuse from dashboard pattern)
    const monthlyTrend: { month: string; adoptions: number; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const year = now.getFullYear();
      const month = now.getMonth() - i;
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 1);
      const label = `${startOfMonth.getFullYear()}-${String(startOfMonth.getMonth() + 1).padStart(2, '0')}`;

      const [monthAdoptions, monthRevenue] = await Promise.all([
        prisma.adoption.count({ where: { createdAt: { gte: startOfMonth, lt: endOfMonth } } }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: 'completed', createdAt: { gte: startOfMonth, lt: endOfMonth } },
        }),
      ]);

      monthlyTrend.push({ month: label, adoptions: monthAdoptions, revenue: monthRevenue._sum.amount || 0 });
    }

    return NextResponse.json({
      data: {
        overview: {
          userCount,
          coralCount,
          adoptionCount,
          totalRevenue,
          conversionRate,
          adopters,
        },
        adoptionStatus: { pending: pendingAdoptions, active: activeAdoptions, completed: completedAdoptions },
        revenueByTier: tierRevenue,
        paymentsByMethod: paymentsByMethod.map((p) => ({
          method: p.method,
          count: p._count,
          total: p._sum.amount || 0,
        })),
        userGrowth,
        monthlyTrend,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
