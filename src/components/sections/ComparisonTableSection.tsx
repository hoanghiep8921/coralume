'use client';

import { useInView } from '@/hooks/useInView';
import { comparisonFeatures, productTiers } from '@/data/products';

/**
 * FR-022: Comparison Table Section
 *
 * Feature-by-feature comparison table:
 * - Sticky header on scroll
 * - Sticky feature column on mobile horizontal scroll
 * - Zebra striping rows
 * - Highlighted Reef Guardian column
 */
export function ComparisonTableSection() {
  const { ref, isInView } = useInView(0.1, '-50px');

  return (
    <section
      ref={ref}
      className="py-[var(--spacing-stack-lg)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto"
    >
      {/* Section Header */}
      <div
        className={`text-center mb-10 transition-all duration-slow ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
        }`}
      >
        <h2 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">
          So sánh các gói
        </h2>
        <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Xem chi tiết từng tính năng để chọn gói phù hợp nhất với bạn.
        </p>
      </div>

      {/* Mobile hint */}
      <p className="text-sm text-on-surface-variant text-center mb-4 md:hidden">
        ← Kéo sang ngang để xem thêm →
      </p>

      {/* Scroll wrapper */}
      <div
        className={`overflow-x-auto rounded-xl border border-outline-variant shadow-premium transition-all duration-slow ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
        }`}
      >
        {/* min-w for mobile scroll */}
        <table className="w-full min-w-[600px] md:min-w-0 border-collapse">
          <thead>
            <tr>
              {/* Sticky feature column header */}
              <th className="sticky left-0 z-20 bg-surface-container-lowest px-6 py-4 text-left font-label-sm text-label-sm text-on-surface uppercase tracking-wider border-b border-outline-variant">
                Tính năng
              </th>
              {productTiers.map((tier) => (
                <th
                  key={tier.slug}
                  className={`sticky top-0 z-10 px-6 py-4 text-center font-headline-md text-headline-md border-b border-outline-variant ${
                    tier.isFeatured
                      ? 'bg-primary-container/5 text-primary'
                      : 'bg-surface-container-lowest text-primary'
                  }`}
                >
                  {tier.name}
                  {tier.isFeatured && (
                    <span className="block font-label-sm text-label-sm text-secondary mt-1">
                      {tier.badge}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonFeatures.map((feature, rowIdx) => (
              <tr
                key={rowIdx}
                className={
                  rowIdx % 2 === 0
                    ? 'bg-surface-container-lowest'
                    : 'bg-surface-container-low'
                }
              >
                {/* Sticky feature name cell */}
                <td className="sticky left-0 z-10 px-6 py-4 font-body-md font-medium text-on-surface border-b border-outline-variant/50 bg-inherit">
                  {feature.name}
                </td>
                {feature.values.map((val, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-6 py-4 text-center border-b border-outline-variant/50 ${
                      productTiers[colIdx]?.isFeatured
                        ? 'bg-primary-container/5'
                        : ''
                    }`}
                  >
                    {val === '✓' ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-on-tertiary-container/15 text-on-tertiary-container">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-label="Có"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span className="text-on-surface-variant/40 font-mono text-sm">
                        {val}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
