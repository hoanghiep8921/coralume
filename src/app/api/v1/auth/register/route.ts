import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { registerSchema } from '@/lib/validation';
import { hashPassword, createToken, createVerifyToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
import { AMBASSADOR_THRESHOLD } from '@/config/site';
import { maybeUpgradeToAmbassador } from '@/lib/ambassador';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResponse = rateLimit(request, RATE_LIMITS.auth);
    if (rateLimitResponse) return rateLimitResponse;

    // 1. Validate input
    const body = await request.json();
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { fullName, email, password, phone, referralCode } = validation.data;

    // 2. Check email uniqueness
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được đăng ký', code: 'CONFLICT' },
        { status: 409 }
      );
    }

    // 3. Hash password & create user
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        phone: phone || null,
        role: 'adopter',
        isVerified: false,
      },
    });

    // 4. Process referral code if provided
    if (referralCode) {
      try {
        // Find the referrer by matching referral pattern CRL-<NAME>
        const referrer = await prisma.user.findFirst({
          where: {
            fullName: {
              startsWith: referralCode.replace(/^CRL-/, '').replace(/([A-Z])/g, ' $1').trim(),
              mode: 'insensitive',
            },
          },
        });
        if (referrer && referrer.id !== user.id) {
          await prisma.referral.create({
            data: {
              referrerId: referrer.id,
              referredId: user.id,
              code: referralCode,
              status: 'completed',
            },
          });
          // Check if referrer now qualifies for Ambassador upgrade
          await maybeUpgradeToAmbassador(referrer.id);
        }
      } catch {
        // Referral tracking is non-blocking — silently ignore failures
      }
    }

    // 5. Create email verification token & send via Resend
    const verifyToken = await createVerifyToken(user.id, user.email);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${baseUrl}/verify-email?token=${verifyToken}`;
    await sendVerificationEmail(user.email, verifyUrl);

    // 6. Create JWT and set cookie
    const token = await createToken({
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
        isVerified: user.isVerified,
        referralProcessed: !!referralCode,
      },
    });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[POST /api/v1/auth/register]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
