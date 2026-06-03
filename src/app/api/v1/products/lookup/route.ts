/**
 * GET /api/v1/products/lookup?slug=xxx
 *
 * Resolve product slug from URL to full product data (including UUID).
 * Public route — no auth required.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Thiếu tham số slug', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        name: true,
        tier: true,
        priceMin: true,
        priceMax: true,
        benefits: true,
        description: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Không tìm thấy gói sản phẩm', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: product });
  } catch (error) {
    console.error('[GET /api/v1/products/lookup]', error);
    return NextResponse.json(
      { error: 'Lỗi server', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
