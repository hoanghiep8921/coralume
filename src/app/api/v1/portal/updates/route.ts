import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { coralUpdateSchema } from '@/lib/validation';
import { sendCoralUpdateEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== 'coral_staff' && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const validation = coralUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    const { coralId, sizeCm, health, notes, images, videoUrl } = validation.data;

    // Verify coral exists
    const coral = await prisma.coral.findUnique({ where: { id: coralId } });
    if (!coral) {
      return NextResponse.json({ error: 'Không tìm thấy san hô' }, { status: 404 });
    }

    // Create update
    const update = await prisma.coralUpdate.create({
      data: {
        coralId,
        staffId: user.userId,
        sizeCm: sizeCm || null,
        health,
        notes: notes || null,
        images: images || [],
        videoUrl: videoUrl || null,
      },
    });

    // Update coral status to growing if assigned
    if (coral.status === 'assigned') {
      await prisma.coral.update({
        where: { id: coralId },
        data: { status: 'growing' },
      });
    }

    // Fire-and-forget: send email notification to adopter
    (async () => {
      try {
        const adoption = await prisma.adoption.findFirst({
          where: { coralId, status: 'active' },
          include: { user: { select: { id: true, fullName: true, email: true, emailNotify: true } } },
        });

        if (adoption?.user?.email && adoption.user.emailNotify !== false) {
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          await sendCoralUpdateEmail(adoption.user.email, {
            adopterName: adoption.user.fullName,
            coralCode: coral.code,
            coralName: adoption.customName || undefined,
            health: health,
            sizeCm: sizeCm || undefined,
            notes: notes || undefined,
            dashboardUrl: `${baseUrl}/dashboard`,
          });

          // Log email
          await prisma.emailLog.create({
            data: {
              userId: adoption.user.id,
              type: 'coral_update',
              subject: `San hô ${coral.code} vừa được cập nhật`,
              status: 'sent',
            },
          }).catch(() => { /* log failure is non-critical */ });
        }
      } catch {
        // Email failure is non-blocking
      }
    })();

    return NextResponse.json({ data: update }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
