'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

function useInView(threshold = 0.15, rootMargin = '-50px') {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isInView };
}

/**
 * FR-006: CTA Banner Cuối Trang
 * Gradient Navy → Teal, parallax nhẹ, CTA pulse 2s/lần
 * Updated to Stitch Material Design 3 tokens
 */
export function CTABannerSection() {
  const { ref, isInView } = useInView(0.15, '-50px');

  // Parallax effect on scroll
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        transform: `translateY(${scrollY * 0.02}px)`,
      }}
    >
      <div
        className={`py-20 md:py-[120px] transition-all duration-slow ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
        }`}
        style={{
          background: 'linear-gradient(135deg, #0F4C5C 0%, #5BA8B5 100%)',
        }}
      >
        <div className="container text-center px-4">
          {/* Headline */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-[48px] font-bold text-on-primary leading-[1.15] mb-6 max-w-2xl mx-auto">
            Sẵn sàng nhận nuôi san hô đầu tiên của bạn?
          </h2>

          {/* Sub */}
          <p className="text-on-primary/80 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Chỉ từ 200.000đ, bạn đã có thể bắt đầu hành trình bảo tồn san hô của riêng mình.
          </p>

          {/* CTA with pulse */}
          <Link
            href="/san-pham"
            className="inline-block bg-secondary hover:bg-secondary-container text-on-secondary font-semibold text-lg px-10 py-4 rounded-lg transition-all duration-normal hover:-translate-y-0.5 shadow-button cta-pulse"
          >
            Bắt đầu ngay →
          </Link>
        </div>
      </div>
    </section>
  );
}