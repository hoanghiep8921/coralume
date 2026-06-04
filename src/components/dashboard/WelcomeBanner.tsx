'use client';

import { useInView } from '@/hooks/useInView';
import Link from 'next/link';

interface WelcomeBannerProps {
  fullName: string;
  coralCount: number;
  role: string;
}

/** Get initials from full name */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** FR-041: Welcome Banner */
export function WelcomeBanner({ fullName, coralCount, role }: WelcomeBannerProps) {
  const { ref, isInView } = useInView(0.2);

  return (
    <section
      ref={ref}
      className={`flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 transition-all duration-slow ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
      }`}
    >
      <div className="flex items-start gap-5">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center flex-shrink-0">
          <span className="text-on-primary-container font-display text-xl font-bold">
            {getInitials(fullName)}
          </span>
        </div>

        <div>
          <span className="text-secondary font-label-sm uppercase tracking-widest mb-1 block">
            {role === 'ambassador' ? 'Đại sứ' : 'Người giám hộ'}
          </span>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary">
            Chào mừng trở lại, {fullName}!
          </h1>
          <p className="font-body-lg text-on-surface-variant mt-2">
            Bạn đang chăm sóc{' '}
            <strong className="text-primary font-mono">{coralCount}</strong>{' '}
            san hô{coralCount !== 1 ? '' : ''} tại Nha Trang
          </p>
        </div>
      </div>

      <Link
        href="/san-pham"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-semibold py-3 px-6 rounded-xl transition-all duration-normal hover:-translate-y-0.5 shadow-button flex-shrink-0"
      >
        <span className="material-symbols-outlined text-xl" aria-hidden="true">add_circle</span>
        Nhận nuôi thêm
      </Link>
    </section>
  );
}
