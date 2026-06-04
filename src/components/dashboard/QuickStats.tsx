'use client';

import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';

interface QuickStatsProps {
  totalCorals: number;
  reefArea: number;
  monthsActive: number;
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  isInView,
}: {
  icon: string;
  label: string;
  value: number;
  suffix: string;
  isInView: boolean;
}) {
  const current = useCountUp(value, 2000, isInView);

  return (
    <div className="bg-white rounded-2xl p-8 premium-shadow">
      <span className="material-symbols-outlined text-secondary text-3xl mb-3 block" aria-hidden="true">
        {icon}
      </span>
      <div className="font-mono text-3xl text-primary font-bold mb-1">
        {current.toLocaleString('vi-VN')}
        <span className="text-xl">{suffix}</span>
      </div>
      <p className="font-body-md text-on-surface-variant">{label}</p>
    </div>
  );
}

/** FR-042: Quick Stats — 3 indicators with CountUp */
export function QuickStats({ totalCorals, reefArea, monthsActive }: QuickStatsProps) {
  const { ref, isInView } = useInView(0.15);

  return (
    <section ref={ref} className="mb-12">
      <h2 className="font-headline-md text-headline-md text-primary mb-6">
        Tổng quan
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          icon="water_drop"
          label="Tổng san hô đang chăm sóc"
          value={totalCorals}
          suffix=""
          isInView={isInView}
        />
        <StatCard
          icon="landscape"
          label="Diện tích rạn hỗ trợ (m²)"
          value={reefArea}
          suffix="m²"
          isInView={isInView}
        />
        <StatCard
          icon="calendar_month"
          label="Tháng đồng hành"
          value={monthsActive}
          suffix=" tháng"
          isInView={isInView}
        />
      </div>
    </section>
  );
}
