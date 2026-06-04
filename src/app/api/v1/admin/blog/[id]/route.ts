import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';

// ============================================================
// HELPERS
// ============================================================

function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ============================================================
// GET — single post by id
// ============================================================

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { author: { select: { id: true, fullName: true } } },
    });

    if (!post) return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 });
    return NextResponse.json({ data: post });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// ============================================================
// PUT — update post
// ============================================================

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    // Fetch current post to check status transition
    const current = await prisma.blogPost.findUnique({ where: { id }, select: { status: true, publishedAt: true } });
    if (!current) return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 });

    // Build update data dynamically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {};

    if (body.title !== undefined) data.title = body.title;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.excerpt !== undefined) data.excerpt = body.excerpt;
    if (body.content !== undefined) {
      data.content = body.content;
      data.readingTime = calcReadingTime(body.content);
    }
    if (body.category !== undefined) data.category = body.category;
    if (body.tags !== undefined) data.tags = body.tags;
    if (body.featuredImage !== undefined) data.featuredImage = body.featuredImage;

    // Handle status changes
    if (body.status !== undefined) {
      data.status = body.status;
      if (body.status === 'published' && !current.publishedAt) {
        data.publishedAt = new Date();
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data,
      include: { author: { select: { id: true, fullName: true } } },
    });

    return NextResponse.json({ data: post });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// ============================================================
// DELETE — delete post
// ============================================================

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;

    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 });

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
