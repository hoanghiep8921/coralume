import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { LeaderboardClient } from './LeaderboardClient';

export const metadata: Metadata = {
  title: 'Bảng Xếp Hạng — Coralume',
  description:
    'Top những người nhận nuôi san hô tích cực nhất. Xem thứ hạng của bạn và cạnh tranh cùng cộng đồng.',
  alternates: {
    canonical: `${siteConfig.url}/bang-xep-hang`,
  },
  openGraph: {
    title: 'Coralume — Bảng Xếp Hạng',
    description:
      'Top người nhận nuôi san hô tại Coralume. Bạn đang ở vị trí nào?',
    url: `${siteConfig.url}/bang-xep-hang`,
    type: 'website',
  },
};

interface LeaderEntry {
  rank: number;
  id: string;
  fullName: string;
  avatarUrl: string | null;
  isPublic: boolean;
  role: string;
  _count: { adoptions: number };
}

interface MyRankingEntry extends LeaderEntry {
  nextRankGap: number | null;
}

interface LeaderboardData {
  rankings: LeaderEntry[];
  myRanking: MyRankingEntry | null;
  type: string;
}

async function fetchLeaderboard(
  type: string
): Promise<LeaderboardData | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(
      `${baseUrl}/api/v1/leaderboard?type=${type}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as LeaderboardData;
  } catch {
    return null;
  }
}

export default async function LeaderboardPage() {
  const [monthlyData, allTimeData] = await Promise.all([
    fetchLeaderboard('monthly'),
    fetchLeaderboard('allTime'),
  ]);

  return (
    <main className="flex-1">
      {/* Hero with light gradient */}
      <section className="relative pt-24 pb-16 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] bg-gradient-to-b from-primary-fixed-dim/30 via-primary-fixed-dim/10 to-surface">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-secondary font-label-sm uppercase tracking-widest mb-3 block">
            Leaderboard
          </span>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">
            Bảng xếp hạng
          </h1>
          <p className="font-body-lg text-on-surface-variant mb-2">
            Cùng nhau làm nên sự khác biệt
          </p>
          <p className="font-body-md text-on-surface-variant/70">
            Top những người nhận nuôi san hô tích cực nhất. Mỗi san hô được
            nhận nuôi là một bước tiến cho đại dương.
          </p>
        </div>
      </section>

      {/* Rankings content */}
      <section className="px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] pb-16">
        <div className="max-w-3xl mx-auto">
          <LeaderboardClient
            monthlyData={monthlyData}
            allTimeData={allTimeData}
          />
        </div>
      </section>
    </main>
  );
}
