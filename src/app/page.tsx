import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { PartnerSection } from '@/components/sections/PartnerSection';

export const metadata: Metadata = {
  title: 'Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương',
  description:
    'Premium Coral Stewardship — Adopt a coral in Nha Trang, Vietnam. Track growth, get quarterly reports. Your coral. Your story. Your impact.',
  openGraph: {
    title: 'Coralume — Premium Coral Stewardship',
    description:
      'Adopt a coral in Nha Trang, Vietnam. Track growth, get quarterly reports. Your coral. Your story. Your impact.',
    url: 'https://coralume.vn',
    type: 'website',
  },
};

/**
 * Home Page — Coralume
 * Matches Stitch design: coralume_home_1/code.html
 *
 * Sections:
 * 1. Hero (WebGL shader + gradient overlay + 2 CTAs)
 * 2. Stats ("Real Impact, Real Data" — 3 metric cards)
 * 3. How It Works ("Your Stewardship Journey" — 2-column)
 * 4. From Nha Trang with Love (masonry + CTA)
 */
export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <PartnerSection />
    </main>
  );
}
