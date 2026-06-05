import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminOnly } from '@/lib/admin-guard';
import { logActivity } from '@/lib/activity-log';
import { adminProductCreateSchema } from '@/lib/validation';

export async function GET() {
  try {
    await requireAdminOnly();
    const products = await prisma.product.findMany({
      orderBy: { priceMin: 'asc' },
    });
    return NextResponse.json({ data: products });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdminOnly();
    const body = await request.json();

    const parsed = adminProductCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const data = parsed.data;

    const product = await prisma.product.create({
      data: {
        slug: data.slug,
        name: data.name,
        tier: data.tier || 'standard',
        priceMin: data.priceMin,
        priceMax: data.priceMax,
        description: data.description || '',
        benefits: data.benefits || [],
        isActive: true,
      },
    });

    logActivity({
      adminId: admin.userId,
      action: 'create_product',
      targetType: 'product',
      targetId: product.id,
      details: { name: product.name, tier: product.tier, priceMin: product.priceMin, priceMax: product.priceMax },
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
