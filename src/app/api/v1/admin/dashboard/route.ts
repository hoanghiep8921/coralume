import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';

export async function GET() {
  try {
    await requireAdminOnly();

    const [userCount, coralCount, adoptionCount, revenue, activeAdoptions, pendingPayments] = await Promise.all([
      prisma.user.count(),
      prisma.coral.count(),
      prisma.adoption.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'completed' },
      }),
      prisma.adoption.count({ where: { status: 'active' } }),
      prisma.payment.count({ where: { status: 'pending' } }),
    ]);

    // Build monthly trend for last 6 months
    const now = new Date();
    const monthlyTrend: { month: string; adoptions: number; revenue: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const year = now.getFullYear();
      const month = now.getMonth() - i;
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 1);

      const [monthAdoptions, monthRevenue] = await Promise.all([
        prisma.adoption.count({
          where: { createdAt: { gte: startOfMonth, lt: endOfMonth } },
        }),
        prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: 'completed',
            createdAt: { gte: startOfMonth, lt: endOfMonth },
          },
        }),
      ]);

      monthlyTrend.push({
        month: `${startOfMonth.getFullYear()}-${String(startOfMonth.getMonth() + 1).padStart(2, '0')}`,
        adoptions: monthAdoptions,
        revenue: monthRevenue._sum.amount || 0,
      });
    }

    return NextResponse.json({
      data: {
        userCount,
        coralCount,
        adoptionCount,
        activeAdoptions,
        revenue: revenue._sum.amount || 0,
        pendingPayments,
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
