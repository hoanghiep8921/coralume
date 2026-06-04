'use client';

import Link from 'next/link';
import { useInView } from '@/hooks/useInView';

/**
 * About CTA Section — dark teal container with decorative blobs
 * Stitch ref: coralume_our_story lines 276-290
 */
export function AboutCTASection() {
  const { ref, isInView } = useInView(0.15);

  return (
    <section
      ref={ref}
      className="mb-32 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto"
    >
      <div
        className={`bg-primary rounded-[48px] p-12 md:p-24 relative overflow-hidden text-center transition-all duration-slow ${
          isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.97]'
        }`}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-tertiary-container/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="font-display text-display-lg-mobile md:text-display-lg text-on-primary mb-6">
            Bạn đã sẵn sàng trở thành một phần của câu chuyện?
          </h2>
          <p className="text-on-primary-container font-body-lg mb-10 opacity-90">
            Mỗi san hô được nhận nuôi là một chương mới trong hành trình phục hồi
            đại dương. Hãy cùng chúng tôi viết tiếp câu chuyện này.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/san-pham"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-container text-on-secondary px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-button"
            >
              Nhận nuôi San hô ngay
              <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </Link>

            <Link
              href="/bucket/impact-report"
              className="inline-flex items-center gap-2 border border-on-primary/30 text-on-primary hover:bg-on-primary/10 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300"
            >
              Xem báo cáo tác động
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
