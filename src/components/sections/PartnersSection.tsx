'use client';

import { useInView } from '@/hooks/useInView';

const partners = [
  {
    icon: 'water_drop',
    name: 'Viện Hải dương học Nha Trang',
    desc: 'Đối tác khoa học chính, cung cấp chuyên môn về sinh thái rạn san hô và kỹ thuật nuôi trồng.',
  },
  {
    icon: 'groups',
    name: 'Cộng đồng Stewards Địa phương',
    desc: 'Mạng lưới tình nguyện viên và thợ lặn địa phương tham gia chăm sóc và giám sát san hô.',
  },
  {
    icon: 'analytics',
    name: 'Marine Data Alliance',
    desc: 'Đối tác công nghệ cung cấp nền tảng phân tích dữ liệu và AI cho giám sát tăng trưởng san hô.',
  },
];

/**
 * Partners Section — 3 cards on light background
 * Stitch ref: coralume_our_story lines 186-226
 */
export function PartnersSection() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section ref={ref} className="bg-surface-container-low py-24 md:py-32 relative overflow-hidden">
      <div className="px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-slow ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
          }`}
        >
          <h2 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">
            Đối tác Chiến lược
          </h2>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Cùng nhau kiến tạo tương lai cho đại dương
          </p>
        </div>

        {/* Partner cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.map((partner, i) => (
            <div
              key={partner.name}
              className={`bg-surface-container-lowest p-10 rounded-3xl shadow-sm border border-outline-variant text-center flex flex-col items-center transition-all duration-500 hover:-translate-y-2 hover:shadow-card-hover ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
              }`}
              style={{ transitionDelay: isInView ? `${i * 100}ms` : '0ms' }}
            >
              <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-4xl" aria-hidden="true">
                  {partner.icon}
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-4">
                {partner.name}
              </h3>
              <p className="text-on-surface-variant mb-6">{partner.desc}</p>
              <span className="text-secondary font-bold text-sm">
                Tìm hiểu thêm →
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Atmospheric gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-primary-fixed-dim/20 to-transparent opacity-20 pointer-events-none" />
    </section>
  );
}
