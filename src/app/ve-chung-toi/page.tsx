import type { Metadata } from 'next';
import { AboutHeroSection } from '@/components/sections/AboutHeroSection';
import { StorySection } from '@/components/sections/StorySection';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { AboutCTASection } from '@/components/sections/AboutCTASection';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Về Chúng Tôi — Coralume',
  description:
    'Coralume — Khi khoa học gặp gỡ sự tận tâm. Hành trình bảo tồn rạn san hô tại Nha Trang qua công nghệ và cộng đồng.',
  openGraph: {
    title: 'Coralume — Về Chúng Tôi',
    description:
      'Khám phá câu chuyện, sứ mệnh và đội ngũ của Coralume — nền tảng nhận nuôi san hô tại Nha Trang, Việt Nam.',
    url: `${siteConfig.url}/ve-chung-toi`,
    type: 'website',
  },
};

/**
 * About Page — Coralume
 * References Stitch: coralume_our_story/code.html
 *
 * Sections:
 * 1. AboutHeroSection — full-height parallax hero with badge + headline
 * 2. StorySection — 2-column (text + stat card | image + floating quote)
 * 3. PartnersSection — 3 strategic partner cards
 * 4. TeamSection — 4-column team grid with hover zoom
 * 5. AboutCTASection — dark teal CTA banner with decorative blobs
 */
export default function AboutPage() {
  return (
    <main className="flex-1">
      <AboutHeroSection />
      <StorySection />
      <PartnersSection />
      <TeamSection />
      <AboutCTASection />
    </main>
  );
}
