'use client';

import { useInView } from '@/hooks/useInView';

const members = [
  {
    name: 'Dr. Linh Nguyễn',
    role: 'Giám đốc Khoa học',
    bio: 'Tiến sĩ Sinh học Biển với 15 năm nghiên cứu rạn san hô tại Việt Nam và Úc.',
  },
  {
    name: 'Anh Minh Trần',
    role: 'Trưởng nhóm Steward',
    bio: 'Thợ lặn chuyên nghiệp, người đã dành 10 năm chăm sóc các rạn san hô tại Nha Trang.',
  },
  {
    name: 'Mai Phạm',
    role: 'Kỹ sư Dữ liệu',
    bio: 'Chuyên gia AI & Machine Learning, xây dựng hệ thống giám sát tăng trưởng san hô.',
  },
  {
    name: 'Sơn Vũ',
    role: 'Điều phối Cộng đồng',
    bio: 'Kết nối adopter với san hô, tổ chức sự kiện và chương trình tham quan.',
  },
];

/**
 * Team Section — 4-column grid with hover zoom
 * Stitch ref: coralume_our_story lines 228-274
 */
export function TeamSection() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section className="py-24 md:py-32 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto">
      <div
        ref={ref}
        className={`flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-12 transition-all duration-slow ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
        }`}
      >
        <div>
          <h2 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-2">
            Đội ngũ của chúng tôi
          </h2>
          <p className="font-body-lg text-on-surface-variant">
            Những con người đứng sau mỗi rạn san hô
          </p>
        </div>
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((member, i) => (
          <div
            key={member.name}
            className={`group transition-all duration-slow ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
            }`}
            style={{ transitionDelay: isInView ? `${i * 100}ms` : '0ms' }}
          >
            {/* Image placeholder */}
            <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-primary-fixed-dim/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant/30" aria-hidden="true">
                person
              </span>
            </div>

            <h3 className="font-headline-md text-headline-md text-primary">{member.name}</h3>
            <p className="text-secondary font-label-sm uppercase tracking-wider mb-2">
              {member.role}
            </p>
            <p className="text-on-surface-variant font-body-md">{member.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
