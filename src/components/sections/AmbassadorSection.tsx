'use client';

import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';
import { AMBASSADOR_THRESHOLD } from '@/config/site';

const rewards = [
  {
    icon: 'military_tech',
    title: 'Huy hiệu Đại sứ',
    desc: 'Badge đặc biệt hiển thị trên profile của bạn',
  },
  {
    icon: 'checkroom',
    title: 'Quà tặng Coralume',
    desc: 'Áo thun + túi tote Coralume phiên bản giới hạn',
  },
  {
    icon: 'scuba_diving',
    title: 'Voucher lặn miễn phí',
    desc: '01 chuyến lặn tham quan san hô tại Nha Trang',
  },
  {
    icon: 'event',
    title: 'Tham dự sự kiện',
    desc: 'Lời mời độc quyền đến các sự kiện offline của Coralume',
  },
];

/**
 * FR-023: Ambassador / Referral Program Section
 *
 * Dark container with:
 * - Badge + headline + description
 * - 4 reward cards
 * - Progress bar (5 referrals = Ambassador)
 */
export function AmbassadorSection() {
  const { ref, isInView } = useInView(0.1, '-50px');

  // Placeholder: 0 referrals (no auth state in static page)
  const currentReferrals = 0;
  const count = useCountUp(currentReferrals, 1500, isInView);

  return (
    <section
      ref={ref}
      className="py-[var(--spacing-stack-lg)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto"
    >
      <div
        className={`bg-primary rounded-xl overflow-hidden transition-all duration-slow ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
        }`}
      >
        <div className="p-8 md:p-12 lg:p-16">
          {/* Badge */}
          <span className="inline-block bg-secondary text-on-secondary font-label-sm text-label-sm px-4 py-1 rounded-full mb-6">
            Chương trình Đại sứ
          </span>

          {/* Headline */}
          <h2 className="font-display text-display-lg-mobile md:text-display-lg text-on-primary mb-4 max-w-2xl">
            Mời bạn bè — Trở thành Ambassador
          </h2>

          {/* Description */}
          <p className="font-body-lg text-on-primary/80 max-w-2xl mb-10">
            Mỗi adopter có một mã giới thiệu riêng. Khi 5 người bạn sử dụng mã
            của bạn, bạn sẽ được nâng cấp lên Ambassador với các đặc quyền sau:
          </p>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {rewards.map((reward) => (
              <div
                key={reward.title}
                className="bg-on-primary/10 rounded-xl p-6 border border-on-primary/10 hover:bg-on-primary/15 transition-colors duration-fast"
              >
                <span
                  className="material-symbols-outlined text-3xl text-secondary-fixed mb-3 block"
                  aria-hidden="true"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  {reward.icon}
                </span>
                <h3 className="font-headline-md text-headline-md text-on-primary mb-1">
                  {reward.title}
                </h3>
                <p className="font-body-md text-on-primary/70">{reward.desc}</p>
              </div>
            ))}
          </div>

          {/* Progress Section */}
          <div className="bg-on-primary/10 rounded-xl p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-primary mb-1">
                  Tiến độ giới thiệu
                </h3>
                <p className="font-body-md text-on-primary/70">
                  Mời {AMBASSADOR_THRESHOLD} người bạn để trở thành Ambassador
                </p>
              </div>
              <div className="font-mono text-3xl text-secondary-fixed font-bold">
                <span>{count}</span>
                <span className="text-on-primary/50 text-xl">
                  /{AMBASSADOR_THRESHOLD}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-2">
              {Array.from({ length: AMBASSADOR_THRESHOLD }, (_, i) => (
                <div
                  key={i}
                  className={`h-3 flex-1 rounded-full transition-colors duration-normal ${
                    i < currentReferrals
                      ? 'bg-secondary-fixed'
                      : 'bg-on-primary/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary-container text-on-secondary font-semibold py-3 px-8 rounded-lg transition-all duration-normal hover:-translate-y-0.5 shadow-button"
            >
              <span className="material-symbols-outlined text-xl" aria-hidden="true">
                share
              </span>
              Chia sẻ link giới thiệu của bạn
            </button>
            <p className="text-on-primary/50 text-sm mt-3">
              Yêu cầu đăng nhập để nhận mã giới thiệu
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
