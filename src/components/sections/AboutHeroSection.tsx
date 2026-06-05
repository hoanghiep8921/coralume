'use client';

import { useInView } from '@/hooks/useInView';

/**
 * SRS A-01: About Hero Section
 *
 * Headline: "Chúng tôi không phải tổ chức từ thiện.
 *            Chúng tôi là một cách khác để bảo vệ đại dương."
 * With line-by-line reveal animation (Design Spec 4.3.15)
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

        {/* Line-by-line reveal (SRS A-01, Design Spec 4.3.15) */}
        <h1 className="font-heading-serif text-display-lg-mobile md:text-display-lg text-primary mb-6 leading-tight">
          <span
            className={`block transition-all duration-slow ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            Chúng tôi không phải tổ chức từ thiện.
          </span>
          <span
            className={`block mt-2 transition-all duration-slow ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            Chúng tôi là một cách khác để{' '}
            <span className="text-secondary italic">bảo vệ đại dương.</span>
          </span>
        </h1>

        <p
          className={`font-body-lg text-body-lg text-on-surface-variant opacity-90 max-w-2xl mx-auto transition-all duration-slow ${
            isInView ? 'opacity-90 translate-y-0' : 'opacity-0 translate-y-[20px]'
          }`}
          style={{ transitionDelay: '650ms' }}
        >
          Tại Coralume, chúng tôi kết hợp dữ liệu khoa học chính xác với niềm đam mê
          bản địa — tạo ra một mô hình bảo tồn nơi mỗi người đều có thể tham gia và
          nhìn thấy tác động thực sự của mình.
        </p>
      </div>
    </section>
  );
}
