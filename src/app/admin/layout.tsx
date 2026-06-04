import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { verifyToken, canAccess } from '@/lib/auth';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: { default: 'Admin — Coralume', template: '%s | Admin' },
  robots: { index: false, follow: false },
};

async function getAdminSession(): Promise<{ email: string; role: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    if (!payload || !canAccess(payload.role, 'editor')) return null;
    return { email: payload.email, role: payload.role };
  } catch {
    return null;
  }
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect('/dang-nhap');

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar role={session.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader adminName={session.email} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
