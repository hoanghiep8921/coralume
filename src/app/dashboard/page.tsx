import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { DashboardClient } from './DashboardClient';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Dashboard — Coralume',
  description:
    'Theo dõi san hô của bạn. Dashboard cá nhân với growth tracking, impact metrics và chứng nhận.',
  openGraph: {
    title: 'Coralume — Dashboard cá nhân',
    description:
      'Theo dõi san hô của bạn tại Coralume. Growth tracking, impact metrics, chứng nhận.',
    url: `${siteConfig.url}/dashboard`,
    type: 'website',
  },
};

async function getDashboardData() {
  try {
    const cookieStore = await cookies();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/v1/dashboard`, {
      headers: { Cookie: `token=${cookieStore.get('token')?.value || ''}` },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  // If data is null, user is not authenticated — middleware should have caught this
  if (!data) {
    redirect('/dang-nhap?callbackUrl=/dashboard');
  }

  return (
    <main className="flex-1 bg-surface pt-24 pb-16 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
      <div className="max-w-[var(--spacing-container-max)] mx-auto">
        <DashboardClient data={data} />
      </div>
    </main>
  );
}
