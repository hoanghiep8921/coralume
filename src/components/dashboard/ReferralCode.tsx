'use client';

import { useState, useEffect } from 'react';
import { useInView } from '@/hooks/useInView';
import { useCountUp } from '@/hooks/useCountUp';

interface ReferralCodeProps {
  code: string;
  count: number;
  threshold: number;
}

/** SRS 6.1: Referral Code (AFF) — copy, share, progress bar, confetti when Ambassador */
export function ReferralCode({ code, count, threshold }: ReferralCodeProps) {
  const { ref, isInView } = useInView(0.1);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const current = useCountUp(count, 1500, isInView);
  const isAmbassador = count >= threshold;

  // Check if newly reached Ambassador → show confetti + popup
  useEffect(() => {
    if (isAmbassador && !showCongrats) {
      setShowConfetti(true);
      setShowCongrats(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [isAmbassador, showCongrats]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/dang-ky?ref=${encodeURIComponent(code)}`;
    const shareText = `🌊 Tham gia cùng tôi trong hành trình bảo tồn san hô tại Nha Trang! Dùng mã "${code}" để nhận nuôi san hô của bạn. ${shareUrl}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Nhận nuôi san hô cùng Coralume', text: shareText, url: shareUrl });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareText);
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
      {/* Confetti celebration on Ambassador */}
      {showConfetti && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-secondary animate-[confettiFall_4s_var(--ease-out-expo)_forwards]"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * -20}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#E87750', '#0F4C5C', '#5BA8B5', '#B5D8E8', '#F4A261'][i % 5],
              }}
            />
          ))}
          <style jsx>{`
            @keyframes confettiFall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      {/* Congratulatory popup */}
      {showCongrats && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl animate-[slideUp_0.5s_var(--ease-out-expo)]">
            <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🎉</span>
            </div>
            <h3 className="font-display text-2xl font-bold text-primary mb-2">
              Chúc mừng!
            </h3>
            <p className="text-on-surface-variant mb-2">
              Bạn đã trở thành <strong className="text-secondary">Ambassador</strong> của Coralume!
            </p>
            <p className="text-sm text-on-surface-variant mb-6">
              Cảm ơn bạn đã lan tỏa sứ mệnh bảo tồn san hô đến cộng đồng.
            </p>
            <button
              type="button"
              onClick={() => setShowCongrats(false)}
              className="bg-secondary hover:bg-secondary-container text-on-secondary font-semibold py-3 px-8 rounded-lg transition-all"
            >
              Tuyệt vời!
            </button>
          </div>
        </div>
      )}

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
            {isAmbassador ? '🎉' : Math.max(0, threshold - count)}
          </span>
          <span className="text-sm text-on-surface-variant">
            {isAmbassador ? 'Đã đạt Ambassador!' : 'Còn lại để đạt Ambassador'}
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

      {/* Referral code */}
      <div>
        <p className="text-sm text-on-surface font-medium mb-2">Mã giới thiệu của bạn:</p>
        <div className="flex items-center gap-2 flex-wrap">
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
          {/* SRS 6.1: Chia sẻ link */}
          <button
            type="button"
            onClick={handleShare}
            className="bg-surface-container-lowest border border-outline-variant hover:border-secondary text-on-surface font-semibold py-3 px-4 rounded-lg transition-all duration-fast flex items-center gap-2 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-xl" aria-hidden="true">share</span>
            Chia sẻ link
          </button>
        </div>
      </div>
    </section>
  );
}
