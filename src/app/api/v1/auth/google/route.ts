import { NextResponse } from 'next/server';

// ============================================================
// GET — initiate Google OAuth flow
// ============================================================

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/v1/auth/google/callback`;

  if (!clientId) {
    return NextResponse.json(
      { error: 'Google OAuth chưa được cấu hình', code: 'OAUTH_NOT_CONFIGURED' },
      { status: 501 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'online',
    prompt: 'select_account',
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(googleAuthUrl);
}
