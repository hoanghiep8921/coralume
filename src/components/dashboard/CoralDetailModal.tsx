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
      videoUrl?: string | null;
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

const healthIcons: Record<string, string> = {
  good: '🟢',
  average: '🟡',
  needs_attention: '🔴',
};

function formatDateVi(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const day = days[date.getDay()];
  return `${day}, ${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
}

function getHealthTrend(current: string, previous?: string): 'up' | 'down' | 'stable' {
  if (!previous) return 'stable';
  const order = ['needs_attention', 'average', 'good'];
  const currIdx = order.indexOf(current);
  const prevIdx = order.indexOf(previous);
  if (currIdx > prevIdx) return 'up';
  if (currIdx < prevIdx) return 'down';
  return 'stable';
}

/** Calculate monthly growth rate (mm/month) from the last 2 updates */
function calcGrowthRate(
  updates: Array<{ sizeCm?: number | null; createdAt: string }>
): number | null {
  if (updates.length < 2) return null;
  const latest = updates[0].sizeCm;
  const previous = updates[1].sizeCm;
  if (!latest || !previous) return null;
  const daysDiff =
    (new Date(updates[0].createdAt).getTime() - new Date(updates[1].createdAt).getTime()) /
    (1000 * 60 * 60 * 24);
  if (daysDiff <= 0) return null;
  // Convert cm difference to mm, then to monthly rate
  return parseFloat((((latest - previous) * 10) / daysDiff * 30).toFixed(1));
}

/** FR-044: Coral Detail Modal — SRS 4.1-4.5 */
export function CoralDetailModal({ coral, onClose }: CoralDetailModalProps) {
  const coralData = coral.coral;
  const latestUpdateImage = coralData?.updates?.[0]?.images?.[0];
  const growthRate = calcGrowthRate(coralData?.updates || []);

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

  const handleDownloadCert = () => {
    if (coral.certificate?.pdfUrl) {
      window.open(coral.certificate.pdfUrl, '_blank');
    }
  };

  const handleShareCert = async () => {
    const shareText = `🌊 Tôi vừa nhận nuôi san hô "${coral.customName || coralData?.code}" tại Coralume! Nhận nuôi san hô — Gieo mầm cho đại dương. coralume.vn`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Chứng nhận san hô Coralume', text: shareText, url: window.location.origin });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareText);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
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

        {/* SRS 4.1: Header image — show latest update image */}
        <div className="h-64 bg-primary-fixed-dim/20 flex items-center justify-center relative overflow-hidden">
          {latestUpdateImage ? (
            <img
              src={latestUpdateImage}
              alt={coral.customName || coralData?.code || 'San hô'}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30" aria-hidden="true">
              image
            </span>
          )}
          {coralData?.code && (
            <span className="absolute bottom-4 left-4 bg-primary/80 text-on-primary font-mono text-sm px-3 py-1.5 rounded">
              {coralData.code}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8">
          {/* SRS 4.1: Header — coral name + ID + species + product */}
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

          {/* SRS 4.4: Stats Grid — kích thước, sức khoẻ, growth rate, species */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-surface-container-low rounded-xl p-4 text-center">
              <span className="font-mono text-2xl text-primary font-bold block">
                {coralData?.updates?.[0]?.sizeCm || '—'}
              </span>
              <span className="text-xs text-on-surface-variant">Kích thước (cm)</span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 text-center">
              <span className="font-mono text-2xl text-primary font-bold block">
                {healthLabels[coralData?.updates?.[0]?.health || 'good']}
              </span>
              <span className="text-xs text-on-surface-variant">Sức khoẻ</span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 text-center">
              <span className="font-mono text-2xl text-primary font-bold block">
                {growthRate !== null ? `${growthRate > 0 ? '+' : ''}${growthRate}` : '—'}
              </span>
              <span className="text-xs text-on-surface-variant">Tốc độ growth (mm/tháng)</span>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4 text-center">
              <span className="font-mono text-2xl text-primary font-bold block">
                {coral.adoptedAt
                  ? Math.floor(
                      (Date.now() - new Date(coral.adoptedAt).getTime()) / (1000 * 60 * 60 * 24)
                    )
                  : '—'}
              </span>
              <span className="text-xs text-on-surface-variant">Ngày đồng hành</span>
            </div>
          </div>

          {/* SRS 4.3: GPS Map — relative reef zone with pulse pin */}
          {coralData?.locationZone && (
            <div>
              <h3 className="font-headline-md text-headline-md text-primary mb-3">
                Vị trí rạn san hô
              </h3>
              <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant relative">
                {/* Stylized reef map — simplified representation */}
                <div className="h-48 bg-gradient-to-b from-teal-100 via-blue-200 to-navy-100 relative flex items-center justify-center">
                  {/* Ocean pattern */}
                  <div className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(15,76,92,0.05) 20px, rgba(15,76,92,0.05) 21px)`,
                    }}
                  />
                  {/* Reef zone indicator */}
                  <div className="relative">
                    <div className="w-48 h-32 border-2 border-secondary/40 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="text-xs text-primary font-medium text-center px-4">
                        Khu vực {coralData.locationZone}
                      </span>
                    </div>
                    {/* Pulse pin animation */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-secondary rounded-full" />
                      <div className="absolute inset-0 w-4 h-4 bg-secondary rounded-full animate-ping opacity-75" />
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-surface-container-lowest border-t border-outline-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-lg" aria-hidden="true">location_on</span>
                  <span className="text-sm text-on-surface-variant">
                    Vùng rạn san hô tại Nha Trang — vị trí tương đối
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SRS 4.2: Growth Timeline */}
          <div>
            <h3 className="font-headline-md text-headline-md text-primary mb-4">
              Lịch sử phát triển
            </h3>
            {coralData?.updates && coralData.updates.length > 0 ? (
              <div className="space-y-0">
                {coralData.updates.map((update, i) => {
                  const prevUpdate = i < coralData.updates!.length - 1 ? coralData.updates![i + 1] : undefined;
                  const sizeDelta =
                    update.sizeCm && prevUpdate?.sizeCm
                      ? update.sizeCm - prevUpdate.sizeCm
                      : undefined;
                  const trend = getHealthTrend(update.health, prevUpdate?.health);
                  const thumbnail = update.images?.[0];
                  const hasVideo = !!update.videoUrl;

                  return (
                    <div key={update.id} className="relative pl-8 pb-6 last:pb-0">
                      {/* Timeline line */}
                      {i < coralData.updates!.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-outline-variant" />
                      )}
                      {/* Timeline dot */}
                      <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        i === 0 ? 'bg-secondary-container border-secondary' : 'bg-surface-container-lowest border-outline-variant'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-secondary' : 'bg-outline-variant'}`} />
                      </div>

                      <div className="bg-surface-container-low rounded-xl overflow-hidden">
                        {/* Thumbnail image */}
                        {thumbnail && (
                          <div className="h-40 bg-surface-container flex items-center justify-center overflow-hidden">
                            <img
                              src={thumbnail}
                              alt={`Ảnh cập nhật ${formatDateVi(update.createdAt)}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}

                        {/* Video player */}
                        {hasVideo && (
                          <div className="bg-surface-container">
                            <video
                              controls
                              preload="metadata"
                              className="w-full max-h-64"
                              poster={thumbnail}
                            >
                              <source src={update.videoUrl!} type="video/mp4" />
                              Trình duyệt không hỗ trợ video.
                            </video>
                          </div>
                        )}

                        <div className="p-4">
                          {/* Header with trend + date */}
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-body-md font-medium text-on-surface">
                                {update.notes || 'Cập nhật định kỳ'}
                              </span>
                              {i === 0 && (
                                <span className="bg-secondary/10 text-secondary text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                                  Mới nhất
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-on-surface-variant whitespace-nowrap ml-3">
                              {formatDateVi(update.createdAt)}
                            </span>
                          </div>

                          {/* Metrics */}
                          <div className="flex flex-wrap gap-3 text-sm text-on-surface-variant">
                            {update.sizeCm && (
                              <span className="inline-flex items-center gap-1">
                                📏 Kích thước: <span className="font-mono font-medium text-on-surface">{update.sizeCm}cm</span>
                                {sizeDelta !== undefined && sizeDelta !== 0 && (
                                  <span className={`text-xs font-medium ${sizeDelta > 0 ? 'text-green-600' : 'text-error'}`}>
                                    ({sizeDelta > 0 ? '+' : ''}{sizeDelta.toFixed(1)}cm)
                                  </span>
                                )}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              {healthIcons[update.health] || ''} Sức khoẻ:{' '}
                              <span className="font-medium text-on-surface">{healthLabels[update.health] || update.health}</span>
                              {trend === 'up' && <span className="text-green-600 text-xs">↑ Cải thiện</span>}
                              {trend === 'down' && <span className="text-error text-xs">↓ Giảm</span>}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-surface-container-low rounded-xl p-6 text-center">
                <p className="text-on-surface-variant">
                  Chưa có cập nhật nào. Dữ liệu sẽ xuất hiện sau khi san hô được gán.
                </p>
              </div>
            )}
          </div>

          {/* SRS 4.5: Certificate — Xem / Tải PDF / Chia sẻ */}
          <div className="bg-secondary/5 rounded-xl p-6 border border-secondary/20">
            <h3 className="font-headline-md text-headline-md text-primary mb-3">
              Chứng nhận
            </h3>
            <p className="text-on-surface-variant mb-4">
              {coral.certificate?.pdfUrl
                ? 'Chứng nhận của bạn đã sẵn sàng.'
                : 'Chứng nhận đang được tạo. Bạn sẽ nhận được thông báo khi sẵn sàng.'}
            </p>
            <div className="flex flex-wrap gap-3">
              {/* Xem Certificate */}
              {coral.certificate?.pdfUrl && (
                <button
                  type="button"
                  onClick={handleDownloadCert}
                  className="inline-flex items-center gap-2 font-semibold py-2 px-4 rounded-lg border-2 border-secondary text-secondary hover:bg-secondary hover:text-on-secondary transition-all"
                >
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">visibility</span>
                  Xem Certificate
                </button>
              )}
              {/* Tải PDF */}
              <button
                type="button"
                disabled={!coral.certificate?.pdfUrl}
                onClick={handleDownloadCert}
                className={`inline-flex items-center gap-2 font-semibold py-2 px-4 rounded-lg transition-all ${
                  coral.certificate?.pdfUrl
                    ? 'bg-secondary text-on-secondary hover:bg-secondary-container'
                    : 'bg-outline-variant/30 text-on-surface-variant cursor-not-allowed'
                }`}
              >
                <span className="material-symbols-outlined text-xl" aria-hidden="true">download</span>
                {coral.certificate?.pdfUrl ? 'Tải PDF' : 'Đang chờ...'}
              </button>
              {/* Chia sẻ */}
              <button
                type="button"
                onClick={handleShareCert}
                className="inline-flex items-center gap-2 font-semibold py-2 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface hover:bg-surface-container transition-all"
              >
                <span className="material-symbols-outlined text-xl" aria-hidden="true">share</span>
                Chia sẻ
              </button>
            </div>
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
