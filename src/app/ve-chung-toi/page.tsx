import type { Metadata } from 'next';
import { AboutHeroSection } from '@/components/sections/AboutHeroSection';
import { StorySection } from '@/components/sections/StorySection';
import { ProcessTimelineSection } from '@/components/sections/ProcessTimelineSection';
import { TransparencyCommitmentSection } from '@/components/sections/TransparencyCommitmentSection';
import { PartnersSection } from '@/components/sections/PartnersSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { AboutCTASection } from '@/components/sections/AboutCTASection';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Về Chúng Tôi — Coralume',
  description:
    'Chúng tôi không phải tổ chức từ thiện. Chúng tôi là một cách khác để bảo vệ đại dương. Hành trình bảo tồn rạn san hô tại Nha Trang qua công nghệ và cộng đồng.',
  alternates: {
    canonical: `${siteConfig.url}/ve-chung-toi`,
  },
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
 * SRS FR-010 → FR-015
 *
 * Sections:
 * 1. AboutHeroSection — SRS A-01: line-by-line reveal headline
 * 2. StorySection — SRS A-02→A-05: founder story
 * 3. ProcessTimelineSection — SRS A-06→A-09: 4-step process
 * 4. TransparencyCommitmentSection — SRS A-10: 100% reinvestment
 * 5. PartnersSection — SRS FR-013: strategic partners
 * 6. TeamSection — SRS FR-013: team grid
 * 7. AboutCTASection — dark teal CTA banner
 */
export default function AboutPage() {
  return (
    <main className="flex-1">
      <AboutHeroSection />
      <StorySection />
      <ProcessTimelineSection />
      <TransparencyCommitmentSection />
      <PartnersSection />
      <TeamSection />
      <AboutCTASection />
    </main>
  );
}
