/**
 * POST /api/v1/payments/callback/vnpay
 *
 * VNPay IPN callback handler (server-to-server).
 * No auth required — VNPay servers call this endpoint.
 * Signature is verified via HMAC-SHA512.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyVNPayCallback, isVNPaySuccessResponse } from '@/lib/payment';

export async function POST(request: NextRequest) {
  try {
    // VNPay sends callback as URL-encoded form data
    const body = await request.text();
    const params = Object.fromEntries(new URLSearchParams(body));

    console.log('[VNPay callback]', { txnRef: params['vnp_TxnRef'], responseCode: params['vnp_ResponseCode'] });

    // 1. Verify signature
    if (!verifyVNPayCallback(params)) {
      console.error('[VNPay callback] Invalid signature');
      return new NextResponse('Invalid signature', { status: 400 });
    }

    // 2. Check response code
    const responseCode = params['vnp_ResponseCode'] || '';
    const txnRef = params['vnp_TxnRef'] || '';

    if (!txnRef) {
      return new NextResponse('Missing TxnRef', { status: 400 });
    }

    // Find payment by gatewayTxnId (which is a shortened payment UUID)
    const payment = await prisma.payment.findFirst({
      where: { gatewayTxnId: txnRef },
    });

    if (!payment) {
      console.error('[VNPay callback] Payment not found for txnRef:', txnRef);
      return new NextResponse('Payment not found', { status: 404 });
    }

    // 3. Update payment and adoption status
    if (isVNPaySuccessResponse(responseCode)) {
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

    // VNPay expects "OK" response
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('[POST /api/v1/payments/callback/vnpay]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
