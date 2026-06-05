import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { createToken } from '@/lib/auth';

// ============================================================
// GET — handle Google OAuth callback
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!clientId || !clientSecret) {
      const loginUrl = new URL('/dang-nhap', baseUrl);
      loginUrl.searchParams.set('error', 'google_oauth_not_configured');
      return NextResponse.redirect(loginUrl);
    }

    // 1. Get code from query params
    const code = request.nextUrl.searchParams.get('code');
    const error = request.nextUrl.searchParams.get('error');

    if (error || !code) {
      const loginUrl = new URL('/dang-nhap', baseUrl);
      loginUrl.searchParams.set('error', error || 'google_auth_failed');
      return NextResponse.redirect(loginUrl);
    }

    // 2. Exchange code for tokens
    const redirectUri = `${baseUrl}/api/v1/auth/google/callback`;
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const loginUrl = new URL('/dang-nhap', baseUrl);
      loginUrl.searchParams.set('error', 'google_token_exchange_failed');
      return NextResponse.redirect(loginUrl);
    }

    const tokens = await tokenRes.json();
    const { id_token, access_token } = tokens;

    // 3. Get user info from Google
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userInfoRes.ok) {
      const loginUrl = new URL('/dang-nhap', baseUrl);
      loginUrl.searchParams.set('error', 'google_userinfo_failed');
      return NextResponse.redirect(loginUrl);
    }

    const googleUser = await userInfoRes.json();
    const { email, name, sub: googleId, email_verified } = googleUser;

    if (!email) {
      const loginUrl = new URL('/dang-nhap', baseUrl);
      loginUrl.searchParams.set('error', 'google_email_missing');
      return NextResponse.redirect(loginUrl);
    }

    // 4. Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user from Google profile
      user = await prisma.user.create({
        data: {
          email,
          fullName: name || email.split('@')[0],
          passwordHash: '', // No password for OAuth users
          role: 'adopter',
          isVerified: !!email_verified,
        },
      });
    } else if (!user.isVerified && email_verified) {
      // Auto-verify if Google says email is verified
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
    }

    if (!user.isActive) {
      const loginUrl = new URL('/dang-nhap', baseUrl);
      loginUrl.searchParams.set('error', 'account_blocked');
      return NextResponse.redirect(loginUrl);
    }

    // 5. Create JWT and set cookie
    const jwt = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

    const response = NextResponse.redirect(new URL('/dashboard', baseUrl));
    response.cookies.set('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[GET /api/v1/auth/google/callback]', err);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const loginUrl = new URL('/dang-nhap', baseUrl);
    loginUrl.searchParams.set('error', 'google_server_error');
    return NextResponse.redirect(loginUrl);
  }
}
