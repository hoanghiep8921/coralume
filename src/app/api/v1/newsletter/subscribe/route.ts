import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

const newsletterSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

/**
 * POST /api/v1/newsletter/subscribe
 * Public — store newsletter subscription.
 * In production, integrate with Mailchimp/SendGrid/Resend audiences.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResponse = rateLimit(request, RATE_LIMITS.form);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await request.json();
    const validation = newsletterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message, code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // For now, log the subscription.
    // TODO: Integrate with Resend audiences or Mailchimp API.
    console.log('[Newsletter] New subscriber:', email);

    return NextResponse.json({
      data: { success: true, message: 'Đăng ký nhận tin thành công!' },
    });
  } catch (error) {
    console.error('[POST /api/v1/newsletter/subscribe]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
