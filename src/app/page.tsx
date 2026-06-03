import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { ProductsPreviewSection } from '@/components/sections/ProductsPreviewSection';
import { PartnerSection } from '@/components/sections/PartnerSection';
import { CTABannerSection } from '@/components/sections/CTABannerSection';

export const metadata: Metadata = {
  title: 'Trang Chủ — Coralume',
  description:
    'Nhận nuôi san hô — Gieo mầm cho đại dương. Theo dõi san hô của bạn qua dashboard. Từ 200.000đ.',
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
 * Recoded to match Stitch design (coralume_home_1/code.html)
 * All components use Stitch Material Design 3 tokens
 *
 * Sections:
 * 1. Hero (WebGL shader + gradient overlay + CTAs)
 * 2. Stats ("Real Impact, Real Data" — 3 stat cards)
 * 3. How It Works ("Your Stewardship Journey" — 2-column)
 * 4. Products Preview (3 tier cards)
 * 5. Partner ("From Nha Trang with Love" — masonry grid)
 * 6. CTA Banner (gradient Navy→Teal, pulse button)
 */
export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <HeroSection />

      {/* Stats */}
      <StatsSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Products Preview */}
      <ProductsPreviewSection />

      {/* Partner */}
      <PartnerSection />

      {/* CTA Banner */}
      <CTABannerSection />
    </main>
  );
}
