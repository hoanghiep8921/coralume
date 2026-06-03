/**
 * MoMo Payment Integration
 *
 * Creates payment requests via MoMo API with HMAC-SHA256 signing.
 * Callback verification validates IPN signatures.
 *
 * Env vars required:
 *   MOMO_ACCESS_KEY    — Access key from MoMo
 *   MOMO_SECRET_KEY    — Secret key for HMAC-SHA256
 *   MOMO_PARTNER_CODE  — Partner code (default: MOMO)
 *   MOMO_API_URL       — API endpoint (sandbox or live)
 *   MOMO_RETURN_URL    — Return URL after payment
 *   MOMO_IPN_URL       — IPN callback URL
 */

import crypto from 'crypto';

function getConfig() {
  return {
    accessKey: process.env.MOMO_ACCESS_KEY || '',
    secretKey: process.env.MOMO_SECRET_KEY || '',
    partnerCode: process.env.MOMO_PARTNER_CODE || 'MOMO',
    apiUrl:
      process.env.MOMO_API_URL || 'https://test-payment.momo.vn/v2/gateway/api/create',
    returnUrl: process.env.MOMO_RETURN_URL || 'http://localhost:3000/thanh-cong',
    ipnUrl:
      process.env.MOMO_IPN_URL ||
      'http://localhost:3000/api/v1/payments/callback/momo',
  };
}

function signData(rawSignature: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(rawSignature).digest('hex');
}

export interface MoMoPaymentRequest {
  requestId: string;
  orderId: string;
  amount: number; // in VND
  orderInfo: string;
  lang?: string;
}

export interface MoMoPaymentResponse {
  success: boolean;
  payUrl?: string;
  qrCodeUrl?: string;
  deeplink?: string;
  message?: string;
  error?: string;
}

/**
 * Create a MoMo payment request via the MoMo API.
 * Returns the payUrl for redirect or QR code URL.
 */
export async function createPaymentRequest(
  params: MoMoPaymentRequest
): Promise<MoMoPaymentResponse> {
  const config = getConfig();

  const requestBody = {
    partnerCode: config.partnerCode,
    accessKey: config.accessKey,
    requestId: params.requestId,
    amount: String(params.amount),
    orderId: params.orderId,
    orderInfo: params.orderInfo.substring(0, 256),
    redirectUrl: config.returnUrl,
    ipnUrl: config.ipnUrl,
    requestType: 'captureWallet',
    extraData: '',
    lang: params.lang || 'vi',
  };

  const rawSignature = Object.entries(requestBody)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  const signature = signData(rawSignature, config.secretKey);

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...requestBody, signature }),
    });

    const data = await response.json();

    if (data.resultCode === 0) {
      return {
        success: true,
        payUrl: data.payUrl,
        qrCodeUrl: data.qrCodeUrl,
        deeplink: data.deeplink,
        message: data.message,
      };
    }

    return {
      success: false,
      error: data.message || 'Thanh toán MoMo không thành công',
      message: data.message,
    };
  } catch {
    return {
      success: false,
      error: 'Không thể kết nối đến cổng thanh toán MoMo',
    };
  }
}

/**
 * Verify MoMo IPN callback signature.
 * Returns true if the signature in the callback matches.
 */
export function verifyCallback(body: Record<string, unknown>): boolean {
  const config = getConfig();
  const receivedSignature = body['signature'] as string | undefined;
  if (!receivedSignature) return false;

  // Rebuild the raw signature from body (excluding the signature field itself)
  const signFields: Array<[string, string]> = [];
  for (const [key, value] of Object.entries(body)) {
    if (key !== 'signature' && typeof value !== 'undefined' && value !== null) {
      signFields.push([key, String(value)]);
    }
  }

  const rawSignature = signFields.map(([k, v]) => `${k}=${v}`).join('&');
  const computedSignature = signData(rawSignature, config.secretKey);
  return computedSignature === receivedSignature;
}

/** Check if MoMo result code indicates success */
export function isSuccessResponse(resultCode: number): boolean {
  return resultCode === 0;
}
