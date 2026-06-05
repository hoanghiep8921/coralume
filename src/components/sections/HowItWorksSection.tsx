'use client';

/**
 * SRS FR-003: How It Works — "Cách Coralume hoạt động" (SRS H-10)
 *
 * 3 steps (SRS H-11, H-12, H-13):
 * 1. Chọn san hô của bạn
 * 2. Đặt tên và nhận chứng nhận
 * 3. Theo dõi hành trình phát triển
 *
 * 2-column layout (desktop):
 * - Left: 3 steps with numbered circles
 * - Right: Image + testimonial card overlay
 *
 * Mobile: Single column stacked
 */
export function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Chọn san hô của bạn',
      description:
        'Duyệt qua các vườn ươm đang hoạt động của chúng tôi và chọn một mẫu san hô phù hợp. Mỗi san hô có một hồ sơ sinh học riêng biệt.',
    },
    {
      number: '02',
      title: 'Đặt tên và nhận chứng nhận',
      description:
        'Cá nhân hóa trải nghiệm. Đặt tên cho san hô của bạn và nhận chứng nhận kỹ thuật số. Một món quà ý nghĩa cho người thân yêu.',
    },
    {
      number: '03',
      title: 'Theo dõi hành trình phát triển',
      description:
        'Nhận báo cáo tăng trưởng và hình ảnh độ phân giải cao của san hô, trực tiếp từ đội ngũ thợ lặn của chúng tôi tại Nha Trang.',
    },
  ];

  return (
    <section className="bg-surface-container py-[var(--spacing-stack-lg)] md:py-32 px-[var(--spacing-margin-desktop)]">
      <div className="max-w-[var(--spacing-container-max)] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Left: Steps */}
        <div>
          <span className="text-secondary font-label-sm uppercase tracking-widest mb-2 block">
            Quy trình
          </span>
          {/* SRS H-10 */}
          <h2 className="font-heading-serif text-display-lg-mobile md:text-display-lg text-primary mb-8">
            Cách Coralume hoạt động
          </h2>
          <div className="space-y-12">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-6 group">
                {/* Number Circle */}
                <div className="w-12 h-12 rounded-full border border-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-fast">
                  <span className="font-mono text-primary group-hover:text-white">{step.number}</span>
                </div>
                {/* Content */}
                <div>
                  <h3 className="font-headline-md text-primary mb-2">{step.title}</h3>
                  <p className="text-on-surface-variant font-body-md">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Image + Testimonial */}
        <div className="relative">
          {/* Image Placeholder */}
          <div className="aspect-[4/5] rounded-3xl overflow-hidden premium-shadow bg-primary-fixed-dim/20 flex items-center justify-center">
            <div className="text-center p-8">
              <span className="material-symbols-outlined text-tertiary text-6xl mb-4" aria-hidden="true">
                image
              </span>
              <p className="text-on-surface-variant text-sm">
                Ảnh underwater — Đang chờ CLB cung cấp
              </p>
            </div>
          </div>

          {/* Testimonial Card Overlay */}
          <div className="absolute -bottom-4 md:-bottom-8 -left-0 md:-left-8 bg-surface-container-lowest p-6 rounded-2xl premium-shadow border border-surface-container max-w-xs">
            <p className="text-secondary font-label-sm uppercase mb-2">Cập nhật mới nhất</p>
            <p className="font-heading-serif italic text-primary">
              &ldquo;San hô &apos;Hải Đăng&apos; của tôi đã phát triển được 2.4cm chỉ trong ba tháng! Nhìn thấy dữ liệu thật tuyệt vời.&rdquo;
            </p>
            <p className="font-label-sm text-on-surface-variant mt-4">— Minh Anh, nhận nuôi từ 2024</p>
          </div>
        </div>
      </div>
    </section>
  );
}
