/**
 * POST /api/v1/payments/callback/payos
 *
 * PayOS webhook handler — PayOS sends payment confirmation via POST.
 * No auth required — PayOS servers call this endpoint.
 * Signature verified via HMAC-SHA256 with PayOS checksum key.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPayOSWebhook, isPayOSSuccess } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const receivedSignature = body['signature'] as string | undefined;
    const data = body['data'];

    if (!receivedSignature || !data) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    console.log('[PayOS webhook]', {
      orderCode: data['orderCode'],
      success: body['success'],
    });

    // 1. Verify signature over data object
    if (!verifyPayOSWebhook(data, receivedSignature)) {
      console.error('[PayOS webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 2. Find payment by orderCode (stored in gatewayTxnId)
    const orderCode = String(data['orderCode'] || '');
    if (!orderCode) {
      return NextResponse.json({ error: 'Missing orderCode' }, { status: 400 });
    }

    const payment = await prisma.payment.findFirst({
      where: { gatewayTxnId: orderCode },
    });

    if (!payment) {
      console.error('[PayOS webhook] Payment not found for orderCode:', orderCode);
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    // 3. Prevent duplicate processing
    if (payment.status === 'completed') {
      return NextResponse.json({ success: true });
    }

    // 4. Update payment and adoption status
    if (isPayOSSuccess(body)) {
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/v1/payments/callback/payos]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
