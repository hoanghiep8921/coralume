import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity-log';
import { adminBlogUpdateSchema } from '@/lib/validation';
import { sanitizeBlogHtml } from '@/lib/security';

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
    const user = await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const parsed = adminBlogUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const data = parsed.data;

    // Fetch current post to check status transition
    const current = await prisma.blogPost.findUnique({ where: { id }, select: { status: true, publishedAt: true } });
    if (!current) return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 });

    // Build update data dynamically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
    if (data.content !== undefined) {
      updateData.content = sanitizeBlogHtml(data.content);
      updateData.readingTime = calcReadingTime(data.content);
    }
    if (data.category !== undefined) updateData.category = data.category;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.featuredImage !== undefined) updateData.featuredImage = data.featuredImage;

    // Handle status changes
    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === 'published' && !current.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: { author: { select: { id: true, fullName: true } } },
    });

    // Log activity
    const isPublishing = data.status === 'published' && current.status !== 'published';
    const isUnpublishing = data.status === 'draft' && current.status === 'published';
    logActivity({
      adminId: user.userId,
      action: isPublishing ? 'publish_post' : isUnpublishing ? 'unpublish_post' : 'update_post',
      targetType: 'blog_post',
      targetId: post.id,
      details: { title: post.title },
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
    const user = await requireAdmin();
    const { id } = await params;

    const existing = await prisma.blogPost.findUnique({ where: { id }, select: { id: true, title: true } });
    if (!existing) return NextResponse.json({ error: 'Không tìm thấy bài viết' }, { status: 404 });

    await prisma.blogPost.delete({ where: { id } });

    logActivity({
      adminId: user.userId,
      action: 'delete_post',
      targetType: 'blog_post',
      targetId: id,
      details: { title: existing.title },
    });

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
