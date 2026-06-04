import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

// ============================================================
// HELPERS
// ============================================================

function slugify(text: string): string {
  const from = 'àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ';
  const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';
  let slug = text.toLowerCase().trim();
  for (let i = 0; i < from.length; i++) {
    slug = slug.replaceAll(from[i], to[i]);
  }
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug || 'bai-viet';
}

function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ============================================================
// GET — list posts with search & pagination
// ============================================================

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const skip = (page - 1) * limit;

    const where = search
      ? { title: { contains: search, mode: 'insensitive' as const } }
      : {};

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          category: true,
          tags: true,
          status: true,
          readingTime: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          author: { select: { id: true, fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      data: { posts, total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// ============================================================
// POST — create a new post
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin();
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Tiêu đề và nội dung là bắt buộc' }, { status: 400 });
    }

    const slug = body.slug || slugify(body.title);
    const readingTime = calcReadingTime(body.content);
    const isPublished = body.status === 'published';

    const post = await prisma.blogPost.create({
      data: {
        authorId: user.userId,
        title: body.title,
        slug,
        excerpt: body.excerpt || '',
        content: body.content,
        category: body.category || 'ecology',
        tags: Array.isArray(body.tags) ? body.tags : [],
        featuredImage: body.featuredImage || null,
        status: isPublished ? 'published' : 'draft',
        readingTime,
        publishedAt: isPublished ? new Date() : null,
      },
      include: { author: { select: { id: true, fullName: true } } },
    });

    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
