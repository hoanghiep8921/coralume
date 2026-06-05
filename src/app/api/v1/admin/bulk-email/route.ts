import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';
import { sendEmail } from '@/lib/email';
import { adminBulkEmailSchema } from '@/lib/validation';
import { escapeHtml, sanitizeBlogHtml } from '@/lib/security';

// ============================================================
// POST — send bulk email to users
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdminOnly();
    const body = await request.json();

    // Zod validation
    const parsed = adminBulkEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { subject, content, targetRole } = parsed.data;
    const role = targetRole;

    // Sanitize admin-provided HTML content (strip XSS, keep formatting)
    const safeContent = sanitizeBlogHtml(content);

    // Find target users
    const where: Record<string, unknown> = {
      isActive: true,
      emailNotify: true,
    };
    if (targetRole && targetRole !== 'all') {
      where.role = targetRole;
    }

    const users = await prisma.user.findMany({
      where,
      select: { id: true, email: true, fullName: true },
    });

    if (users.length === 0) {
      return NextResponse.json({ error: 'Không có người dùng nào phù hợp' }, { status: 400 });
    }

    // Send emails (fire and forget — log results)
    let sent = 0;
    let failed = 0;

    for (const user of users) {
      try {
        await sendEmail({
          to: user.email,
          subject,
          html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#0F4C5C">Coralume</h2>
            <p>Xin chào ${escapeHtml(user.fullName)},</p>
            <div style="margin:20px 0">${safeContent}</div>
            <hr style="border-color:#E8DFC8;margin:30px 0" />
            <p style="color:#8A9BA8;font-size:12px">
              Email được gửi từ Coralume Admin bởi ${escapeHtml(admin.email)}.
              Bạn nhận được email này vì đã đăng ký nhận thông báo từ Coralume.
            </p>
          </div>`,
        });
        sent++;
      } catch {
        failed++;
      }
    }

    // Log activity
    const { logActivity } = await import('@/lib/activity-log');
    logActivity({
      adminId: admin.userId,
      action: 'bulk_email',
      targetType: 'user',
      details: { subject, role: targetRole || 'all', sent, failed, total: users.length },
    });

    return NextResponse.json({
      data: { success: true, total: users.length, sent, failed },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
