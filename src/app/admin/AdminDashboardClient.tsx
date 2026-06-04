'use client';

import { AdminStatsCards } from '@/components/admin/AdminStatsCards';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function AdminDashboardClient({ stats }: { stats: any }) {
  if (!stats) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-8 text-center">
        <p className="text-on-surface-variant">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <>
      <AdminStatsCards
        userCount={stats.userCount}
        coralCount={stats.coralCount}
        adoptionCount={stats.adoptionCount}
        revenue={stats.revenue}
      />

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
          </div>
        </div>
      </div>
    </>
  );
}
