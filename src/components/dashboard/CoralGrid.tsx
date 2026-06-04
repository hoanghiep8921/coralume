'use client';

import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import Link from 'next/link';

interface CoralData {
  id: string;
  customName?: string | null;
  status: string;
  adoptedAt?: string | null;
  product?: { name: string; tier: string } | null;
  coral?: {
    id: string;
    code: string;
    species?: string | null;
    status: string;
    locationZone?: string | null;
    updates?: Array<{
      id: string;
      sizeCm?: number | null;
      health: string;
      notes?: string | null;
      images: string[];
      createdAt: string;
    }>;
  } | null;
}

interface CoralGridProps {
  corals: CoralData[];
  onSelectCoral: (coral: CoralData) => void;
}

const tierLabels: Record<string, string> = {
  standard: 'Seed Coral',
  premium: 'Reef Guardian',
  premium_plus: 'Diving',
};

const healthColors: Record<string, string> = {
  good: 'bg-green-500',
  average: 'bg-amber-500',
  needs_attention: 'bg-error',
};

const healthLabels: Record<string, string> = {
  good: 'Tốt',
  average: 'Trung bình',
  needs_attention: 'Cần chú ý',
};

/** FR-043: Coral Grid — responsive cards with modal trigger */
export function CoralGrid({ corals, onSelectCoral }: CoralGridProps) {
  const { ref, isInView } = useInView(0.1);

  // Empty state
  if (corals.length === 0) {
    return (
      <section className="mb-12 text-center py-16">
        <div className="mx-auto w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant/40" aria-hidden="true">
            water_drop
          </span>
        </div>
        <h2 className="font-display text-display-lg-mobile text-primary mb-3">
          Bạn chưa có san hô nào
        </h2>
        <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
          Nhận nuôi san hô đầu tiên của bạn và bắt đầu hành trình bảo tồn đại dương.
        </p>
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-container text-on-secondary font-semibold py-3 px-8 rounded-lg transition-all duration-normal hover:-translate-y-0.5 shadow-button"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">add_circle</span>
          Nhận nuôi san hô đầu tiên
        </Link>
      </section>
    );
  }

  return (
    <section ref={ref} className="mb-12">
      <h2 className="font-headline-md text-headline-md text-primary mb-6">
        Rạn san hô của tôi
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {corals.map((coral, i) => {
          const coralData = coral.coral;
          const health = coralData?.updates?.[0]?.health || 'good';

          return (
            <button
              key={coral.id}
              type="button"
              onClick={() => onSelectCoral(coral)}
              className={`text-left bg-surface-container-lowest rounded-xl border border-outline-variant shadow-card overflow-hidden transition-all duration-normal hover:-translate-y-1.5 hover:shadow-card-hover ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
              }`}
              style={{ transitionDelay: isInView ? `${i * 80}ms` : '0ms' }}
            >
              {/* Image placeholder */}
              <div className="h-48 bg-primary-fixed-dim/20 flex items-center justify-center relative">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/30" aria-hidden="true">
                  image
                </span>
                {/* Status dot */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-surface-container-lowest/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <div className={`w-2 h-2 rounded-full ${healthColors[health] || 'bg-green-500'}`} />
                  <span className="text-xs font-label-sm text-on-surface">
                    {healthLabels[health] || 'Tốt'}
                  </span>
                </div>
                {/* Coral ID badge */}
                {coralData?.code && (
                  <span className="absolute bottom-3 left-3 bg-primary/80 text-on-primary font-mono text-xs px-2 py-1 rounded">
                    {coralData.code}
                  </span>
                )}
              </div>

              {/* Card body */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline-md text-headline-md text-primary">
                    {coral.customName || coral.coral?.code || 'San hô chưa đặt tên'}
                  </h3>
                  {coral.product && (
                    <span className="bg-secondary/10 text-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                      {tierLabels[coral.product.tier] || coral.product.name}
                    </span>
                  )}
                </div>

                {coralData?.species && (
                  <p className="font-body-md text-on-surface-variant mb-3">
                    {coralData.species}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                  {coral.adoptedAt && (
                    <span>
                      Nhận nuôi:{' '}
                      {new Date(coral.adoptedAt).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                  {coralData?.locationZone && (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm" aria-hidden="true">location_on</span>
                      {coralData.locationZone}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
