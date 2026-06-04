import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'coral_staff' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const adoptions = await prisma.adoption.findMany({
      where: { status: { in: ['active', 'pending'] } },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        product: { select: { name: true, tier: true } },
        coral: { select: { id: true, code: true, status: true, species: true } },
      },
      orderBy: { adoptedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({ data: adoptions });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
