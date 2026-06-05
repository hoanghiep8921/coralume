import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// ============================================================
// GET — initiate Google OAuth 2.0 flow
// Security: CSRF state param + callbackUrl cookie
// ============================================================

function generateState(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/v1/auth/google/callback`;

    if (!clientId) {
      return NextResponse.json(
        { error: 'Google OAuth chưa được cấu hình', code: 'OAUTH_NOT_CONFIGURED' },
        { status: 501 }
      );
    }

    // 1. Generate CSRF state token
    const state = generateState();

    // 2. Preserve callbackUrl (where to redirect after login)
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/dashboard';

    // 3. Build Google OAuth URL
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'online',
      prompt: 'select_account',
      state,
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    // 4. Set CSRF state cookie (5 min expiry) + callbackUrl cookie
    const cookieStore = await cookies();
    cookieStore.set('google_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5, // 5 minutes
      path: '/',
    });
    cookieStore.set('google_oauth_callback_url', callbackUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5,
      path: '/',
    });

    const response = NextResponse.redirect(googleAuthUrl);
    // Copy cookies to redirect response
    response.cookies.set('google_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5,
      path: '/',
    });
    response.cookies.set('google_oauth_callback_url', callbackUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 5,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[GET /api/v1/auth/google]', err);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
