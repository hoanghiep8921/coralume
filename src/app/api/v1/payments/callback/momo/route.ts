/**
 * POST /api/v1/payments/callback/momo
 *
 * MoMo IPN callback handler (server-to-server).
 * No auth required — MoMo servers call this endpoint.
 * Signature is verified via HMAC-SHA256.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyMoMoCallback, isMoMoSuccessResponse } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[MoMo callback]', { orderId: body['orderId'], resultCode: body['resultCode'] });

    // 1. Verify signature
    if (!verifyMoMoCallback(body)) {
      console.error('[MoMo callback] Invalid signature');
      return new NextResponse(null, { status: 400 });
    }

    // 2. Check result code
    const resultCode = Number(body['resultCode'] ?? -1);
    const orderId = String(body['orderId'] || '');

    if (!orderId) {
      return new NextResponse(null, { status: 400 });
    }

    // Find payment by requestId (which is the payment UUID)
    const requestId = String(body['requestId'] || '');
    const payment = await prisma.payment.findUnique({
      where: { id: requestId },
    });

    if (!payment) {
      console.error('[MoMo callback] Payment not found for requestId:', requestId);
      return new NextResponse(null, { status: 404 });
    }

    // 3. Update payment and adoption status
    if (isMoMoSuccessResponse(resultCode)) {
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'completed', paidAt: new Date() },
        }),
        prisma.adoption.update({
          where: { id: payment.adoptionId! },
          data: { status: 'active' },
        }),
      ]);
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      });
    }

    // MoMo expects 204 No Content on success
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[POST /api/v1/payments/callback/momo]', error);
    return new NextResponse(null, { status: 500 });
  }
}
