/**
 * POST /api/v1/admin/payments/[id]/refund
 *
 * Admin triggers refund for a completed payment.
 * Refund goes through PayOS's refund API.
 * SRS AD-11: "Admin có thể trigger refund qua admin panel."
 *
 * PayOS refund docs: https://payos.vn/docs/api/#tag/hoan-tien
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity-log';
import crypto from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await requireAdminOnly();

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { reason = 'Admin requested refund', amount } = body;

    // 1. Find payment
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        adoption: { select: { id: true, customName: true, productId: true } },
      },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Không tìm thấy giao dịch', code: 'NOT_FOUND' }, { status: 404 });
    }

    if (payment.status !== 'completed') {
      return NextResponse.json(
        { error: 'Chỉ có thể hoàn tiền giao dịch đã hoàn tất', code: 'INVALID_STATUS' },
        { status: 400 }
      );
    }

    // 2. Process refund via PayOS refund API
    const PAYOS_API = 'https://api-merchant.payos.vn/v2';
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY || '';
    const clientId = process.env.PAYOS_CLIENT_ID || '';
    const apiKey = process.env.PAYOS_API_KEY || '';
    const refundAmount = amount || payment.amount;

    // Extract PayOS payment link ID from gatewayTxnId
    // Format: "orderCode|ref:..." — we need the orderCode for PayOS refund
    const orderCode = payment.gatewayTxnId?.split('|')[0] || '';
    if (!orderCode) {
      return NextResponse.json(
        { error: 'Không thể xác định mã giao dịch PayOS', code: 'MISSING_TXN' },
        { status: 400 }
      );
    }

    // Build signature for PayOS refund
    const signData = `amount=${refundAmount}&orderCode=${orderCode}&reason=${reason}`;
    const signature = crypto.createHmac('sha256', checksumKey).update(signData).digest('hex');

    let refundSuccess = false;
    let refundError = '';

    try {
      const refundResponse = await fetch(`${PAYOS_API}/payment-requests/${orderCode}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': clientId,
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          orderCode: Number(orderCode),
          amount: refundAmount,
          reason,
          signature,
        }),
      });

      const refundData = await refundResponse.json();
      refundSuccess = refundData.code === '00';

      if (!refundSuccess) {
        refundError = refundData.desc || 'PayOS refund failed';
      }
    } catch (refundErr) {
      refundError = String(refundErr);
    }

    if (!refundSuccess) {
      return NextResponse.json(
        { error: refundError || 'Không thể hoàn tiền qua PayOS', code: 'REFUND_FAILED' },
        { status: 502 }
      );
    }

    // 3. Update payment + adoption status
    await prisma.$transaction([
      prisma.payment.update({
        where: { id },
        data: {
          status: 'refunded',
          gatewayTxnId: `${payment.gatewayTxnId}|refunded:${refundAmount}`,
        },
      }),
      payment.adoption
        ? prisma.adoption.update({
            where: { id: payment.adoption.id },
            data: { status: 'pending' },
          })
        : prisma.$executeRawUnsafe('SELECT 1'),
    ]);

    // 4. Log activity
    await logActivity({
      adminId: adminUser.userId,
      action: 'REFUND_PAYMENT',
      targetType: 'Payment',
      targetId: id,
      details: {
        refundedAmount: refundAmount,
        user: payment.user.fullName,
        reason,
        previousStatus: 'completed',
      },
    });

    return NextResponse.json({
      data: {
        success: true,
        message: `Đã hoàn ${refundAmount.toLocaleString('vi-VN')} VND cho ${payment.user.fullName}`,
        paymentId: id,
        refundedAmount: refundAmount,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    console.error('[POST /api/v1/admin/payments/[id]/refund]', error);
    return NextResponse.json({ error: 'Lỗi server', code: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
