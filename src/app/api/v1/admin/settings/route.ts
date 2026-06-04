import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { clearSettingsCache } from '@/lib/site-settings';

// GET /api/v1/admin/settings — Get all site settings
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });

    const data: Record<string, string> = {};
    for (const s of settings) {
      data[s.key] = s.value;
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}

// PUT /api/v1/admin/settings — Update site settings (batch)
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ' }, { status: 400 });
    }

    const entries = Object.entries(body) as [string, string][];
    const updated: string[] = [];

    for (const [key, value] of entries) {
      if (typeof key !== 'string' || key.length === 0) continue;
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value), updatedBy: user.userId },
        create: { key, value: String(value), updatedBy: user.userId },
      });
      updated.push(key);
    }

    // Log activity
    await prisma.adminActivityLog.create({
      data: {
        adminId: user.userId,
        action: 'update_settings',
        targetType: 'site_settings',
        details: { keys: updated },
      },
    });

    // Clear cache so next read gets fresh values
    clearSettingsCache();

    return NextResponse.json({ data: { updated } });
  } catch {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  }
}
