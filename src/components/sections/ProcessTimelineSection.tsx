'use client';

import { useInView } from '@/hooks/useInView';

/**
 * SRS FR-014 (A-06 → A-09): Process Timeline
 *
 * 4-step process with SVG connecting line animation:
 * 1. Chọn san hô & thanh toán
 * 2. Trung tâm san hô ghép mảnh
 * 3. Theo dõi tăng trưởng hàng tháng
 * 4. Nhận báo cáo & chứng nhận
 */
const STEPS = [
  {
    number: '1',
    title: 'Chọn san hô & thanh toán',
    description:
      'Duyệt qua các gói nhận nuôi, chọn san hô phù hợp và hoàn tất thanh toán an toàn qua PayOS. Bạn sẽ nhận được email xác nhận ngay lập tức.',
  },
  {
    number: '2',
    title: 'Trung tâm san hô ghép mảnh',
    description:
      'Đội ngũ sinh học biển của chúng tôi tại Nha Trang sẽ chọn và ghép mảnh san hô khỏe mạnh, gắn mã định danh và thả xuống vườn ươm.',
  },
  {
    number: '3',
    title: 'Theo dõi tăng trưởng hàng tháng',
    description:
      'Hàng tháng, thợ lặn của chúng tôi chụp ảnh và đo kích thước san hô của bạn. Dữ liệu được cập nhật lên dashboard cá nhân của bạn.',
  },
  {
    number: '4',
    title: 'Nhận báo cáo & chứng nhận',
    description:
      'Mỗi quý, bạn nhận được báo cáo tăng trưởng chi tiết. Sau 12 tháng, bạn nhận chứng nhận hoàn thành — minh chứng cho cam kết của bạn với đại dương.',
  },
];

export function ProcessTimelineSection() {
  const { ref, isInView } = useInView(0.15, '-50px');

  return (
    <section ref={ref} className="py-24 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <span className="text-secondary font-label-sm uppercase tracking-widest mb-2 block">
          Quy trình
        </span>
        <h2 className="font-heading-serif text-headline-md md:text-display-lg text-primary">
          Từ lúc nhận nuôi đến khi san hô trưởng thành
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative max-w-3xl mx-auto">
        {/* Connecting line */}
        <div
          className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-outline-variant md:left-1/2 md:-translate-x-px"
          style={{
            transformOrigin: 'top',
            transform: isInView ? 'scaleY(1)' : 'scaleY(0)',
            transition: 'transform 1s var(--ease-out-expo)',
          }}
        />

        <div className="space-y-12">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className={`relative flex gap-6 items-start md:items-center ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'}`}
              style={{ transitionDelay: isInView ? `${i * 200}ms` : '0ms', transition: 'all 0.6s var(--ease-out-expo)' }}
            >
              {/* Number Circle */}
              <div className="relative z-10 w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-lg shrink-0 md:mx-auto md:absolute md:left-1/2 md:-translate-x-1/2">
                {step.number}
              </div>

              {/* Content Card */}
              <div className={`flex-1 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant premium-shadow ${i % 2 === 0 ? 'md:mr-[60px]' : 'md:ml-[60px]'}`}>
                <h3 className="font-headline-md text-primary mb-2">{step.title}</h3>
                <p className="text-on-surface-variant font-body-md">{step.description}</p>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block md:w-[60px] shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
