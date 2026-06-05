import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import { createToken } from '@/lib/auth';

// ============================================================
// GET — handle Google OAuth 2.0 callback
// Security: CSRF state verify + id_token decode + anti-block
// ============================================================

interface GoogleIdToken {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string | boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  iat: number;
  exp: number;
}

function decodeIdTokenPayload(idToken: string): GoogleIdToken | null {
  try {
    const parts = idToken.split('.');
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], 'base64url').toString('utf-8');
    return JSON.parse(payload) as GoogleIdToken;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const loginUrl = () => new URL('/dang-nhap', baseUrl);

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      const url = loginUrl();
      url.searchParams.set('error', 'google_oauth_not_configured');
      return NextResponse.redirect(url);
    }

    // 1. Verify CSRF state
    const cookieStore = await cookies();
    const savedState = cookieStore.get('google_oauth_state')?.value;
    const callbackUrl = cookieStore.get('google_oauth_callback_url')?.value || '/dashboard';
    const returnedState = request.nextUrl.searchParams.get('state');
    const code = request.nextUrl.searchParams.get('code');
    const error = request.nextUrl.searchParams.get('error');

    // Clear OAuth cookies immediately
    const clearCookieOpts = {
      httpOnly: true as const,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 0,
      path: '/',
    };

    if (!savedState || savedState !== returnedState) {
      const url = loginUrl();
      url.searchParams.set('error', 'google_csrf_mismatch');
      const response = NextResponse.redirect(url);
      response.cookies.set('google_oauth_state', '', clearCookieOpts);
      response.cookies.set('google_oauth_callback_url', '', clearCookieOpts);
      return response;
    }

    if (error || !code) {
      const url = loginUrl();
      url.searchParams.set('error', error || 'google_auth_failed');
      const response = NextResponse.redirect(url);
      response.cookies.set('google_oauth_state', '', clearCookieOpts);
      response.cookies.set('google_oauth_callback_url', '', clearCookieOpts);
      return response;
    }

    // 2. Exchange authorization code for tokens (Google OAuth 2.0)
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
      console.error('[Google OAuth] Token exchange failed:', await tokenRes.text());
      const url = loginUrl();
      url.searchParams.set('error', 'google_token_exchange_failed');
      const response = NextResponse.redirect(url);
      response.cookies.set('google_oauth_state', '', clearCookieOpts);
      response.cookies.set('google_oauth_callback_url', '', clearCookieOpts);
      return response;
    }

    const tokens = await tokenRes.json();
    const { id_token, access_token } = tokens;

    // 3. Decode & validate id_token
    // (Full JWKS verification would add 200ms latency; we trust the
    // token endpoint's HTTPS + client_secret. The id_token is decoded
    // for payload extraction; audience/issuer are checked client-side.)
    const idPayload = decodeIdTokenPayload(id_token);
    if (!idPayload) {
      const url = loginUrl();
      url.searchParams.set('error', 'google_id_token_invalid');
      const response = NextResponse.redirect(url);
      response.cookies.set('google_oauth_state', '', clearCookieOpts);
      response.cookies.set('google_oauth_callback_url', '', clearCookieOpts);
      return response;
    }

    // Validate issuer & audience
    if (
      idPayload.iss !== 'https://accounts.google.com' &&
      idPayload.iss !== 'accounts.google.com'
    ) {
      const url = loginUrl();
      url.searchParams.set('error', 'google_id_token_issuer');
      const response = NextResponse.redirect(url);
      response.cookies.set('google_oauth_state', '', clearCookieOpts);
      response.cookies.set('google_oauth_callback_url', '', clearCookieOpts);
      return response;
    }

    if (idPayload.aud !== clientId) {
      const url = loginUrl();
      url.searchParams.set('error', 'google_id_token_audience');
      const response = NextResponse.redirect(url);
      response.cookies.set('google_oauth_state', '', clearCookieOpts);
      response.cookies.set('google_oauth_callback_url', '', clearCookieOpts);
      return response;
    }

    // 4. Extract user info from id_token (preferred — self-contained, verifiable)
    //    Fallback to /userinfo endpoint if id_token missing fields
    let email = idPayload.email;
    let name = idPayload.name;
    const emailVerified = idPayload.email_verified === true || idPayload.email_verified === 'true';

    // Fallback: fetch from Google userinfo if id_token incomplete
    if (!email || !name) {
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (userInfoRes.ok) {
        const googleUser = await userInfoRes.json();
        email = email || googleUser.email;
        name = name || googleUser.name;
      }
    }

    if (!email) {
      const url = loginUrl();
      url.searchParams.set('error', 'google_email_missing');
      const response = NextResponse.redirect(url);
      response.cookies.set('google_oauth_state', '', clearCookieOpts);
      response.cookies.set('google_oauth_callback_url', '', clearCookieOpts);
      return response;
    }

    // 5. Find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          fullName: name || email.split('@')[0],
          passwordHash: '', // OAuth users — password login disabled
          role: 'adopter',
          isVerified: emailVerified,
        },
      });
    } else if (!user.isVerified && emailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true },
      });
    }

    if (!user.isActive) {
      const url = loginUrl();
      url.searchParams.set('error', 'account_blocked');
      const response = NextResponse.redirect(url);
      response.cookies.set('google_oauth_state', '', clearCookieOpts);
      response.cookies.set('google_oauth_callback_url', '', clearCookieOpts);
      return response;
    }

    // 6. Create JWT session
    const jwt = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });

    // 7. Redirect to callbackUrl with JWT cookie
    const redirectUrl = new URL(callbackUrl, baseUrl);
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    response.cookies.set('google_oauth_state', '', clearCookieOpts);
    response.cookies.set('google_oauth_callback_url', '', clearCookieOpts);

    return response;
  } catch (err) {
    console.error('[GET /api/v1/auth/google/callback]', err);
    const url = loginUrl();
    url.searchParams.set('error', 'google_server_error');
    return NextResponse.redirect(url);
  }
}
