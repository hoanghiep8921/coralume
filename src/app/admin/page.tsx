import { AdminDashboardClient } from './AdminDashboardClient';

async function getStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const res = await fetch(`${baseUrl}/api/v1/admin/dashboard`, {
      headers: { Cookie: `token=${cookieStore.get('token')?.value || ''}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch { return null; }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="font-display text-display-lg-mobile text-primary mb-6">Dashboard</h1>
      <AdminDashboardClient stats={stats} />
    </div>
  );
}
