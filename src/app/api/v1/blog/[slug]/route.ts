import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { author: { select: { fullName: true } } },
    });

    if (!post) {
      return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 });
    }

    return NextResponse.json({ data: post });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
