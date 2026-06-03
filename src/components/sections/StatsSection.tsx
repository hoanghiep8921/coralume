'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';

function AnimatedNumber({
  target,
  suffix = '',
  isInView,
}: {
  target: number;
  suffix?: string;
  isInView: boolean;
}) {
  const current = useCountUp(target, 2000, isInView);
  return (
    <span className="font-mono font-medium">
      {current.toLocaleString('vi-VN')}
      {suffix}
    </span>
  );
}

/**
 * FR-002: Stats Section — "Real Impact, Real Data" from Stitch
 *
 * 3 stat cards with:
 * - Material Symbols icon
 * - Badge (Live Count / Community / Resilience)
 * - Big number with count-up animation
 * - Description text
 * - Progress bar / avatar stack / SVG chart
 */
export function StatsSection() {
  const { ref, isInView } = useInView(0.15, '-50px');

  return (
    <section ref={ref} className="py-24 px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="text-secondary font-label-sm uppercase tracking-widest mb-2 block">
          Transparency & Science
        </span>
        <h2 className="font-heading-serif text-headline-md md:text-display-lg text-primary">
          Real Impact, Real Data
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stat Card 1: Corals Adopted */}
        <div className="bg-surface-container-lowest p-8 rounded-xl premium-shadow border border-surface-container">
          <div className="flex justify-between items-start mb-6">
            <span className="material-symbols-outlined text-secondary text-4xl" aria-hidden="true">
              water_drop
            </span>
            <span className="bg-tertiary-container/10 text-tertiary px-3 py-1 rounded-full font-mono text-xs uppercase">
              Live Count
            </span>
          </div>
          <div className="font-mono text-4xl text-primary mb-2">
            <AnimatedNumber target={500} suffix="+" isInView={isInView} />
          </div>
          <p className="font-body-md text-on-surface-variant">
            Corals Adopted into our Nha Trang nurseries this year.
          </p>
          <div className="mt-6 pt-6 border-t border-surface-container">
            <div className="flex justify-between text-xs font-label-sm mb-2">
              <span>Restoration Target</span>
              <span>84%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-secondary to-secondary-fixed"
                style={{ width: '84%' }}
              />
            </div>
          </div>
        </div>

        {/* Stat Card 2: Adopters Worldwide */}
        <div className="bg-surface-container-lowest p-8 rounded-xl premium-shadow border border-surface-container">
          <div className="flex justify-between items-start mb-6">
            <span className="material-symbols-outlined text-secondary text-4xl" aria-hidden="true">
              public
            </span>
            <span className="bg-tertiary-container/10 text-tertiary px-3 py-1 rounded-full font-mono text-xs uppercase">
              Community
            </span>
          </div>
          <div className="font-mono text-4xl text-primary mb-2">
            <AnimatedNumber target={1200} isInView={isInView} />
            <span className="text-2xl">+</span>
          </div>
          <p className="font-body-md text-on-surface-variant">
            Adopters Worldwide joining the stewardship movement.
          </p>
          <div className="mt-6 flex gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary-fixed" />
            <div className="w-8 h-8 rounded-full bg-primary-fixed" />
            <div className="w-8 h-8 rounded-full bg-tertiary-fixed" />
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold">
              +1k
            </div>
          </div>
        </div>

        {/* Stat Card 3: Survival Rate */}
        <div className="bg-surface-container-lowest p-8 rounded-xl premium-shadow border border-surface-container">
          <div className="flex justify-between items-start mb-6">
            <span className="material-symbols-outlined text-secondary text-4xl" aria-hidden="true">
              eco
            </span>
            <span className="bg-tertiary-container/10 text-tertiary px-3 py-1 rounded-full font-mono text-xs uppercase">
              Resilience
            </span>
          </div>
          <div className="font-mono text-4xl text-primary mb-2">
            <AnimatedNumber target={98} suffix="%" isInView={isInView} />
          </div>
          <p className="font-body-md text-on-surface-variant">
            Survival Rate monitored by our expert marine biologists.
          </p>
          <div className="mt-6">
            <svg className="w-full h-12" viewBox="0 0 200 40">
              <path
                d="M0 35 Q 20 30, 40 32 T 80 20 T 120 25 T 160 10 T 200 15"
                fill="none"
                stroke="var(--color-surface-tint, #306576)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
