'use client';

import Link from 'next/link';
import { useInView } from '@/hooks/useInView';
import { productTiers, type ProductTierData } from '@/data/products';

/* ------------------------------------------------------------------ */
/*  ProductDetailCard — individual tier card with image, specs, CTA   */
/* ------------------------------------------------------------------ */

function ProductDetailCard({
  tier,
  index,
  isInView,
}: {
  tier: ProductTierData;
  index: number;
  isInView: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col h-full bg-surface-container-lowest rounded-xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-card-hover ${
        tier.isFeatured
          ? 'border-2 border-primary shadow-[0px_20px_50px_rgba(15,76,92,0.1)] lg:scale-105 lg:z-10'
          : 'border-outline-variant shadow-premium'
      } ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
      }`}
      style={{ transitionDelay: isInView ? `${index * 100}ms` : '0ms' }}
    >
      {/* Badge */}
      {tier.badge && tier.badgePosition === 'top-center' && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-secondary text-on-secondary font-label-sm text-label-sm py-1 px-4 rounded-full shadow-lg whitespace-nowrap">
            {tier.badge}
          </span>
        </div>
      )}
      {tier.badge && tier.badgePosition === 'top-left' && (
        <div className="absolute top-4 left-4 z-10">
          <span className={`backdrop-blur-md text-on-primary font-label-sm text-[10px] py-1 px-3 rounded-full uppercase tracking-widest ${
            tier.slug === 'diving-experience' ? 'bg-secondary/90' : 'bg-primary/90'
          }`}>
            {tier.badge}
          </span>
        </div>
      )}

      {/* Image placeholder */}
      <div
        className={`relative h-64 w-full overflow-hidden ${
          tier.isFeatured
            ? 'bg-gradient-to-t from-primary/40 to-transparent'
            : ''
        }`}
      >
        <div className="w-full h-full bg-primary-fixed-dim/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30" aria-hidden="true">
            image
          </span>
        </div>
        {/* Gradient overlay on featured */}
        {tier.isFeatured && (
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
        )}
        {/* Caption */}
        <span className="absolute bottom-4 left-4 text-on-primary text-xs font-label-sm bg-primary/60 px-2 py-1 rounded">
          Đang chờ ảnh từ CLB
        </span>
      </div>

      {/* Body */}
      <div className="p-[var(--spacing-stack-md)] flex-grow flex flex-col">
        {/* Name + Description */}
        <h3 className="font-headline-md text-headline-md text-primary mb-2">
          {tier.name}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-[var(--spacing-stack-md)]">
          {tier.description}
        </p>

        {/* Specs bento grid */}
        {tier.specs.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {tier.specs.map((spec, i) => (
              <div
                key={i}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  tier.isFeatured
                    ? 'bg-surface-container-lowest border border-primary/10'
                    : 'bg-surface-container-low'
                }`}
              >
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                  {spec.label}
                </span>
                {spec.valueType === 'icon' ? (
                  <span
                    className="material-symbols-outlined text-secondary text-xl"
                    aria-hidden="true"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {spec.value === 'verified'
                      ? 'verified'
                      : spec.value === 'biotech'
                        ? 'biotech'
                        : 'stars'}
                  </span>
                ) : spec.valueType === 'progress' ? (
                  <div className="w-20">
                    <div className="flex justify-between text-[10px] font-mono text-primary mb-1">
                      <span>{spec.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: spec.value }}
                      />
                    </div>
                  </div>
                ) : (
                  <span className="font-mono text-sm text-secondary font-medium">
                    {spec.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Benefits list */}
        <ul className="space-y-2 mb-8 flex-grow">
          {tier.benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
              <svg
                className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        {/* Pricing */}
        <div className="mb-4">
          <span className="font-mono text-headline-md text-primary">
            {tier.priceRange}
          </span>
          <span className="font-body-md text-on-surface-variant ml-1">
            {tier.priceUnit}
          </span>
        </div>

        {/* CTA */}
        <Link
          href={tier.ctaHref}
          className={`block w-full text-center py-4 rounded-xl font-bold font-body-lg transition-all hover:-translate-y-0.5 ${
            tier.isFeatured
              ? 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container shadow-xl shadow-primary/20'
              : 'bg-secondary text-on-secondary hover:opacity-90 shadow-lg shadow-secondary/20'
          }`}
        >
          {tier.ctaLabel} →
        </Link>
      </div>

      {/* Footer specs bar */}
      <div
        className={`p-4 border-t ${
          tier.isFeatured
            ? 'bg-primary text-on-primary border-primary-container'
            : 'bg-surface-container-lowest border-outline-variant/30'
        }`}
      >
        <span className="font-label-sm text-[11px] uppercase tracking-tighter opacity-70">
          {tier.isFeatured ? 'Công Nghệ Giám Sát' : 'Thông Số Kỹ Thuật'}
        </span>
        <ul className="mt-1 space-y-0.5">
          {tier.benefits.slice(0, 2).map((b, i) => (
            <li key={i} className="text-[12px] opacity-80 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-secondary flex-shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ProductDetailCardsSection — 3-column tier grid                    */
/* ------------------------------------------------------------------ */

/**
 * FR-021: Product Detail Cards Section
 * Stitch reference: coralume_choose_your_impact/code.html lines 154-274
 *
 * Full-detail tier cards with image, specs bento grid,
 * benefits list, pricing, and CTA buttons.
 * Featured card (Reef Guardian) visually elevated with scale + border.
 */
export function ProductDetailCardsSection() {
  const { ref, isInView } = useInView(0.1, '-50px');

  return (
    <section
      ref={ref}
      className="py-[var(--spacing-stack-lg)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto"
    >
      {/* Section Header */}
      <div
        className={`text-center mb-12 transition-all duration-slow ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
        }`}
      >
        <h2 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">
          Chọn gói nhận nuôi của bạn
        </h2>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Mỗi gói là một mức cam kết và một mức trải nghiệm khác nhau.
          Tất cả đều bắt đầu bằng một san hô có tên — của riêng bạn.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 items-start pt-4">
        {productTiers.map((tier, i) => (
          <ProductDetailCard
            key={tier.slug}
            tier={tier}
            index={i}
            isInView={isInView}
          />
        ))}
      </div>
    </section>
  );
}
