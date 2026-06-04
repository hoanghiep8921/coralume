'use client';

import { useInView } from '@/hooks/useInView';

/**
 * About Hero Section — full-height parallax hero
 * Stitch ref: coralume_our_story lines 141-153
 */
export function AboutHeroSection() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section
      ref={ref}
      className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient (image placeholder until CLB provides photo) */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/40 to-surface" />
      <div className="absolute inset-0 bg-primary-fixed-dim/20" />

      {/* Content */}
      <div className="relative z-10 text-center px-[var(--spacing-margin-mobile)] max-w-3xl mx-auto">
        <span
          className={`inline-block px-4 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-widest mb-6 transition-all duration-slow ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[10px]'
          }`}
          style={{ transitionDelay: '0ms' }}
        >
          Sứ mệnh của chúng tôi
        </span>

        <h1
          className={`font-display text-display-lg-mobile md:text-display-lg text-primary mb-6 transition-all duration-slow ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
          }`}
          style={{ transitionDelay: '150ms' }}
        >
          Khi Khoa học{' '}
          <span className="md:block">gặp gỡ Sự tận tâm</span>
        </h1>

        <p
          className={`font-body-lg text-body-lg text-on-surface-variant opacity-90 max-w-2xl mx-auto transition-all duration-slow ${
            isInView ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-[20px]'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          Tại Coralume, chúng tôi không chỉ bảo tồn; chúng tôi kiến tạo một tương lai
          bền vững cho đại dương thông qua sự kết hợp giữa dữ liệu chính xác và niềm
          đam mê bản địa.
        </p>
      </div>
    </section>
  );
}
