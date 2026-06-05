/**
 * 2FA API endpoints — setup, enable, verify, disable, status.
 *
 * POST   /api/v1/auth/2fa?action=setup     — Generate TOTP secret (requires auth)
 * POST   /api/v1/auth/2fa?action=enable    — Verify TOTP + enable 2FA
 * POST   /api/v1/auth/2fa?action=disable   — Disable 2FA
 * POST   /api/v1/auth/2fa?action=verify    — Verify 2FA challenge token + TOTP code → issue JWT
 * GET    /api/v1/auth/2fa?action=status    — Check if current user has 2FA enabled
 */
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, createToken, verifyToken } from '@/lib/auth';
import {
  generateTotpSecret,
  generateTotpUri,
  verifyTotpToken,
  enableTotpForUser,
  disableTotpForUser,
} from '@/lib/two-factor';
import { prisma } from '@/lib/db';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

// ============================================================
// GET — 2FA status
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: { totpEnabled: true },
    });

    return NextResponse.json({
      data: { totpEnabled: user?.totpEnabled === true },
    });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// ============================================================
// POST — setup / enable / disable / verify
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResponse = rateLimit(request, RATE_LIMITS.authStrict);
    if (rateLimitResponse) return rateLimitResponse;

    const { searchParams } = request.nextUrl;
    const action = searchParams.get('action') || 'setup';
    const body = await request.json().catch(() => ({}));

    switch (action) {
      // ----------------------------------------------------------
      // SETUP — Generate TOTP secret (requires auth)
      // ----------------------------------------------------------
      case 'setup': {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
          where: { id: currentUser.userId },
          select: { email: true, totpEnabled: true },
        });

        if (!user) {
          return NextResponse.json({ error: 'Không tìm thấy người dùng' }, { status: 404 });
        }

        if (user.totpEnabled) {
          return NextResponse.json(
            { error: '2FA đã được bật. Vui lòng tắt trước khi thiết lập lại.' },
            { status: 400 }
          );
        }

        const secret = generateTotpSecret();
        const otpauthUri = generateTotpUri(user.email, secret);

        return NextResponse.json({
          data: {
            secret,
            otpauthUri,
            message: 'Quét mã QR bằng ứng dụng Authenticator (Google Authenticator, Authy, 1Password...)',
          },
        });
      }

      // ----------------------------------------------------------
      // ENABLE — Verify TOTP code + enable 2FA
      // ----------------------------------------------------------
      case 'enable': {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { secret, token } = body;
        if (!secret || !token) {
          return NextResponse.json(
            { error: 'Thiếu secret hoặc mã xác thực' },
            { status: 400 }
          );
        }

        if (!verifyTotpToken(token, secret)) {
          return NextResponse.json(
            { error: 'Mã xác thực không đúng. Vui lòng thử lại.' },
            { status: 400 }
          );
        }

        await enableTotpForUser(currentUser.userId, secret);

        return NextResponse.json({
          data: { success: true, message: 'Đã bật xác thực 2 lớp thành công.' },
        });
      }

      // ----------------------------------------------------------
      // DISABLE — Turn off 2FA
      // ----------------------------------------------------------
      case 'disable': {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { token } = body;
        if (!token) {
          return NextResponse.json(
            { error: 'Vui lòng nhập mã xác thực để tắt 2FA' },
            { status: 400 }
          );
        }

        const user = await prisma.user.findUnique({
          where: { id: currentUser.userId },
          select: { totpSecret: true, totpEnabled: true },
        });

        if (!user?.totpEnabled || !user?.totpSecret) {
          return NextResponse.json(
            { error: '2FA chưa được bật' },
            { status: 400 }
          );
        }

        if (!verifyTotpToken(token, user.totpSecret)) {
          return NextResponse.json(
            { error: 'Mã xác thực không đúng' },
            { status: 400 }
          );
        }

        await disableTotpForUser(currentUser.userId);

        return NextResponse.json({
          data: { success: true, message: 'Đã tắt xác thực 2 lớp.' },
        });
      }

      // ----------------------------------------------------------
      // VERIFY — Verify 2FA challenge + TOTP → issue JWT cookie
      // ----------------------------------------------------------
      case 'verify': {
        const { challengeToken, totpCode } = body;
        if (!challengeToken || !totpCode) {
          return NextResponse.json(
            { error: 'Thiếu challengeToken hoặc mã xác thực' },
            { status: 400 }
          );
        }

        // Verify the challenge token
        const payload = await verifyToken(challengeToken);
        if (!payload) {
          return NextResponse.json(
            { error: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' },
            { status: 401 }
          );
        }

        // Verify TOTP code
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { id: true, email: true, role: true, isVerified: true, fullName: true, totpEnabled: true, totpSecret: true, isActive: true },
        });

        if (!user || !user.isActive) {
          return NextResponse.json({ error: 'Tài khoản không hợp lệ' }, { status: 401 });
        }

        if (!user.totpEnabled || !user.totpSecret) {
          return NextResponse.json(
            { error: '2FA chưa được bật cho tài khoản này' },
            { status: 400 }
          );
        }

        if (!verifyTotpToken(totpCode, user.totpSecret)) {
          return NextResponse.json(
            { error: 'Mã xác thực không đúng. Vui lòng thử lại.' },
            { status: 401 }
          );
        }

        // Issue JWT cookie
        const jwt = await createToken({
          userId: user.id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        });

        const response = NextResponse.json({
          data: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
          },
        });
        response.cookies.set('token', jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 30,
          path: '/',
        });

        return response;
      }

      default:
        return NextResponse.json(
          { error: 'Hành động không hợp lệ' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[2FA] Error:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
