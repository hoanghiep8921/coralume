import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { clearSettingsCache } from '@/lib/site-settings';
import { adminSettingsSchema } from '@/lib/validation';

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

    const parsed = adminSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const data = parsed.data;

    const updated: string[] = [];

    const settingsToUpsert: { key: string; value: string }[] = [];
    if (data.siteName !== undefined) settingsToUpsert.push({ key: 'site_name', value: data.siteName });
    if (data.contactEmail !== undefined) settingsToUpsert.push({ key: 'contact_email', value: data.contactEmail });
    if (data.facebookUrl !== undefined) settingsToUpsert.push({ key: 'facebook_url', value: data.facebookUrl ?? '' });
    if (data.instagramUrl !== undefined) settingsToUpsert.push({ key: 'instagram_url', value: data.instagramUrl ?? '' });
    if (data.maintenanceMode !== undefined) settingsToUpsert.push({ key: 'maintenance_mode', value: String(data.maintenanceMode) });

    for (const { key, value } of settingsToUpsert) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value, updatedBy: user.userId },
        create: { key, value, updatedBy: user.userId },
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
