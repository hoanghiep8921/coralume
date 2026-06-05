'use client';

import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import Link from 'next/link';

/**
 * SRS FR-015 (A-10): Transparency Commitment
 *
 * "100% doanh thu sau chi phí vận hành được tái đầu tư vào
 *  hoạt động bảo tồn và phục hồi rạn san hô."
 */
export function TransparencyCommitmentSection() {
  const { ref, isInView } = useInView(0.15, '-50px');

  return (
    <section ref={ref} className="py-24 bg-primary">
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        <div
          className={`text-center max-w-3xl mx-auto transition-all duration-slow ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
          }`}
        >
          {/* Badge */}
          <span className="inline-block px-4 py-1 rounded-full bg-white/15 text-on-primary font-label-sm text-sm uppercase tracking-widest mb-6">
            Minh bạch tài chính
          </span>

          {/* SRS A-10 headline */}
          <h2 className="font-heading-serif text-display-lg-mobile md:text-display-lg text-on-primary mb-8 leading-tight">
            100% doanh thu sau chi phí vận hành
            <span className="block text-secondary-fixed italic mt-2">
              được tái đầu tư vào bảo tồn
            </span>
          </h2>

          {/* Explanation */}
          <p className="text-on-primary/80 font-body-lg text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Chúng tôi công khai báo cáo tài chính hàng quý. Mỗi đồng bạn đóng góp đều được
            đầu tư trực tiếp vào hoạt động phục hồi rạn san hô, nghiên cứu khoa học và
            giáo dục cộng đồng tại Nha Trang. Không chi phí marketing, không văn phòng sang trọng.
          </p>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-secondary-fixed mb-2">
                Hàng quý
              </div>
              <p className="text-on-primary/70 text-sm">
                Báo cáo tài chính minh bạch
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-secondary-fixed mb-2">
                Công khai
              </div>
              <p className="text-on-primary/70 text-sm">
                Danh sách san hô & tình trạng
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-3xl font-bold text-secondary-fixed mb-2">
                Đối tác
              </div>
              <p className="text-on-primary/70 text-sm">
                Trung tâm san hô Nha Trang
              </p>
            </div>
          </div>

          {/* CTA to view impact */}
          <div className="mt-12">
            <Link
              href="/san-pham"
              className="inline-block bg-secondary hover:bg-secondary-container text-on-secondary font-semibold px-10 py-4 rounded-lg transition-all duration-normal hover:-translate-y-0.5 shadow-button"
            >
              Tham gia ngay →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
