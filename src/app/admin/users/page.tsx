'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  _count: { adoptions: number; payments: number };
}

interface UserDetail {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  isPublic: boolean;
  emailNotify: boolean;
  createdAt: string;
  updatedAt: string;
  _count: { adoptions: number; payments: number };
  payments: {
    id: string;
    amount: number;
    method: string;
    status: string;
    gatewayTxnId: string | null;
    createdAt: string;
    adoption: { id: string; customName: string | null } | null;
  }[];
  adoptions: {
    id: string;
    customName: string | null;
    status: string;
    adoptedAt: string | null;
    assignedAt: string | null;
    coral: { id: string; code: string; species: string | null } | null;
    product: { id: string; name: string } | null;
  }[];
}

const roleLabels: Record<string, string> = {
  visitor: 'Visitor', adopter: 'Adopter', ambassador: 'Ambassador',
  admin: 'Admin', editor: 'Editor', coral_staff: 'Coral Staff',
};

const methodLabels: Record<string, string> = {
  payos: 'PayOS', vnpay: 'VNPay', momo: 'MoMo', bank_transfer: 'Chuyển khoản',
};

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  failed: 'bg-error-container text-error',
  refunded: 'bg-blue-100 text-blue-700',
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailUser, setDetailUser] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [refunding, setRefunding] = useState<string | null>(null); // payment ID being refunded
  const [exporting, setExporting] = useState(false);

  const fetchUsers = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const query = q ? `?search=${encodeURIComponent(q)}` : '';
      const res = await fetch(`/api/v1/admin/users${query}`);
      const json = await res.json();
      setUsers(json.data?.users || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleBlock = async (id: string, isActive: boolean) => {
    await fetch(`/api/v1/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchUsers(search);
  };

  const changeRole = async (id: string, newRole: string) => {
    await fetch(`/api/v1/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers(search);
  };

  const viewDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/users/${id}`);
      const json = await res.json();
      setDetailUser(json.data || null);
    } catch { /* ignore */ } finally { setDetailLoading(false); }
  };

  // SRS AD-11: Admin trigger refund
  const handleRefund = async (paymentId: string) => {
    if (!confirm('Bạn có chắc muốn hoàn tiền giao dịch này? Hành động không thể hoàn tác.')) return;
    setRefunding(paymentId);
    try {
      const res = await fetch(`/api/v1/admin/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Admin hoàn tiền từ admin panel' }),
      });
      const json = await res.json();
      if (res.ok) {
        alert(json.data?.message || 'Đã hoàn tiền thành công');
        if (detailUser) viewDetail(detailUser.id);
      } else {
        alert(json.error || 'Không thể hoàn tiền');
      }
    } catch {
      alert('Lỗi kết nối');
    } finally {
      setRefunding(null);
    }
  };

  const downloadCsv = async (format: 'csv' | 'xlsx' = 'csv') => {
    try {
      setExporting(true);
      const res = await fetch(`/api/v1/admin/reports/export?type=users&format=${format}`);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        alert(json.error || 'Không thể xuất báo cáo');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `coralume-users-${new Date().toISOString().slice(0, 10)}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Lỗi kết nối khi xuất báo cáo');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-display-lg-mobile text-primary mb-6">Quản lý người dùng</h1>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchUsers(search)}
          placeholder="Tìm theo tên hoặc email..."
          className="flex-1 max-w-md rounded-lg border border-outline-variant px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={() => fetchUsers(search)}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors"
        >
          Tìm
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => downloadCsv('csv')}
            disabled={users.length === 0 || exporting}
            className="bg-surface-container-low text-on-surface-variant px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-container transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">download</span>
            {exporting ? 'Đang xuất...' : 'CSV'}
          </button>
          <button
            onClick={() => downloadCsv('xlsx')}
            disabled={users.length === 0 || exporting}
            className="bg-surface-container-low text-on-surface-variant px-4 py-2 rounded-lg text-sm font-medium hover:bg-surface-container transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">table_view</span>
            {exporting ? 'Đang xuất...' : 'Excel'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="text-left px-4 py-3 font-label-sm text-on-surface-variant">Tên</th>
                <th className="text-left px-4 py-3 font-label-sm text-on-surface-variant">Email</th>
                <th className="text-left px-4 py-3 font-label-sm text-on-surface-variant">Role</th>
                <th className="text-center px-4 py-3 font-label-sm text-on-surface-variant">Nhận nuôi</th>
                <th className="text-center px-4 py-3 font-label-sm text-on-surface-variant">Trạng thái</th>
                <th className="text-right px-4 py-3 font-label-sm text-on-surface-variant">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Đang tải...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Không có người dùng</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low">
                    <td className="px-4 py-3 font-medium text-on-surface">{user.fullName}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                        className="text-xs border border-outline-variant rounded-lg px-2 py-1.5 bg-surface-container-lowest outline-none focus:border-primary cursor-pointer"
                      >
                        {Object.entries(roleLabels).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-primary">{user._count.adoptions}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-label-sm text-xs px-2 py-0.5 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-error-container text-error'}`}>
                        {user.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => viewDetail(user.id)}
                          className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Chi tiết
                        </button>
                        <button
                          onClick={() => toggleBlock(user.id, user.isActive)}
                          className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                            user.isActive
                              ? 'bg-error-container text-error hover:bg-error/20'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {user.isActive ? 'Block' : 'Unblock'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {detailUser && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[5vh] bg-black/40 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setDetailUser(null); }}
        >
          <div className="bg-surface-container-lowest rounded-2xl shadow-[0px_10px_40px_rgba(15,76,92,0.12)] w-full max-w-2xl my-8 animate-[slideUp_0.3s_var(--ease-out-expo)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <h2 className="font-display text-headline-md text-primary">Chi tiết người dùng</h2>
              <button
                onClick={() => setDetailUser(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="px-6 py-4 space-y-5 max-h-[65vh] overflow-y-auto">
              {detailLoading ? (
                <p className="text-center text-on-surface-variant py-8">Đang tải...</p>
              ) : (
                <>
                  {/* User Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-on-surface-variant">Tên</span>
                      <p className="font-medium text-on-surface">{detailUser.fullName}</p>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant">Email</span>
                      <p className="font-medium text-on-surface">{detailUser.email}</p>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant">SĐT</span>
                      <p className="font-medium text-on-surface">{detailUser.phone || '—'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant">Role</span>
                      <p className="font-medium text-on-surface">
                        <span className="bg-primary/10 text-primary font-label-sm px-2 py-0.5 rounded-full text-xs">
                          {roleLabels[detailUser.role] || detailUser.role}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant">Trạng thái</span>
                      <p className="flex gap-2 mt-0.5">
                        <span className={`font-label-sm text-xs px-2 py-0.5 rounded-full ${detailUser.isActive ? 'bg-green-100 text-green-700' : 'bg-error-container text-error'}`}>
                          {detailUser.isActive ? 'Active' : 'Blocked'}
                        </span>
                        <span className={`font-label-sm text-xs px-2 py-0.5 rounded-full ${detailUser.isVerified ? 'bg-green-100 text-green-700' : 'bg-surface-container-low text-on-surface-variant'}`}>
                          {detailUser.isVerified ? 'Verified' : 'Chưa xác thực'}
                        </span>
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-on-surface-variant">Ngày tham gia</span>
                      <p className="font-medium text-on-surface text-sm">{formatDate(detailUser.createdAt)}</p>
                    </div>
                  </div>

                  {/* Adoptions */}
                  <div>
                    <h3 className="font-label-sm text-sm text-on-surface mb-2">
                      Nhận nuôi ({detailUser._count.adoptions})
                    </h3>
                    {detailUser.adoptions.length === 0 ? (
                      <p className="text-sm text-on-surface-variant">Chưa có nhận nuôi nào</p>
                    ) : (
                      <div className="space-y-2">
                        {detailUser.adoptions.map((a) => (
                          <div key={a.id} className="flex items-center justify-between bg-surface-container-low rounded-lg px-3 py-2 text-xs">
                            <div>
                              <span className="font-medium text-on-surface">{a.customName || 'Không tên'}</span>
                              <span className="text-on-surface-variant ml-2">
                                {a.product?.name || '—'} · {a.coral?.code || 'Chưa gán'}
                              </span>
                            </div>
                            <span className={`font-label-sm px-2 py-0.5 rounded-full text-xs ${
                              a.status === 'active' ? 'bg-green-100 text-green-700' :
                              a.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              'bg-surface-container text-on-surface-variant'
                            }`}>
                              {a.status === 'active' ? 'Active' : a.status === 'pending' ? 'Pending' : a.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Payment History */}
                  <div>
                    <h3 className="font-label-sm text-sm text-on-surface mb-2">
                      Lịch sử thanh toán ({detailUser._count.payments})
                    </h3>
                    {detailUser.payments.length === 0 ? (
                      <p className="text-sm text-on-surface-variant">Chưa có thanh toán nào</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-outline-variant/50">
                              <th className="text-left py-2 font-label-sm text-on-surface-variant">Ngày</th>
                              <th className="text-left py-2 font-label-sm text-on-surface-variant">Số tiền</th>
                              <th className="text-left py-2 font-label-sm text-on-surface-variant">PP</th>
                              <th className="text-left py-2 font-label-sm text-on-surface-variant">Trạng thái</th>
                              <th className="text-right py-2 font-label-sm text-on-surface-variant">Hành động</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailUser.payments.map((p) => (
                              <tr key={p.id} className="border-b border-outline-variant/30">
                                <td className="py-2 text-on-surface">{formatDate(p.createdAt)}</td>
                                <td className="py-2 text-on-surface font-mono">{p.amount.toLocaleString('vi-VN')}đ</td>
                                <td className="py-2 text-on-surface-variant">{methodLabels[p.method] || p.method}</td>
                                <td className="py-2">
                                  <span className={`font-label-sm px-1.5 py-0.5 rounded-full text-xs ${statusColors[p.status] || 'bg-surface-container text-on-surface-variant'}`}>
                                    {p.status === 'completed' ? '✅' : p.status === 'pending' ? '⏳' : p.status === 'refunded' ? '↩️' : '❌'} {p.status}
                                  </span>
                                </td>
                                <td className="py-2 text-right">
                                  {/* SRS AD-11: Refund button for completed payments */}
                                  {p.status === 'completed' && (
                                    <button
                                      onClick={() => handleRefund(p.id)}
                                      disabled={refunding === p.id}
                                      className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50"
                                    >
                                      {refunding === p.id ? 'Đang hoàn...' : 'Hoàn tiền'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
