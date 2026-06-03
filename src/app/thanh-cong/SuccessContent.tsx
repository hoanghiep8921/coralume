'use client';

import { useInView } from '@/hooks/useInView';
import Link from 'next/link';

interface PaymentData {
  id: string;
  adoptionId: string;
  amount: number;
  method: string;
  status: string;
  paidAt?: string | null;
  adoption?: {
    customName?: string | null;
    product?: { name: string; tier: string } | null;
  };
}

interface SuccessContentProps {
  payment: PaymentData | null;
}

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

const methodLabels: Record<string, string> = {
  payos: 'PayOS',
};

export function SuccessContent({ payment }: SuccessContentProps) {
  const { ref, isInView } = useInView(0.1, '-50px');

  // Success state
  return (
    <div
      ref={ref}
      className={`w-full max-w-2xl mx-auto transition-all duration-slow ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
      }`}
    >
      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">
          Cảm ơn bạn đã nhận nuôi!
        </h1>
        <p className="font-body-lg text-on-surface-variant max-w-lg mx-auto">
          San hô của bạn đang chờ được gán từ trung tâm Nha Trang.
          Bạn sẽ nhận được email xác nhận trong thời gian sớm nhất.
        </p>
      </div>

      {/* Certificate Preview */}
      <div className="bg-surface-container-lowest rounded-xl border-2 border-primary/20 p-8 md:p-12 mb-8">
        {/* Certificate decorative border */}
        <div className="border-2 border-double border-primary/20 rounded-lg p-6 md:p-10 text-center">
          <h2 className="font-heading-serif text-xl text-primary/60 uppercase tracking-widest mb-2">
            Chứng Nhận Nhận Nuôi San Hô
          </h2>
          <p className="font-heading-serif text-3xl md:text-4xl text-primary mb-6">
            Coralume
          </p>

          <div className="space-y-4 mb-8">
            <div>
              <span className="text-sm text-on-surface-variant uppercase tracking-wider">Người nhận nuôi</span>
              <p className="font-display text-xl text-primary">—</p>
            </div>
            <div>
              <span className="text-sm text-on-surface-variant uppercase tracking-wider">Tên san hô</span>
              <p className="font-heading-serif text-2xl text-secondary italic">
                {payment?.adoption?.customName || 'Đang chờ đặt tên'}
              </p>
            </div>
            <div>
              <span className="text-sm text-on-surface-variant uppercase tracking-wider">Gói nhận nuôi</span>
              <p className="font-headline-md text-primary">
                {payment?.adoption?.product?.name || '—'}
              </p>
            </div>
            <div>
              <span className="text-sm text-on-surface-variant uppercase tracking-wider">Ngày nhận nuôi</span>
              <p className="font-body-lg text-on-surface">
                {new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="border-t border-primary/20 pt-4">
            <p className="text-xs text-on-surface-variant">
              Mã chứng nhận: {payment?.adoptionId?.replace(/-/g, '').substring(0, 12).toUpperCase() || '—'}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              San hô thật đang chờ được gán · Trung tâm Nha Trang
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant text-on-surface-variant font-semibold py-3 px-6 rounded-lg cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-xl" aria-hidden="true">download</span>
          Chứng nhận đang được tạo...
        </button>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-container text-on-secondary font-semibold py-3 px-8 rounded-lg transition-all duration-normal hover:-translate-y-0.5 shadow-button"
        >
          Vào Dashboard của bạn →
        </Link>
      </div>

      <div className="text-center mt-6">
        <Link
          href="/san-pham"
          className="text-sm text-on-tertiary-container hover:text-primary transition-colors duration-fast"
        >
          Nhận nuôi thêm san hô khác →
        </Link>
      </div>
    </div>
  );
}
