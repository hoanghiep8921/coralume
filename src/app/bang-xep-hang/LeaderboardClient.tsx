'use client';

import { useState, useEffect, useRef } from 'react';

// ============================================================
// TYPES
// ============================================================

interface LeaderEntry {
  rank: number;
  id: string;
  fullName: string;
  avatarUrl: string | null;
  isPublic: boolean;
  role: string;
  _count: { adoptions: number };
}

interface MyRankingEntry extends LeaderEntry {
  nextRankGap: number | null;
}

interface LeaderboardData {
  rankings: LeaderEntry[];
  myRanking: MyRankingEntry | null;
  type: string;
}

// ============================================================
// CONSTANTS — Design Spec compliant
// ============================================================

const TOP3_ROW_STYLES: Record<number, string> = {
  1: 'bg-amber-50 border-amber-300 shadow-sm',
  2: 'bg-slate-50 border-slate-300 shadow-sm',
  3: 'bg-orange-50 border-orange-300 shadow-sm',
};

const TOP3_BADGE_STYLES: Record<number, string> = {
  1: 'bg-amber-400 text-amber-900 border-amber-500',
  2: 'bg-slate-300 text-slate-800 border-slate-400',
  3: 'bg-orange-400 text-orange-900 border-orange-500',
};

// Medal icons — Material Symbols (not emoji)
const TOP3_ICONS: Record<number, string> = {
  1: 'trophy',
  2: 'social_leaderboard',
  3: 'social_leaderboard',
};

// ============================================================
// COUNT-UP ANIMATION
// ============================================================

function CountUp({
  value,
  duration = 800,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }

    const startTime = performance.now();
    const animate = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return <span className={className}>{display}</span>;
}

// ============================================================
// HELPERS
// ============================================================

