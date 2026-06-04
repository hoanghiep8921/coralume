'use client';

import Link from 'next/link';

/**
 * FR-005 + FR-006: "From Nha Trang with Love" + CTA from Stitch
 *
 * Masonry grid layout:
 * - Large image (8 cols) with gradient overlay
 * - Two small cards (4 cols): image + map card
 * - CTA button below
 */
export function PartnerSection() {
  return (
    <section className="py-[var(--spacing-stack-lg)] md:py-32 px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto text-center">
      {/* Section Header */}
      <h2 className="font-heading-serif text-display-lg-mobile md:text-display-lg text-primary mb-[var(--spacing-stack-lg)]">
        From Nha Trang with Love
      </h2>

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[400px] md:h-[600px]">
        {/* Large Image */}
        <div className="md:col-span-8 rounded-3xl overflow-hidden relative group bg-primary-fixed-dim/20">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-8">
              <span className="material-symbols-outlined text-tertiary text-6xl mb-4" aria-hidden="true">
                landscape
              </span>
              <p className="text-on-surface-variant text-sm">
                Ảnh panoramic Nha Trang — Đang chờ CLB cung cấp
              </p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end p-8 md:p-12 text-left">
            <h4 className="text-white font-headline-md mb-2">Our Restoration Center</h4>
            <p className="text-white/80 max-w-md">
              Located in the heart of Vietnam&apos;s marine biodiversity, our center combines local wisdom with global technology.
            </p>
          </div>
        </div>

        {/* Right Column: 2 stacked cards */}
        <div className="md:col-span-4 grid grid-rows-2 gap-6">
          {/* Small Image */}
          <div className="rounded-3xl overflow-hidden premium-shadow bg-primary-fixed/20 flex items-center justify-center">
            <div className="text-center p-4">
              <span className="material-symbols-outlined text-tertiary text-4xl mb-2" aria-hidden="true">
                science
              </span>
              <p className="text-on-surface-variant text-xs">Phòng lab — Đang chờ ảnh</p>
            </div>
          </div>

          {/* Map Card */}
          <div className="bg-primary p-6 md:p-8 rounded-3xl flex flex-col justify-center text-left">
            <span className="material-symbols-outlined text-secondary-fixed text-4xl mb-4" aria-hidden="true">
              location_on
            </span>
            <h4 className="text-white font-headline-md mb-2">Nha Trang, Vietnam</h4>
            <p className="text-white/70 font-body-md text-sm">
              Visit our center to witness the growth of your coral firsthand. Open for Stewardship Tours by appointment.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-16 flex justify-center">
        <Link
          href="/san-pham"
          className="bg-secondary text-on-secondary px-10 py-4 rounded-full font-bold text-lg flex items-center gap-3 hover:gap-5 transition-all duration-normal hover:shadow-xl hover:-translate-y-1"
        >
          Become a Steward{' '}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
