import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { UpdateForm } from './UpdateForm';

export const metadata: Metadata = {
  title: 'Cập nhật san hô — Coral Portal',
  robots: { index: false },
};

async function fetchCoral(coralId: string) {
  try {
    const cookieStore = await cookies();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/portal/dashboard`, {
      headers: { Cookie: `token=${cookieStore.get('token')?.value || ''}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    const corals = json.data?.corals || [];
    return corals.find((c: { id: string }) => c.id === coralId) || null;
  } catch { return null; }
}

export default async function UpdatePage({
  searchParams,
}: {
  searchParams: Promise<{ coralId?: string }>;
}) {
  const { coralId } = await searchParams;
  if (!coralId) redirect('/coral-portal');

  const coral = await fetchCoral(coralId);
  if (!coral) redirect('/coral-portal');

  return (
    <main className="flex-1 bg-surface min-h-screen">
      <div className="max-w-lg mx-auto px-[var(--spacing-margin-mobile)] py-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <UpdateForm coral={coral as any} />
      </div>
    </main>
  );
}
