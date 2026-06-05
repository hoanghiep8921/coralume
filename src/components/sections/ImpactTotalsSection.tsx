'use client';

import { useState, useEffect } from 'react';

interface ImpactData {
  totalCorals: number;
  totalAdopters: number;
  activeAdoptions: number;
  reefArea: number;
  co2Absorbed: number;
  marineLife: number;
}

/**
 * Impact Totals Section — displays live Coralume aggregate metrics.
 * Fetches from GET /api/v1/impact/totals (public).
 * SRS 1.1: "Xem số liệu impact tổng hợp (không thấy chi tiết cá nhân)"
 */
export function ImpactTotalsSection() {
  const [data, setData] = useState<ImpactData | null>(null);

  useEffect(() => {
    fetch('/api/v1/impact/totals')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) setData(json.data);
      })
      .catch(() => {
        // Silently fail — section is optional
      });
  }, []);

  if (!data || data.totalCorals === 0) return null;

  const metrics = [
    {
      value: data.totalCorals,
      label: 'San hô được nhận nuôi',
      icon: 'water_drop',
    },
    {
      value: data.totalAdopters,
      label: 'Người nhận nuôi',
      icon: 'group',
    },
    {
      value: `${data.reefArea.toLocaleString('vi-VN')} m²`,
      label: 'Rạn san hô được bảo vệ',
      icon: 'globe',
    },
    {
      value: `${data.co2Absorbed.toLocaleString('vi-VN')} kg`,
      label: 'CO₂ hấp thụ ước tính',
      icon: 'co2',
    },
  ];

  return (
    <section className="bg-surface-container-lowest py-12 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
      <div className="max-w-[var(--spacing-container-max)] mx-auto">
        <div className="text-center mb-8">
          <span className="text-secondary font-label-sm uppercase tracking-widest mb-2 block">
            Tác động của chúng ta
          </span>
          <h2 className="font-headline-md text-headline-md text-primary">
            Cùng nhau tạo nên sự khác biệt
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="text-center p-4"
            >
              <span
                className="material-symbols-outlined text-3xl text-secondary mb-2"
                aria-hidden="true"
              >
                {metric.icon}
              </span>
              <div className="font-mono text-2xl text-primary font-bold">
                {metric.value}
              </div>
              <div className="text-on-surface-variant font-body-md text-sm mt-1">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
