'use client';

import { useEffect, useCallback } from 'react';

interface CoralData {
  id: string;
  customName?: string | null;
  status: string;
  adoptedAt?: string | null;
  product?: { name: string; tier: string } | null;
  coral?: {
    id: string;
    code: string;
    species?: string | null;
    status: string;
    locationZone?: string | null;
    updates?: Array<{
      id: string;
      sizeCm?: number | null;
      health: string;
      notes?: string | null;
      images: string[];
      createdAt: string;
    }>;
  } | null;
  certificate?: { id: string; pdfUrl?: string | null } | null;
}

interface CoralDetailModalProps {
  coral: CoralData;
  onClose: () => void;
}

const healthLabels: Record<string, string> = {
  good: 'Tốt',
  average: 'Trung bình',
  needs_attention: 'Cần chú ý',
};

/** FR-044: Coral Detail Modal */
export function CoralDetailModal({ coral, onClose }: CoralDetailModalProps) {
  const coralData = coral.coral;

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-surface w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
          aria-label="Đóng"
        >
          <svg className="w-4 h-4 text-on-surface" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header image */}
        <div className="h-64 bg-primary-fixed-dim/20 flex items-center justify-center relative">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30" aria-hidden="true">
            image
          </span>
          {coralData?.code && (
            <span className="absolute bottom-4 left-4 bg-primary/80 text-on-primary font-mono text-sm px-3 py-1.5 rounded">
              {coralData.code}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Name + Status */}
          <div>
            <h2 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-2">
              {coral.customName || coralData?.code || 'San hô chưa đặt tên'}
            </h2>
            <div className="flex flex-wrap gap-3">
              {coralData?.species && (
                <span className="font-body-md text-on-surface-variant">{coralData.species}</span>
              )}
              {coral.product && (
                <span className="bg-secondary/10 text-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                  {coral.product.name}
                </span>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface-container-low rounded-xl p-4 text-center">
              <span className="font-mono text-2xl text-primary font-bold block">
                {coralData?.updates?.[0]?.sizeCm || '—'}
              </span>
              <span className="text-xs text-on-surface-variant">cm</span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 text-center">
              <span className="font-mono text-2xl text-primary font-bold block">
                {healthLabels[coralData?.updates?.[0]?.health || 'good']}
              </span>
              <span className="text-xs text-on-surface-variant">Sức khoẻ</span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 text-center">
              <span className="font-mono text-2xl text-primary font-bold block">
                {coral.adoptedAt
                  ? Math.floor(
                      (Date.now() - new Date(coral.adoptedAt).getTime()) / (1000 * 60 * 60 * 24)
                    )
                  : '—'}
              </span>
              <span className="text-xs text-on-surface-variant">Ngày</span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 text-center">
              <span className="font-mono text-2xl text-primary font-bold block">
                {coralData?.locationZone || '—'}
              </span>
              <span className="text-xs text-on-surface-variant">Khu vực</span>
            </div>
          </div>

          {/* Growth Timeline */}
          <div>
            <h3 className="font-headline-md text-headline-md text-primary mb-4">
              Lịch sử phát triển
            </h3>
            {coralData?.updates && coralData.updates.length > 0 ? (
              <div className="space-y-0">
                {coralData.updates.map((update, i) => (
                  <div key={update.id} className="relative pl-8 pb-6 last:pb-0">
                    {/* Timeline line */}
                    {i < coralData.updates!.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-outline-variant" />
                    )}
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-surface-container-lowest border-2 border-secondary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-secondary" />
                    </div>

                    <div className="bg-surface-container-low rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-body-md font-medium text-on-surface">
                          {update.notes || 'Cập nhật định kỳ'}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {new Date(update.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-on-surface-variant">
                        {update.sizeCm && <span>Kích thước: {update.sizeCm}cm</span>}
                        <span>Sức khoẻ: {healthLabels[update.health] || update.health}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface-container-low rounded-xl p-6 text-center">
                <p className="text-on-surface-variant">
                  Chưa có cập nhật nào. Dữ liệu sẽ xuất hiện sau khi san hô được gán.
                </p>
              </div>
            )}
          </div>

          {/* Certificate */}
          <div className="bg-secondary/5 rounded-xl p-6 border border-secondary/20">
            <h3 className="font-headline-md text-headline-md text-primary mb-3">
              Chứng nhận
            </h3>
            <p className="text-on-surface-variant mb-4">
              {coral.certificate?.pdfUrl
                ? 'Chứng nhận của bạn đã sẵn sàng để tải xuống.'
                : 'Chứng nhận đang được tạo. Bạn sẽ nhận được thông báo khi sẵn sàng.'}
            </p>
            <button
              type="button"
              disabled={!coral.certificate?.pdfUrl}
              className={`inline-flex items-center gap-2 font-semibold py-2 px-4 rounded-lg transition-all ${
                coral.certificate?.pdfUrl
                  ? 'bg-secondary text-on-secondary hover:bg-secondary-container'
                  : 'bg-outline-variant/30 text-on-surface-variant cursor-not-allowed'
              }`}
            >
              <span className="material-symbols-outlined text-xl" aria-hidden="true">download</span>
              {coral.certificate?.pdfUrl ? 'Tải chứng nhận PDF' : 'Đang chờ chứng nhận...'}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-up animation */}
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(60px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slideUp 0.35s var(--ease-out-expo);
        }
      `}</style>
    </div>
  );
}
