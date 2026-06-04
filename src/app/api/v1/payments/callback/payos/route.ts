/**
 * POST /api/v1/payments/callback/payos
 *
 * PayOS webhook handler — PayOS sends payment confirmation via POST.
 * No auth required — PayOS servers call this endpoint.
 * MUST always return 2XX per PayOS spec (https://payos.vn/docs/du-lieu-tra-ve/webhook/).
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPayOSWebhook, isPayOSSuccess } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    // Parse body — handle both JSON and empty body gracefully
    let body: Record<string, unknown> = {};
    try {
      const text = await request.text();
      if (text) body = JSON.parse(text);
    } catch {
      // Body is empty or not JSON — this is a test ping
      console.log('[PayOS webhook] Test ping (empty body) — returning 200 OK');
      return NextResponse.json({ success: true });
    }

    const data = body['data'] as Record<string, unknown> | undefined;

    // Test ping: no data payload — return 200 OK
    if (!data || !data['orderCode']) {
      console.log('[PayOS webhook] Test ping (no data/orderCode) — returning 200 OK');
      return NextResponse.json({ success: true });
    }

    const orderCode = String(data['orderCode']);
    console.log('[PayOS webhook] Received callback for orderCode:', orderCode);

    // Verify signature if present
    const receivedSignature = body['signature'] as string | undefined;
    if (receivedSignature) {
      if (!verifyPayOSWebhook(data, receivedSignature)) {
        console.error('[PayOS webhook] Invalid signature for orderCode:', orderCode);
        // Return 200 anyway — PayOS will retry if we return non-2XX
        return NextResponse.json({ success: true });
      }
    }

    // Find payment by orderCode stored in gatewayTxnId
    const payment = await prisma.payment.findFirst({
      where: { gatewayTxnId: orderCode },
    });

    if (!payment) {
      console.error('[PayOS webhook] Payment not found for orderCode:', orderCode);
      return NextResponse.json({ success: true });
    }

    // Skip if already completed (idempotent)
    if (payment.status === 'completed') {
      return NextResponse.json({ success: true });
    }

    // Update payment and adoption
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
      console.log('[PayOS webhook] Payment completed:', orderCode);
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      });
      console.log('[PayOS webhook] Payment failed:', orderCode);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[POST /api/v1/payments/callback/payos]', error);
    // Still return 200 — PayOS docs say any non-2XX triggers retry
    return NextResponse.json({ success: true });
  }
}
