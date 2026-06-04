import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validation';

// ============================================================
// POST — contact form submission
// ============================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, message } = parsed.data;

    // In production: send email to hello@coralume.vn via Resend/SES
    // For now: log to console and return success
    console.log('[Contact]', { name, email, message: message.slice(0, 100) });

    return NextResponse.json({
      data: { success: true, message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong 1-2 ngày làm việc.' },
    });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
