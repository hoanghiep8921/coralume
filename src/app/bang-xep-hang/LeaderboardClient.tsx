'use client';

interface LeaderData {
  id: string;
  rank: number;
  fullName: string;
  isPublic: boolean;
  role: string;
  _count: { adoptions: number };
}

const rankColors: Record<number, string> = {
  1: 'bg-amber-100 text-amber-800 border-amber-300',
  2: 'bg-gray-100 text-gray-700 border-gray-300',
  3: 'bg-orange-100 text-orange-700 border-orange-300',
};

function getDisplayName(user: LeaderData, isMyRank?: boolean): string {
  if (isMyRank) return user.fullName || 'Bạn';
  if (!user.isPublic) return 'Người ẩn danh';
  return user.fullName || 'Người ẩn danh';
}

export function LeaderboardClient({ data }: { data: { allTime: LeaderData[]; myRanking: (LeaderData & { rank: number }) | null } | null }) {
  if (!data) {
    return <p className="text-center text-on-surface-variant py-8">Đang tải...</p>;
  }

  const { allTime, myRanking } = data;

  return (
    <div>
      {/* My Ranking */}
      {myRanking && (
        <div className="bg-secondary/5 border-2 border-secondary/20 rounded-xl p-6 mb-10">
          <h2 className="font-headline-md text-headline-md text-primary mb-1">Thứ hạng của bạn</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="font-mono text-xl font-bold text-secondary">#{myRanking.rank}</span>
              </div>
              <div>
                <span className="font-headline-md text-primary">{getDisplayName(myRanking, true)}</span>
                <span className="text-sm text-on-surface-variant ml-2">
                  {myRanking.role === 'ambassador' ? '🌟 Đại sứ' : 'Người nhận nuôi'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-2xl text-primary font-bold">{myRanking._count.adoptions}</span>
              <span className="block text-xs text-on-surface-variant">san hô</span>
            </div>
          </div>
        </div>
      )}

      {/* Top 20 All-Time */}
      <h2 className="font-headline-md text-headline-md text-primary mb-4">Top 20 tất cả thời gian</h2>
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        {allTime.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-4 px-6 py-4 border-b border-outline-variant/50 last:border-b-0 hover:bg-surface-container-low transition-colors"
          >
            {/* Rank */}
            <div
              className={`w-9 h-9 rounded-full border flex items-center justify-center flex-shrink-0 ${
                rankColors[user.rank] || 'bg-surface-container text-on-surface-variant border-outline-variant'
              }`}
            >
              <span className="font-mono text-sm font-bold">{user.rank}</span>
            </div>

            {/* Name + Badge */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-medium truncate ${!user.isPublic ? 'text-on-surface-variant italic' : 'text-on-surface'}`}>
                  {getDisplayName(user)}
                </span>
                {user.role === 'ambassador' && <span className="text-xs">🌟</span>}
                {!user.isPublic && <span className="text-xs text-on-surface-variant">(ẩn danh)</span>}
              </div>
            </div>

            {/* Adoptions count */}
            <div className="text-right flex-shrink-0">
              <span className="font-mono text-lg text-primary font-bold">{user._count.adoptions}</span>
              <span className="text-xs text-on-surface-variant ml-1">san hô</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-on-surface-variant text-center mt-6">
        Bảng xếp hạng cập nhật theo thời gian thực. Người dùng có thể chọn ẩn danh trong cài đặt.
      </p>
    </div>
  );
}
