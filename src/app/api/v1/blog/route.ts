import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50);
    const skip = (page - 1) * limit;

    const where = category ? { category: category as 'ecology' | 'conservation' | 'green_economy' | 'adopter_stories' } : {};

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          tags: true,
          readingTime: true,
          publishedAt: true,
          author: { select: { fullName: true } },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      data: { posts, total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
