import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { communitySubmissionSchema } from '@/lib/validation';

export async function GET() {
  try {
    const submissions = await prisma.communitySubmission.findMany({
      where: { status: 'approved' },
      include: {
        user: { select: { fullName: true, isPublic: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    return NextResponse.json({ data: submissions });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập' }, { status: 401 });
    }

    const body = await request.json();
    const validation = communitySubmissionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Dữ liệu không hợp lệ' },
        { status: 400 }
      );
    }

    const submission = await prisma.communitySubmission.create({
      data: {
        userId: user.userId,
        content: validation.data.content,
        images: validation.data.images,
        status: 'pending', // Requires admin approval
      },
    });

    return NextResponse.json({ data: submission }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
