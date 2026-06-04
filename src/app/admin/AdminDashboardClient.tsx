'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';

interface MonthlyTrend {
  month: string;
  adoptions: number;
  revenue: number;
}

interface DashboardStats {
  userCount: number;
  coralCount: number;
  adoptionCount: number;
  activeAdoptions: number;
  revenue: number;
  pendingPayments: number;
  monthlyTrend: MonthlyTrend[];
}

const monthLabels: Record<string, string> = {
  '01': 'T1', '02': 'T2', '03': 'T3', '04': 'T4',
  '05': 'T5', '06': 'T6', '07': 'T7', '08': 'T8',
  '09': 'T9', '10': 'T10', '11': 'T11', '12': 'T12',
};

function formatMonth(month: string): string {
  const parts = month.split('-');
  const m = parts[1] || '';
  return monthLabels[m] || month;
}

function formatRevenue(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return `${amount}`;
}

export function AdminDashboardClient({ stats }: { stats: DashboardStats | null }) {
  if (!stats) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-8 text-center">
        <p className="text-on-surface-variant">Đang tải dữ liệu...</p>
      </div>
    );
  }

  const chartData = stats.monthlyTrend.map((item) => ({
    ...item,
    monthLabel: formatMonth(item.month),
  }));

  return (
    <>
      <AdminStatsCards
        userCount={stats.userCount}
        coralCount={stats.coralCount}
        adoptionCount={stats.adoptionCount}
        revenue={stats.revenue}
      />

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Adoptions Trend */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Nhận nuôi theo tháng</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-surface-container-lowest)',
                    border: '1px solid var(--color-outline-variant)',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="adoptions"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-primary)', r: 4 }}
                  activeDot={{ r: 6, fill: 'var(--color-secondary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Doanh thu theo tháng</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
                <XAxis dataKey="monthLabel" tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--color-on-surface-variant)' }} tickFormatter={formatRevenue} />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString('vi-VN')}đ`, 'Doanh thu']}
                  contentStyle={{
                    background: 'var(--color-surface-container-lowest)',
                    border: '1px solid var(--color-outline-variant)',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Bar dataKey="revenue" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Overview + Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Tổng quan nhanh</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-outline-variant/50">
              <span className="text-on-surface-variant">Nhận nuôi đang hoạt động</span>
              <span className="font-mono font-bold text-primary">{stats.activeAdoptions}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-outline-variant/50">
              <span className="text-on-surface-variant">Thanh toán chờ xử lý</span>
              <span className="font-mono font-bold text-amber-600">{stats.pendingPayments}</span>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Điều hướng nhanh</h2>
          <div className="flex flex-wrap gap-3">
            <a href="/admin/users" className="bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-lg text-sm text-on-surface transition-colors">Quản lý người dùng →</a>
            <a href="/admin/corals" className="bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-lg text-sm text-on-surface transition-colors">Quản lý san hô →</a>
            <a href="/admin/products" className="bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-lg text-sm text-on-surface transition-colors">Quản lý sản phẩm →</a>
            <a href="/admin/blog" className="bg-surface-container hover:bg-surface-container-high px-4 py-2 rounded-lg text-sm text-on-surface transition-colors">Quản lý bài viết →</a>
          </div>
        </div>
      </div>
    </>
  );
}
