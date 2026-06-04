/**
 * GET /api/v1/adoptions
 * GET /api/v1/adoptions/[id]
 *
 * Auth required (JWT cookie). User can only access their own adoptions.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const adoptions = await prisma.adoption.findMany({
      where: { userId: currentUser.userId },
      include: {
        product: { select: { name: true, tier: true } },
        coral: {
          select: {
            id: true,
            code: true,
            species: true,
            status: true,
            locationZone: true,
          },
        },
        certificate: { select: { id: true, pdfUrl: true } },
      },
      orderBy: { adoptedAt: 'desc' },
    });

    return NextResponse.json({ data: adoptions });
  } catch (error) {
    console.error('[GET /api/v1/adoptions]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
