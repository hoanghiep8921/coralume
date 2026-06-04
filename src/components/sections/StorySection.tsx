'use client';

import { useInView } from '@/hooks/useInView';

/**
 * Story Section — 2-column layout with stat card
 * Stitch ref: coralume_our_story lines 155-184
 */
export function StorySection() {
  const { ref, isInView } = useInView(0.1);

  return (
    <section
      ref={ref}
      className="py-[var(--spacing-stack-lg)] md:py-32 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div
          className={`transition-all duration-slow ${
            isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[30px]'
          }`}
        >
          <h2 className="font-headline-md text-headline-md text-primary mb-4">
            Câu chuyện khởi đầu
          </h2>
          <div className="h-1 w-20 bg-secondary rounded-full mb-6" />

          <div className="space-y-4 text-body-lg text-on-surface-variant leading-relaxed">
            <p>
              Coralume bắt đầu từ một câu hỏi đơn giản: Làm sao để mỗi người đều
              có thể góp phần bảo vệ rạn san hô — không chỉ bằng tiền, mà bằng
              sự kết nối thực sự?
            </p>
            <p>
              Chúng tôi xây dựng nền tảng kết nối người nhận nuôi với từng cá thể
              san hô tại Nha Trang. Mỗi san hô có một tên, một câu chuyện, và một
              hành trình phát triển được ghi lại bằng dữ liệu và hình ảnh.
            </p>
          </div>

          {/* Stat card */}
          <div className="mt-8 inline-flex items-center gap-4 bg-surface-container rounded-xl border border-outline-variant/30 px-6 py-4">
            <span className="material-symbols-outlined text-secondary text-3xl" aria-hidden="true">
              biotech
            </span>
            <div>
              <div className="font-mono text-xl text-primary font-bold">12,000+</div>
              <div className="font-label-sm text-on-surface-variant">San hô được cấy ghép</div>
            </div>
          </div>
        </div>

        {/* Right: Image placeholder + floating quote */}
        <div className="relative">
          <div
            className={`aspect-[4/5] rounded-[40px] shadow-xl overflow-hidden bg-primary-fixed-dim/20 flex items-center justify-center transition-all duration-slow ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[30px]'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30" aria-hidden="true">
              image
            </span>
          </div>

          {/* Floating quote card */}
          <div className="hidden md:block absolute -bottom-8 -left-8 bg-surface-container-lowest rounded-2xl shadow-xl p-6 max-w-[240px]">
            <p className="font-body-md italic text-on-surface-variant mb-2">
              &ldquo;Mỗi san hô được nhận nuôi là một bước tiến trong hành trình
              phục hồi đại dương.&rdquo;
            </p>
            <p className="font-body-md font-bold text-primary">— Đội ngũ sáng lập</p>
          </div>
        </div>
      </div>
    </section>
  );
}
