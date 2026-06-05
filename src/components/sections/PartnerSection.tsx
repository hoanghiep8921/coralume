'use client';

import Link from 'next/link';
import { siteConfig } from '@/config/site';

/**
 * SRS FR-005: Đối tác đồng hành — Trung tâm san hô Nha Trang
 *
 * Section 5.1-5.2:
 * - Section header: "Đối tác đồng hành"
 * - Partner card: Trung tâm san hô Nha Trang với text tiếng Việt
 * - CTA "Tìm hiểu thêm" dẫn đến website đối tác
 */
export function PartnerSection() {
  return (
    <section className="py-[var(--spacing-stack-lg)] md:py-32 px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto text-center">
      {/* Section Header (SRS 5.1) */}
      <h2 className="font-heading-serif text-display-lg-mobile md:text-display-lg text-primary mb-[var(--spacing-stack-lg)]">
        Đối tác đồng hành
      </h2>

      {/* Partner Card (SRS 5.2) */}
      <div className="max-w-3xl mx-auto bg-surface-container-lowest rounded-2xl p-8 md:p-12 premium-shadow border border-outline-variant text-left">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Logo placeholder */}
          <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-4xl text-primary" aria-hidden="true">
              water
            </span>
          </div>

          <div className="flex-1">
            <h3 className="font-headline-md text-headline-md text-primary mb-3">
              Trung tâm san hô Nha Trang
            </h3>
            <p className="text-on-surface-variant font-body-md leading-relaxed mb-6">
              Tất cả san hô được chăm sóc bởi đội ngũ chuyên môn tại Nha Trang — đối tác
              chính thức của Coralume. Họ cập nhật trực tiếp dữ liệu growth của từng san hô
              lên hệ thống của chúng tôi.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={siteConfig.links.partner}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-secondary hover:text-on-secondary-container font-medium transition-colors text-sm"
              >
                Tìm hiểu thêm về đối tác →
              </a>
            </div>
          </div>
        </div>

        {/* Team image placeholder */}
        <div className="mt-8 h-48 bg-primary-fixed-dim/20 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-tertiary text-4xl mb-2" aria-hidden="true">
              group
            </span>
            <p className="text-on-surface-variant text-sm">
              Ảnh team trung tâm san hô — Đang chờ CLB cung cấp
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
