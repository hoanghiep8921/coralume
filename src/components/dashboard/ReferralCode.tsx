'use client';

import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';

interface ReferralCodeProps {
  code: string;
  count: number;
  threshold: number;
}

/** FR-046: Referral Code (AFF) */
export function ReferralCode({ code, count, threshold }: ReferralCodeProps) {
  const { ref, isInView } = useInView(0.1);
  const [copied, setCopied] = useState(false);
  const current = useCountUp(count, 1500, isInView);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section
      ref={ref}
      className={`mb-12 bg-white rounded-2xl p-8 premium-shadow transition-all duration-slow ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-secondary text-3xl" aria-hidden="true">
          group
        </span>
        <div>
          <h2 className="font-headline-md text-headline-md text-primary">
            Mạng lưới giới thiệu
          </h2>
          <p className="text-on-surface-variant font-body-md">
            Mời bạn bè — Trở thành Ambassador
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <span className="font-mono text-display-lg-mobile text-primary font-bold block">
            {current}
          </span>
          <span className="text-sm text-on-surface-variant">Lượt giới thiệu</span>
        </div>
        <div>
          <span className="font-mono text-display-lg-mobile text-secondary font-bold block">
            {threshold - count}
          </span>
          <span className="text-sm text-on-surface-variant">
            Còn lại để đạt Ambassador
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: threshold }, (_, i) => (
          <div
            key={i}
            className={`h-2.5 flex-1 rounded-full transition-colors duration-normal ${
              i < count ? 'bg-secondary' : 'bg-outline-variant'
            }`}
          />
        ))}
      </div>

      {/* Referral link */}
      <div>
        <p className="text-sm text-on-surface font-medium mb-2">Mã giới thiệu của bạn:</p>
        <div className="flex items-center gap-2">
          <code className="flex-grow bg-surface-container rounded-lg px-4 py-3 font-mono text-primary border border-outline-variant text-sm">
            {code}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="bg-primary hover:bg-primary-container text-on-primary font-semibold py-3 px-4 rounded-lg transition-all duration-fast flex items-center gap-2 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-xl" aria-hidden="true">
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Đã sao chép' : 'Sao chép'}
          </button>
        </div>
      </div>
    </section>
  );
}
