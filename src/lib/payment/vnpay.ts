/**
 * VNPay Payment Integration
 *
 * Builds redirect URLs with HMAC-SHA512 signing following VNPay v2.1.0 spec.
 * Callback verification validates IPN signatures.
 *
 * Env vars required:
 *   VNPAY_TMN_CODE     — Terminal code from VNPay
 *   VNPAY_HASH_SECRET  — Secret key for HMAC-SHA512
 *   VNPAY_URL          — Gateway URL (sandbox or live)
 *   VNPAY_RETURN_URL   — Return URL after payment (e.g. https://coralume.vn/thanh-cong)
 */

import crypto from 'crypto';

function getConfig() {
  return {
    tmnCode: process.env.VNPAY_TMN_CODE || '',
    hashSecret: process.env.VNPAY_HASH_SECRET || '',
    url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    returnUrl: process.env.VNPAY_RETURN_URL || 'http://localhost:3000/thanh-cong',
  };
}

/** Format date as YYYYMMDDHHmmss (VNPay requirement) */
function formatDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

/** Sign params with HMAC-SHA512 per VNPay spec */
function signParams(params: Record<string, string | number>, secret: string): string {
  // 1. Sort keys alphabetically
  const sortedKeys = Object.keys(params).sort();
  // 2. Build query string
  const signData = sortedKeys
    .map((key) => `${key}=${encodeURIComponent(String(params[key]))}`)
    .join('&');
  // 3. HMAC-SHA512
  return crypto.createHmac('sha512', secret).update(Buffer.from(signData, 'utf-8')).digest('hex');
}

export interface VNPayRedirectParams {
  paymentId: string;
  amount: number; // in VND
  orderInfo: string;
  clientIp?: string;
}

/**
 * Build a signed VNPay redirect URL.
 * Amount is multiplied by 100 per VNPay spec (VND × 100).
 */
export function buildPaymentUrl(params: VNPayRedirectParams): string {
  const config = getConfig();
  const now = new Date();
  const expireDate = new Date(now.getTime() + 15 * 60 * 1000); // +15 minutes

  const vnpParams: Record<string, string | number> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: config.tmnCode,
    vnp_Amount: params.amount * 100,
    vnp_CreateDate: formatDate(now),
    vnp_CurrCode: 'VND',
    vnp_IpAddr: params.clientIp || '127.0.0.1',
    vnp_Locale: 'vn',
    vnp_OrderInfo: params.orderInfo.substring(0, 255),
    vnp_OrderType: 'billpayment',
    vnp_ReturnUrl: config.returnUrl,
    vnp_TxnRef: params.paymentId.replace(/-/g, '').substring(0, 20),
    vnp_ExpireDate: formatDate(expireDate),
  };

  const secureHash = signParams(vnpParams, config.hashSecret);
  const queryString = Object.entries(vnpParams)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');

  return `${config.url}?${queryString}&vnp_SecureHash=${secureHash}`;
}

/**
 * Verify the VNPay IPN callback signature.
 * Returns true if hash matches.
 */
export function verifyCallback(params: Record<string, string>): boolean {
  const config = getConfig();
  const receivedHash = params['vnp_SecureHash'];
  if (!receivedHash) return false;

  // Remove hash params and build sign string from remaining params
  const vnpData: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (key.startsWith('vnp_') && key !== 'vnp_SecureHash' && key !== 'vnp_SecureHashType') {
      vnpData[key] = value;
    }
  }

  const computedHash = signParams(vnpData, config.hashSecret);
  return computedHash === receivedHash;
}

/** Check if VNPay response code indicates success */
export function isSuccessResponse(responseCode: string): boolean {
  return responseCode === '00';
}
