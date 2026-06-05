import type { Metadata } from 'next';
import { ProductsHeroSection } from '@/components/sections/ProductsHeroSection';
import { ProductDetailCardsSection } from '@/components/sections/ProductDetailCardsSection';
import { ComparisonTableSection } from '@/components/sections/ComparisonTableSection';
import { AmbassadorSection } from '@/components/sections/AmbassadorSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { siteConfig } from '@/config/site';
import { productTiers, faqItems } from '@/data/products';
import {
  StructuredData,
  breadcrumbSchema,
  faqPageSchema,
  productSchema,
} from '@/components/layout/StructuredData';

export const metadata: Metadata = {
  title: 'Sản Phẩm — Coralume',
  description:
    'Nhận nuôi san hô tại Nha Trang. 3 gói: Seed Coral (200K-300Kđ), Reef Guardian (500K-700Kđ), Diving Experience (1M-2Mđ). Certificate, dashboard, GPS tracking.',
  alternates: {
    canonical: `${siteConfig.url}/san-pham`,
  },
  openGraph: {
    title: 'Coralume — Chọn gói nhận nuôi san hô',
    description:
      '3 gói nhận nuôi san hô tại Nha Trang, Việt Nam. Seed Coral, Reef Guardian, Diving Experience. Từ 200.000đ.',
    url: `${siteConfig.url}/san-pham`,
    type: 'website',
  },
};

/**
 * Products Page — Coralume
 * References Stitch: coralume_choose_your_impact/code.html
 *
 * Sections:
 * 1. ProductsHeroSection (FR-020) — badge + headline + sub
 * 2. ProductDetailCardsSection (FR-021) — 3 tier detail cards
 * 3. ComparisonTableSection (FR-022) — feature comparison table
 * 4. AmbassadorSection (FR-023) — referral program
 * 5. FAQSection (FR-024) — 5-question accordion
 */
export default function ProductsPage() {
  const priceMap: Record<string, { min: number; max: number }> = {
    'seed-coral': { min: 200000, max: 300000 },
    'reef-guardian': { min: 500000, max: 700000 },
    'diving-experience': { min: 1000000, max: 2000000 },
  };

  return (
    <>
      {/* Schema.org BreadcrumbList */}
      <StructuredData
        data={breadcrumbSchema([
          { name: 'Trang chủ', url: siteConfig.url },
          { name: 'Sản phẩm', url: `${siteConfig.url}/san-pham` },
        ])}
      />
      {/* Schema.org FAQPage — Google rich results */}
      <StructuredData data={faqPageSchema(faqItems)} />
      {/* Schema.org Product — 3 gói */}
      {productTiers.map((tier) => {
        const prices = priceMap[tier.slug] || { min: 200000, max: 300000 };
        return (
          <StructuredData
            key={tier.slug}
            data={productSchema({
              name: tier.name,
              description: tier.description,
              slug: tier.slug,
              imageUrl: tier.imageUrl,
              priceMin: prices.min,
              priceMax: prices.max,
            })}
          />
        );
      })}

      <main className="flex-1">
        <ProductsHeroSection />
        <ProductDetailCardsSection />
        <ComparisonTableSection />
        <AmbassadorSection />
        <FAQSection />
      </main>
    </>
  );
}
