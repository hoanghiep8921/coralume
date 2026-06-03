/**
 * GET /api/v1/payments/[id]/status
 *
 * Poll payment status. Auth required (user must own the payment).
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        adoptionId: true,
        amount: true,
        method: true,
        status: true,
        paidAt: true,
        adoption: {
          select: {
            id: true,
            customName: true,
            status: true,
            product: { select: { name: true, tier: true } },
          },
        },
      },
    });

    if (!payment || payment.userId !== currentUser.userId) {
      return NextResponse.json(
        { error: 'Không tìm thấy thanh toán', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: payment });
  } catch (error) {
    console.error('[GET /api/v1/payments/status]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
