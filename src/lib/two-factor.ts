/**
 * TOTP-based Two-Factor Authentication (2FA)
 *
 * RFC 6238 TOTP implementation using Node.js crypto.
 * No external dependencies — 100% standard Node.js crypto API.
 */
import { createHmac, randomBytes } from 'crypto';
import { prisma } from '@/lib/db';

const APP_NAME = 'Coralume';
const DIGITS = 6;
const PERIOD = 30; // seconds

// ============================================================
// BASE32 (RFC 4648) — for secret encoding/decoding
// ============================================================

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = '';
  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

function base32Decode(input: string): Buffer {
  const cleaned = input.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (let i = 0; i < cleaned.length; i++) {
    value = (value << 5) | BASE32_ALPHABET.indexOf(cleaned[i]);
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

// ============================================================
// TOTP CORE
// ============================================================

/**
 * Generate a cryptographically secure random TOTP secret (base32).
 */
export function generateTotpSecret(): string {
  return base32Encode(randomBytes(20)); // 160 bits
}

/**
 * Generate a TOTP token for a given secret at a specific time step.
 */
function totpAt(secret: string, timeStep: number): string {
  const key = base32Decode(secret);
  // Counter: 8-byte big-endian
  const counter = Buffer.alloc(8);
  counter.writeBigInt64BE(BigInt(timeStep));

  // HMAC-SHA1
  const hmac = createHmac('sha1', key).update(counter).digest();

  // Dynamic truncation (RFC 4226 §5.4)
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = binary % Math.pow(10, DIGITS);
  return otp.toString().padStart(DIGITS, '0');
}

/**
 * Generate the current TOTP token for a secret.
 */
export function generateTotpToken(secret: string): string {
  const timeStep = Math.floor(Date.now() / 1000 / PERIOD);
  return totpAt(secret, timeStep);
}

/**
 * Verify a TOTP token against a secret.
 * Checks current, previous, and next time windows (±1 step, ~90s window).
 */
export function verifyTotpToken(token: string, secret: string): boolean {
  const timeStep = Math.floor(Date.now() / 1000 / PERIOD);
  // Allow 1 step before and after for clock drift
  for (let offset = -1; offset <= 1; offset++) {
    if (totpAt(secret, timeStep + offset) === token) {
      return true;
    }
  }
  return false;
}

/**
 * Generate otpauth:// URI for QR code.
 */
export function generateTotpUri(email: string, secret: string): string {
  const params = new URLSearchParams({
    secret,
    issuer: APP_NAME,
    algorithm: 'SHA1',
    digits: String(DIGITS),
    period: String(PERIOD),
  });
  return `otpauth://totp/${encodeURIComponent(APP_NAME)}:${encodeURIComponent(email)}?${params.toString()}`;
}

// ============================================================
// USER MANAGEMENT
// ============================================================

export async function enableTotpForUser(
  userId: string,
  secret: string
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { totpSecret: secret, totpEnabled: true },
  });
}

export async function disableTotpForUser(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { totpSecret: null, totpEnabled: false },
  });
}

export async function userNeedsTotpChallenge(
  userId: string
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totpEnabled: true },
  });
  return user?.totpEnabled === true;
}
