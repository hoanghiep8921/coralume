import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { LeaderboardClient } from './LeaderboardClient';

export const metadata: Metadata = {
  title: 'Bảng Xếp Hạng — Coralume',
  description: 'Top những người nhận nuôi san hô tích cực nhất. Xem thứ hạng của bạn và cạnh tranh cùng cộng đồng.',
  openGraph: {
    title: 'Coralume — Bảng Xếp Hạng',
    description: 'Top người nhận nuôi san hô tại Coralume. Bạn đang ở vị trí nào?',
    url: `${siteConfig.url}/bang-xep-hang`,
    type: 'website',
  },
};

interface LeaderData {
  id: string;
  rank: number;
  fullName: string;
  isPublic: boolean;
  role: string;
  _count: { adoptions: number };
}

async function fetchLeaderboard() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/leaderboard`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()).data as { allTime: LeaderData[]; myRanking: LeaderData | null };
  } catch { return null; }
}

export default async function LeaderboardPage() {
  const data = await fetchLeaderboard();

  return (
    <main className="flex-1 bg-surface pt-24 pb-16 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-secondary font-label-sm uppercase tracking-widest mb-2 block">Leaderboard</span>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">Bảng Xếp Hạng</h1>
          <p className="font-body-lg text-on-surface-variant">Top những người nhận nuôi san hô tích cực nhất</p>
        </div>
        <LeaderboardClient data={data} />
      </div>
    </main>
  );
}
