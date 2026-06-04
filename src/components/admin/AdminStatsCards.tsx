interface AdminStatsCardsProps {
  userCount: number;
  coralCount: number;
  adoptionCount: number;
  revenue: number;
}

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

export function AdminStatsCards({ userCount, coralCount, adoptionCount, revenue }: AdminStatsCardsProps) {
  const stats = [
    { label: 'Người dùng', value: userCount.toLocaleString(), icon: 'group', color: 'text-primary' },
    { label: 'San hô', value: coralCount.toLocaleString(), icon: 'water_drop', color: 'text-secondary' },
    { label: 'Nhận nuôi', value: adoptionCount.toLocaleString(), icon: 'eco', color: 'text-on-tertiary-container' },
    { label: 'Doanh thu', value: formatVND(revenue), icon: 'payments', color: 'text-green-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-label-sm text-on-surface-variant uppercase tracking-wider">{stat.label}</span>
            <span className={`material-symbols-outlined text-2xl ${stat.color}`} aria-hidden="true">{stat.icon}</span>
          </div>
          <div className="font-mono text-2xl text-primary font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
