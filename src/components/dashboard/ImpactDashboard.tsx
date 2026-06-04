'use client';

import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';

interface ImpactDashboardProps {
  totalCorals: number;
  reefArea: number;
  co2Absorbed: number;
  marineLife: number;
}

function ImpactCard({
  icon,
  label,
  value,
  suffix,
  color,
  isInView,
}: {
  icon: string;
  label: string;
  value: number;
  suffix: string;
  color: string;
  isInView: boolean;
}) {
  const current = useCountUp(value, 2500, isInView);

  return (
    <div className={`bg-surface-container-lowest rounded-xl p-6 premium-shadow border border-surface-container ${color}`}>
      <span className="material-symbols-outlined text-secondary text-3xl mb-3 block" aria-hidden="true">
        {icon}
      </span>
      <div className="font-mono text-3xl text-primary font-bold mb-1">
        {current.toLocaleString('vi-VN')}
        <span className="text-xl text-on-surface-variant">{suffix}</span>
      </div>
      <p className="font-body-md text-on-surface-variant">{label}</p>
    </div>
  );
}

/** FR-045: Impact Dashboard — 4 aggregate indicators */
export function ImpactDashboard({
  totalCorals,
  reefArea,
  co2Absorbed,
  marineLife,
}: ImpactDashboardProps) {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="mb-12">
      <h2 className="font-headline-md text-headline-md text-primary mb-6">
        Tác động của bạn
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ImpactCard
          icon="water_drop"
          label="Tổng san hô nhận nuôi"
          value={totalCorals}
          suffix=""
          color=""
          isInView={isInView}
        />
        <ImpactCard
          icon="landscape"
          label="Diện tích rạn hỗ trợ"
          value={reefArea}
          suffix=" m²"
          color=""
          isInView={isInView}
        />
        <ImpactCard
          icon="co2"
          label="CO₂ ước tính hấp thụ"
          value={co2Absorbed}
          suffix=" kg"
          color=""
          isInView={isInView}
        />
        <ImpactCard
          icon="diversity_3"
          label="Sinh vật biển hỗ trợ"
          value={marineLife}
          suffix="+"
          color=""
          isInView={isInView}
        />
      </div>
    </section>
  );
}
