'use client';

import { useInView } from '@/hooks/useInView';

/**
 * FR-020: Products Hero Section
 * Stitch reference: coralume_choose_your_impact/code.html lines 143-152
 *
 * Centered layout with badge chip + headline + sub-headline.
 * Fade-in reveal on scroll.
 */
export function ProductsHeroSection() {
  const { ref, isInView } = useInView(0.15, '-50px');

  return (
    <section
      ref={ref}
      className="pt-40 pb-[var(--spacing-stack-lg)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto text-center"
    >
      {/* Badge chip */}
      <span
        className={`font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary mb-[var(--spacing-stack-sm)] block transition-all duration-slow ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'
        }`}
        style={{ transitionDelay: '0ms' }}
      >
        Đầu tư vào Tương lai Đại dương
      </span>

      {/* Headline */}
      <h1
        className={`font-display text-display-lg-mobile md:text-display-lg text-primary mb-[var(--spacing-stack-md)] max-w-3xl mx-auto leading-tight transition-all duration-slow ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
        }`}
        style={{ transitionDelay: '100ms' }}
      >
        Nuôi 1 bé san hô{' '}
        <span className="md:block italic text-secondary">ngay tại đây!</span>
      </h1>

      {/* Sub-headline */}
      <p
        className={`font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto transition-all duration-slow ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        Mỗi gói bảo tồn được thiết kế để mang lại tác động tối đa đến đa dạng sinh học biển.
        Từ việc nuôi trồng mầm sống đến giám sát bằng trí tuệ nhân tạo.
      </p>
    </section>
  );
}
