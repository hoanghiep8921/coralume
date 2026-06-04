import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { CommunityClient } from './CommunityClient';

export const metadata: Metadata = {
  title: 'Cộng Đồng — Coralume',
  description: 'Khám phá câu chuyện, hình ảnh từ cộng đồng người nhận nuôi san hô. Chia sẻ hành trình của bạn.',
  openGraph: {
    title: 'Coralume — Cộng Đồng',
    description: 'Câu chuyện và hình ảnh từ cộng đồng người nhận nuôi san hô tại Coralume.',
    url: `${siteConfig.url}/cong-dong`,
    type: 'website',
  },
};

interface Submission {
  id: string;
  content: string;
  images: string[];
  createdAt: string;
  user: { fullName: string; isPublic: boolean };
}

async function fetchSubmissions() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/community`, { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()).data as Submission[];
  } catch { return []; }
}

export default async function CommunityPage() {
  const submissions = await fetchSubmissions();

  return (
    <main className="flex-1 bg-surface pt-24 pb-16 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
      <div className="max-w-[var(--spacing-container-max)] mx-auto">
        <div className="text-center mb-12">
          <span className="text-secondary font-label-sm uppercase tracking-widest mb-2 block">Cộng đồng</span>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">Câu chuyện từ Cộng đồng</h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Khám phá hành trình nhận nuôi san hô được chia sẻ bởi cộng đồng Coralume.
          </p>
        </div>
        <CommunityClient submissions={submissions} />
      </div>
    </main>
  );
}
