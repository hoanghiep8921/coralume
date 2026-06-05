import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/HeroSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { ProductsPreviewSection } from '@/components/sections/ProductsPreviewSection';
import { PartnerSection } from '@/components/sections/PartnerSection';
import { CTABannerSection } from '@/components/sections/CTABannerSection';
import { ImpactTotalsSection } from '@/components/sections/ImpactTotalsSection';

export const metadata: Metadata = {
  title: 'Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương',
  description:
    'Nhận nuôi san hô tại Nha Trang, Việt Nam. Theo dõi sự phát triển, nhận báo cáo hàng quý. San hô của bạn. Hành trình của bạn. Tác động của bạn.',
  alternates: {
    canonical: 'https://coralume.vn',
  },
  openGraph: {
    title: 'Coralume — Nhận nuôi san hô, Gieo mầm cho đại dương',
    description:
      'Nhận nuôi san hô tại Nha Trang, Việt Nam. Theo dõi sự phát triển, nhận báo cáo hàng quý.',
    url: 'https://coralume.vn',
    type: 'website',
  },
};

/**
 * Home Page — Coralume
 * SRS FR-001 → FR-007: 6 sections
 *
 * Sections:
 * 1. Hero (WebGL shader + gradient overlay + 2 CTAs)
 * 2. Stats (SRS FR-002: 3 scientific metrics)
 * 3. How It Works (SRS FR-003: 3 steps)
 * 4. Products Preview (SRS FR-004: 3 tier cards)
 * 5. Partners (SRS FR-005: strategic partners)
 * 6. CTA Banner (SRS FR-006: gradient + pulse)
 * Footer in layout.tsx (SRS FR-007)
 */
export default function HomePage() {
  return (
    <main className="flex-1">
      <HeroSection />
      <StatsSection />
      <ImpactTotalsSection />
      <HowItWorksSection />
      <ProductsPreviewSection />
      <PartnerSection />
      <CTABannerSection />
    </main>
  );
}
