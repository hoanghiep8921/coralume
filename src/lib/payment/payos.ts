/**
 * PayOS Payment Integration
 *
 * Unified gateway supporting VNPay, MoMo, VietQR via a single API.
 * Flow: create payment link → redirect user to PayOS checkout page
 * → user pays → PayOS webhook confirms → update status.
 *
 * API docs: https://payos.vn/docs/api/#tag/payment-request
 *
 * Env vars:
 *   PAYOS_CLIENT_ID    — Client ID from PayOS dashboard
 *   PAYOS_API_KEY      — API key from PayOS dashboard
 *   PAYOS_CHECKSUM_KEY — Checksum key for HMAC-SHA256 signing
 */

import crypto from 'crypto';

const PAYOS_API = 'https://api-merchant.payos.vn/v2';

function getConfig() {
  return {
    clientId: process.env.PAYOS_CLIENT_ID || '',
    apiKey: process.env.PAYOS_API_KEY || '',
    checksumKey: process.env.PAYOS_CHECKSUM_KEY || '',
    cancelUrl: process.env.PAYOS_CANCEL_URL || 'http://localhost:3000/san-pham',
    returnUrl: process.env.PAYOS_RETURN_URL || 'http://localhost:3000/thanh-cong',
  };
}

/** Build signature for createPaymentLink: HMAC-SHA256 over alphabetically sorted fields */
function buildCreateSignature(params: {
  amount: number;
  cancelUrl: string;
  description: string;
  orderCode: number;
  returnUrl: string;
}): string {
  const config = getConfig();
  const signData =
    `amount=${params.amount}` +
    `&cancelUrl=${params.cancelUrl}` +
    `&description=${params.description}` +
    `&orderCode=${params.orderCode}` +
    `&returnUrl=${params.returnUrl}`;

  return crypto.createHmac('sha256', config.checksumKey).update(signData).digest('hex');
}

export interface PayOSCreateParams {
  orderCode: number;
  amount: number;
  description: string;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
  expiredAt?: number; // Unix timestamp
}

export interface PayOSCreateResult {
  success: boolean;
  checkoutUrl?: string;
  qrCode?: string;
  paymentLinkId?: string;
  orderCode?: number;
  error?: string;
}

/**
 * Create a PayOS payment link.
 * Returns checkoutUrl for redirect and QR code for display.
 */
export async function createPaymentLink(
  params: PayOSCreateParams
): Promise<PayOSCreateResult> {
  const config = getConfig();

  const signature = buildCreateSignature({
    amount: params.amount,
    cancelUrl: config.cancelUrl,
    description: params.description,
    orderCode: params.orderCode,
    returnUrl: config.returnUrl,
  });

  const body: Record<string, unknown> = {
    orderCode: params.orderCode,
    amount: params.amount,
    description: params.description,
    cancelUrl: config.cancelUrl,
    returnUrl: config.returnUrl,
    signature,
  };

  if (params.buyerName) body.buyerName = params.buyerName;
  if (params.buyerEmail) body.buyerEmail = params.buyerEmail;
  if (params.buyerPhone) body.buyerPhone = params.buyerPhone;
  if (params.items) body.items = params.items;
  if (params.expiredAt) body.expiredAt = params.expiredAt;

  try {
    const response = await fetch(`${PAYOS_API}/payment-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': config.clientId,
        'x-api-key': config.apiKey,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.code === '00') {
      return {
        success: true,
        checkoutUrl: data.data.checkoutUrl,
        qrCode: data.data.qrCode,
        paymentLinkId: data.data.paymentLinkId,
        orderCode: data.data.orderCode,
      };
    }

    return {
      success: false,
      error: data.desc || 'Không thể tạo link thanh toán PayOS',
    };
  } catch {
    return {
      success: false,
      error: 'Không thể kết nối đến cổng thanh toán PayOS',
    };
  }
}

/**
 * Verify PayOS webhook signature.
 *
 * Webhook data fields are sorted alphabetically, joined as key=value&... pairs,
 * then HMAC-SHA256 signed with checksum key.
 * Null/undefined values are treated as empty strings.
 */
export function verifyPayOSWebhook(
  webhookData: Record<string, unknown>,
  receivedSignature: string
): boolean {
  const config = getConfig();

  // Sort keys alphabetically
  const sortedKeys = Object.keys(webhookData).sort();

  // Build data string
  const dataString = sortedKeys
    .map((key) => {
      let val = webhookData[key];
      // Treat null/undefined/"null"/"undefined" as empty string
      if (val === null || val === undefined || val === 'null' || val === 'undefined') {
        val = '';
      }
      // If array or object, JSON-encode after sorting keys
      if (typeof val === 'object') {
        val = JSON.stringify(val, Object.keys(val as object).sort());
      }
      return `${key}=${val}`;
    })
    .join('&');

  const computed = crypto.createHmac('sha256', config.checksumKey).update(dataString).digest('hex');
  return computed === receivedSignature;
}

/** Check if PayOS webhook indicates payment success */
export function isPayOSSuccess(data: Record<string, unknown>): boolean {
  return data['code'] === '00' || data['success'] === true;
}
