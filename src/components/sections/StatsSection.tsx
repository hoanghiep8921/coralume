'use client';

import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';

function AnimatedNumber({
  target,
  suffix = '',
  prefix = '',
  isInView,
  decimals = 0,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  isInView: boolean;
  decimals?: number;
}) {
  const current = useCountUp(target, 2000, isInView);
  return (
    <span className="font-mono font-medium">
      {prefix}
      {current.toLocaleString('vi-VN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

/**
 * SRS FR-002: Stats Section — "San hô — Nền tảng sự sống của đại dương"
 *
 * 3 scientific stats from SRS H-06, H-07, H-08:
 * - "< 1% — Tỉ lệ diện tích đáy biển mà san hô chiếm"
 * - "25% — Lượng sinh vật biển phụ thuộc vào san hô"
 * - "50% — Diện tích rạn san hô đã mất từ 1950 đến nay"
 *
 * Plus body text paragraph (SRS H-09)
 */
export function StatsSection() {
  const { ref, isInView } = useInView(0.15, '-50px');

  const stats = [
    {
      icon: 'water_drop',
      value: 1,
      prefix: '< ',
      suffix: '%',
      label: 'Tỉ lệ diện tích đáy biển mà san hô chiếm',
      badge: 'Sinh thái',
    },
    {
      icon: 'pets',
      value: 25,
      suffix: '%',
      label: 'Lượng sinh vật biển phụ thuộc vào rạn san hô',
      badge: 'Đa dạng sinh học',
    },
    {
      icon: 'warning',
      value: 50,
      suffix: '%',
      label: 'Diện tích rạn san hô đã mất từ 1950 đến nay',
      badge: 'Khẩn cấp',
    },
  ];

  return (
    <section
      id="stats-section"
      ref={ref}
      className="py-24 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto"
    >
      {/* Section Header (SRS H-05) */}
      <div className="text-center mb-12">
        <h2 className="font-heading-serif text-headline-md md:text-display-lg text-primary mb-6">
          San hô — Nền tảng sự sống của đại dương
        </h2>
        {/* Body text (SRS H-09) */}
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
          San hô không chỉ là những rạn đá ngầm đầy màu sắc. Chúng là nền tảng của hệ sinh thái
          biển — nơi cư trú, sinh sản và kiếm ăn của hàng triệu loài sinh vật. Tuy nhiên, biến đổi
          khí hậu, ô nhiễm và khai thác quá mức đang đe dọa sự tồn tại của chúng với tốc độ chưa
          từng có. Mỗi hành động nhỏ hôm nay sẽ quyết định tương lai của đại dương ngày mai.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-8 rounded-xl premium-shadow border border-surface-container"
          >
            <div className="flex justify-between items-start mb-6">
              <span
                className="material-symbols-outlined text-secondary text-4xl"
                aria-hidden="true"
              >
                {stat.icon}
              </span>
              <span className="bg-tertiary-container/10 text-tertiary px-3 py-1 rounded-full font-mono text-xs uppercase">
                {stat.badge}
              </span>
            </div>
            <div className="text-4xl font-bold text-primary mb-3">
              <AnimatedNumber
                target={stat.value}
                prefix={stat.prefix || ''}
                suffix={stat.suffix}
                isInView={isInView}
              />
            </div>
            <p className="font-body-md text-on-surface-variant">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
