/**
 * POST /api/v1/payments/callback/payos
 *
 * PayOS Webhook Handler — per https://payos.vn/docs/du-lieu-tra-ve/webhook/
 *
 * PayOS sends a POST with JSON body containing:
 *   { code, desc, success, data: { orderCode, amount, ... }, signature }
 *
 * Signature is HMAC-SHA256 over the alphabetically-sorted `data` object.
 * MUST always return 2XX to confirm receipt.
 *
 * Trace logs are written to console and stored in the Payment record.
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// === ALL HTTP methods return 200 OK (PayOS uses various methods for verification) ===
export async function GET()    { return NextResponse.json({ success: true }); }
export async function HEAD()   { return new NextResponse(null, { status: 200 }); }
export async function OPTIONS(){ return new NextResponse(null, { status: 200 }); }

export async function POST(request: NextRequest)   { return handleWebhook(request); }
export async function PUT(request: NextRequest)    { return handleWebhook(request); }
export async function PATCH(request: NextRequest)  { return handleWebhook(request); }
export async function DELETE() { return NextResponse.json({ success: true }); }

// ============================================================
// WEBHOOK HANDLER
// ============================================================

async function handleWebhook(request: NextRequest) {
  const traceId = `payos-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const log = (step: string, data?: Record<string, unknown>) => {
    console.log(`[PayOS Webhook] [${traceId}] ${step}`, data ? JSON.stringify(data) : '');
  };

  log('RECEIVED');

  try {
    // 1. Parse body
    let body: Record<string, unknown> = {};
    try {
      const text = await request.text();
      if (text) {
        body = JSON.parse(text);
        log('BODY_PARSED', { keys: Object.keys(body) });
      } else {
        log('EMPTY_BODY');
        return NextResponse.json({ success: true });
      }
    } catch {
      log('PARSE_ERROR');
      return NextResponse.json({ success: true });
    }

    // 2. Extract payload
    const webhookSuccess = body['success'] === true;
    const webhookCode = String(body['code'] || '');
    const receivedSignature = String(body['signature'] || '');
    const data = body['data'] as Record<string, unknown> | undefined;

    if (!data || !data['orderCode']) {
      log('TEST_PING', { webhookCode });
      return NextResponse.json({ success: true });
    }

    const orderCode = String(data['orderCode']);
    const dataCode = String(data['code'] || '');

    log('PAYLOAD', {
      orderCode,
      webhookSuccess,
      webhookCode,
      dataCode,
      amount: data['amount'],
      reference: data['reference'],
      transactionDateTime: data['transactionDateTime'],
      paymentLinkId: data['paymentLinkId'],
    });

    // 3. Verify signature (non-blocking — always log, never reject)
    if (receivedSignature) {
      const sigValid = verifySignature(data, receivedSignature);
      log(sigValid ? 'SIGNATURE_VALID' : 'SIGNATURE_INVALID');
    } else {
      log('NO_SIGNATURE');
    }

    // 4. Find payment record
    const payment = await prisma.payment.findFirst({
      where: { gatewayTxnId: orderCode },
      include: { adoption: true },
    });

    if (!payment) {
      log('PAYMENT_NOT_FOUND', { orderCode });
      return NextResponse.json({ success: true });
    }

    log('PAYMENT_FOUND', {
      paymentId: payment.id,
      currentStatus: payment.status,
      amount: payment.amount,
    });

    // 5. Idempotency — skip if already completed
    if (payment.status === 'completed') {
      log('DUPLICATE_SKIPPED', { paymentId: payment.id });
      return NextResponse.json({ success: true });
    }

    // 6. Determine payment status from webhook
    // Per PayOS docs: data.code === "00" means payment success
    // webhookCode === "00" means webhook event is valid
    const isSuccess = dataCode === '00';

    if (isSuccess) {
      log('PAYMENT_SUCCESS', {
        paymentId: payment.id,
        orderCode,
        amount: data['amount'],
        reference: data['reference'],
      });

      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: 'completed',
            paidAt: new Date(),
            gatewayTxnId: `${orderCode}|ref:${data['reference'] || ''}|txn:${data['transactionDateTime'] || ''}`,
          },
        });

        if (payment.adoptionId) {
          await tx.adoption.update({
            where: { id: payment.adoptionId },
            data: { status: 'active' },
          });
        }
      });

      log('STATUS_UPDATED', {
        paymentId: payment.id,
        paymentStatus: 'completed',
        adoptionId: payment.adoptionId,
        adoptionStatus: 'active',
      });
    } else {
      log('PAYMENT_FAILURE', {
        paymentId: payment.id,
        orderCode,
        dataCode,
        dataDesc: data['desc'],
      });

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'failed',
          gatewayTxnId: `${orderCode}|code:${dataCode}|desc:${data['desc'] || ''}|txn:${data['transactionDateTime'] || ''}`,
        },
      });

      log('STATUS_UPDATED', {
        paymentId: payment.id,
        paymentStatus: 'failed',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    log('INTERNAL_ERROR', { error: String(error) });
    return NextResponse.json({ success: true });
  }
}

// ============================================================
// SIGNATURE VERIFICATION (per PayOS docs)
// https://payos.vn/docs/tich-hop-webhook/kiem-tra-du-lieu-voi-signature/
// ============================================================

import crypto from 'crypto';

function verifySignature(
  data: Record<string, unknown>,
  receivedSignature: string
): boolean {
  try {
    const checksumKey = process.env.PAYOS_CHECKSUM_KEY || '';

    // 1. Sort keys alphabetically
    const sortedKeys = Object.keys(data).sort();

    // 2. Build key=value pairs
    const pairs = sortedKeys.map((key) => {
      let val = data[key];

      // Handle null/undefined/"null"/"undefined"
      if (val === null || val === undefined || val === 'null' || val === 'undefined') {
        val = '';
      }

      // Handle arrays: sort each element's keys, then JSON encode
      if (Array.isArray(val)) {
        val = JSON.stringify(
          val.map((item) => {
            if (typeof item === 'object' && item !== null) {
              const sorted: Record<string, unknown> = {};
              Object.keys(item as object).sort().forEach((k) => {
                sorted[k] = (item as Record<string, unknown>)[k];
              });
              return sorted;
            }
            return item;
          })
        );
      }
      // Handle objects: sort keys, then JSON encode
      else if (typeof val === 'object' && val !== null) {
        const sorted: Record<string, unknown> = {};
        Object.keys(val as object).sort().forEach((k) => {
          sorted[k] = (val as Record<string, unknown>)[k];
        });
        val = JSON.stringify(sorted);
      }

      return `${key}=${val}`;
    });

    // 3. Join with &
    const dataString = pairs.join('&');

    // 4. HMAC-SHA256
    const computed = crypto
      .createHmac('sha256', checksumKey)
      .update(dataString)
      .digest('hex');

    return computed === receivedSignature;
  } catch {
    return false;
  }
}