function getDisplayName(user: LeaderEntry, isMyRank?: boolean): string {
  if (isMyRank) return user.fullName || 'Bạn';
  if (!user.isPublic) return 'Người ẩn danh';
  return user.fullName || 'Người ẩn danh';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-primary text-on-primary',
    'bg-secondary text-on-secondary',
    'bg-tertiary-container text-on-tertiary-container',
    'bg-secondary-container text-on-secondary-container',
    'bg-primary-container text-on-primary-container',
    'bg-on-tertiary-container text-tertiary',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// ----------------------------------------------------------
// Avatar component
// ----------------------------------------------------------

function UserAvatar({
  avatarUrl,
  name,
  size = 'md',
}: {
  avatarUrl: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
  };

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center flex-shrink-0 font-bold ${getAvatarColor(name)}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

// ============================================================
// PROPS
// ============================================================

interface Props {
  monthlyData: LeaderboardData | null;
  allTimeData: LeaderboardData | null;
}

// ============================================================
// COMPONENT
// ============================================================

export function LeaderboardClient({ monthlyData, allTimeData }: Props) {
  const [tab, setTab] = useState<'monthly' | 'allTime'>('allTime');

  const data = tab === 'monthly' ? monthlyData : allTimeData;

  if (!data) {
    return (
      <div className="text-center py-16">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-surface-container rounded-xl"
            />
          ))}
        </div>
        <p className="text-on-surface-variant mt-4">
          Đang tải bảng xếp hạng...
        </p>
      </div>
    );
  }

  const { rankings, myRanking } = data;
  const tabLabel =
    tab === 'monthly' ? 'Top 10 tháng này' : 'Top 20 tất cả thời gian';

  return (
    <div>
      {/* ============================================================ */}
      {/* TABS                                                          */}
      {/* ============================================================ */}
      <div className="flex gap-2 mb-8 justify-center">
        <button
          onClick={() => setTab('monthly')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-fast ${
            tab === 'monthly'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant'
          }`}
        >
          Tháng này
        </button>
        <button
          onClick={() => setTab('allTime')}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-fast ${
            tab === 'allTime'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant'
          }`}
        >
          Tất cả thời gian
        </button>
      </div>

      {/* ============================================================ */}
      {/* MY RANKING — personalized banner                             */}
      {/* ============================================================ */}
      {myRanking && (
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-container/10 via-secondary/5 to-primary-container/10 border-2 border-secondary/20 rounded-xl p-5 md:p-6 mb-10">
          {/* Decorative top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-secondary-container to-secondary" />

          <h2 className="font-headline-md text-headline-md text-primary mb-4">
            Thứ hạng của bạn
          </h2>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {/* Rank badge */}
              <div className="w-14 h-14 rounded-full bg-secondary/10 border-2 border-secondary/30 flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-xl font-bold text-secondary">
                  #<CountUp value={myRanking.rank} duration={600} />
                </span>
              </div>

              {/* Avatar */}
              <UserAvatar
                avatarUrl={myRanking.avatarUrl}
                name={myRanking.fullName || 'Bạn'}
                size="lg"
              />

              {/* Name + Role */}
              <div className="min-w-0">
                <span className="font-headline-md text-primary block truncate">
                  {getDisplayName(myRanking, true)}
                </span>
                <span className="text-sm text-on-surface-variant">
                  {myRanking.role === 'ambassador' ? (
                    <>
                      <span
                        className="material-symbols-outlined text-sm align-middle mr-1"
                        aria-hidden="true"
                      >
                        stars
                      </span>
                      Đại sứ Coralume
                    </>
                  ) : (
                    'Người nhận nuôi'
                  )}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 justify-end">
                <span className="font-mono text-2xl text-primary font-bold">
                  <CountUp value={myRanking._count.adoptions} duration={1000} />
                </span>
                <span
                  className="material-symbols-outlined text-xl text-secondary"
                  aria-hidden="true"
                >
                  ecology
                </span>
              </div>
              <span className="block text-xs text-on-surface-variant">
                san hô đã nuôi
              </span>
            </div>
          </div>

          {/* Next rank gap */}
          {myRanking.nextRankGap !== null && myRanking.rank > 1 && (
            <div className="mt-4 pt-4 border-t border-outline-variant/50">
              <p className="text-sm text-on-surface-variant">
                {myRanking.nextRankGap <= 0 ? (
                  <>
                    Bạn đã vượt qua người xếp trên! Bảng xếp hạng đang cập
                    nhật...
                  </>
                ) : (
                  <>
                    Cần thêm{' '}
                    <strong className="text-secondary">
                      {myRanking.nextRankGap} san hô
                    </strong>{' '}
                    nữa để lên hạng{' '}
                    <strong className="text-primary">
                      #{myRanking.rank - 1}
                    </strong>
                  </>
                )}
              </p>
              {/* Progress bar */}
              {myRanking.nextRankGap > 0 &&
                (() => {
                  const current = myRanking._count.adoptions;
                  const target = current + myRanking.nextRankGap;
                  const pct = Math.round((current / target) * 100);
                  return (
                    <div className="mt-2 w-full h-2 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-secondary to-secondary-container rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  );
                })()}
            </div>
          )}

          {myRanking.rank === 1 && (
            <div className="mt-4 pt-4 border-t border-outline-variant/50">
              <p className="text-sm text-secondary font-medium">
                <span
                  className="material-symbols-outlined text-base align-middle mr-1"
                  aria-hidden="true"
                >
                  trophy
                </span>
                Bạn đang dẫn đầu bảng xếp hạng! Cảm ơn bạn đã góp phần bảo vệ
                đại dương.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* RANKINGS TABLE                                                */}
      {/* ============================================================ */}
      <h2 className="font-headline-md text-headline-md text-primary mb-4">
        {tabLabel}
      </h2>

      {rankings.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-xl border border-outline-variant">
          <span
            className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3 block"
            aria-hidden="true"
          >
            social_leaderboard
          </span>
          <p className="text-on-surface-variant font-body-md">
            Chưa có dữ liệu cho{' '}
            {tab === 'monthly' ? 'tháng này' : 'bảng xếp hạng'}
          </p>
          <p className="text-on-surface-variant/70 text-sm mt-1">
            Hãy là người đầu tiên nhận nuôi san hô!
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
          {rankings.map((user) => {
            const isTop3 = user.rank <= 3;
            return (
              <div
                key={user.id}
                className={`flex items-center gap-3 md:gap-4 px-4 md:px-6 py-3.5 md:py-4 border-b border-outline-variant/50 last:border-b-0 transition-colors ${
                  isTop3
                    ? TOP3_ROW_STYLES[user.rank] + ' border-l-4'
                    : 'hover:bg-surface-container-low'
                }`}
              >
                {/* Rank badge */}
                <div
                  className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 ${
                    isTop3
                      ? TOP3_BADGE_STYLES[user.rank]
                      : 'bg-surface-container text-on-surface-variant border-outline-variant'
                  }`}
                >
                  {isTop3 ? (
                    <span
                      className="material-symbols-outlined text-base"
                      aria-hidden="true"
                    >
                      {TOP3_ICONS[user.rank]}
                    </span>
                  ) : (
                    <span className="font-mono text-sm font-bold">
                      <CountUp value={user.rank} duration={500} />
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <UserAvatar
                  avatarUrl={user.isPublic ? user.avatarUrl : null}
                  name={getDisplayName(user)}
                  size="md"
                />

                {/* Name + Badge */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium truncate ${
                        !user.isPublic
                          ? 'text-on-surface-variant italic'
                          : isTop3 && user.rank === 1
                            ? 'text-primary font-semibold'
                            : 'text-on-surface'
                      }`}
                    >
                      {getDisplayName(user)}
                    </span>
                    {user.role === 'ambassador' && (
                      <span
                        className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-label-sm flex-shrink-0 inline-flex items-center gap-0.5"
                        title="Đại sứ Coralume"
                      >
                        <span
                          className="material-symbols-outlined text-xs"
                          aria-hidden="true"
                        >
                          stars
                        </span>
                        Đại sứ
                      </span>
                    )}
                    {!user.isPublic && (
                      <span className="text-xs text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded-full font-label-sm flex-shrink-0">
                        ẩn danh
                      </span>
                    )}
                  </div>
                </div>

                {/* Adoption count */}
                <div className="text-right flex-shrink-0 flex items-center gap-1">
                  <span className="font-mono text-lg text-primary font-bold">
                    <CountUp
                      value={user._count.adoptions}
                      duration={800 + user.rank * 50}
                    />
                  </span>
                  <span
                    className="material-symbols-outlined text-sm text-on-surface-variant/60"
                    aria-hidden="true"
                  >
                    ecology
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer note */}
      <p className="text-xs text-on-surface-variant text-center mt-6">
        Bảng xếp hạng được cập nhật theo thời gian thực. Người dùng có thể
        chọn ẩn danh trong phần Cài đặt tài khoản.
      </p>
    </div>
  );
}
