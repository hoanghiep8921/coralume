import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';

export async function GET() {
  try {
    await requireAdminOnly();

    const [userCount, coralCount, adoptionCount, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.coral.count(),
      prisma.adoption.count(),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'completed' },
      }),
    ]);

    const activeAdoptions = await prisma.adoption.count({ where: { status: 'active' } });
    const pendingPayments = await prisma.payment.count({ where: { status: 'pending' } });

    return NextResponse.json({
      data: {
        userCount,
        coralCount,
        adoptionCount,
        activeAdoptions,
        revenue: revenue._sum.amount || 0,
        pendingPayments,
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
