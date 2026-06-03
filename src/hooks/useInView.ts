'use client';

import { useRef, useState, useEffect } from 'react';

/**
 * IntersectionObserver hook — triggers once when element enters viewport.
 * Used across all section components for scroll-reveal animations.
 */
export function useInView(threshold = 0.15, rootMargin = '-50px') {
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
