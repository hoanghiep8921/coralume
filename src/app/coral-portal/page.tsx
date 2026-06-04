import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { CoralPortalClient } from './CoralPortalClient';

export const metadata: Metadata = {
  title: 'Coral Portal — Coralume',
  description: 'Portal cho nhân viên trung tâm — cập nhật san hô',
  robots: { index: false },
};

async function checkAccess() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload && (payload.role === 'coral_staff' || payload.role === 'admin');
}

async function fetchPortalData() {
  try {
    const cookieStore = await cookies();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/portal/dashboard`, {
      headers: { Cookie: `token=${cookieStore.get('token')?.value || ''}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return (await res.json()).data;
  } catch { return null; }
}

export default async function CoralPortalPage() {
  const hasAccess = await checkAccess();
  if (!hasAccess) redirect('/dang-nhap');

  const data = await fetchPortalData();

  return (
    <main className="flex-1 bg-surface min-h-screen">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <CoralPortalClient data={data as any} />
    </main>
  );
}
