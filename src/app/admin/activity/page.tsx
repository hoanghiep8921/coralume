'use client';

import { useState, useEffect, useCallback } from 'react';

interface ActivityLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
  admin: { fullName: string; email: string };
}

const ACTION_LABELS: Record<string, string> = {
  create_post: 'Tạo bài viết',
  update_post: 'Sửa bài viết',
  delete_post: 'Xoá bài viết',
  publish_post: 'Đăng bài',
  unpublish_post: 'Gỡ bài',
  update_settings: 'Cập nhật cài đặt',
  create_staff: 'Tạo nhân viên',
  change_role: 'Đổi quyền',
  block_user: 'Khoá người dùng',
  unblock_user: 'Mở khoá người dùng',
};

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '50');
      if (actionFilter) params.set('action', actionFilter);
      const res = await fetch(`/api/v1/admin/activity?${params}`);
      const json = await res.json();
      setLogs(json.data?.logs || []);
      setTotalPages(json.data?.pagination?.totalPages || 1);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [page, actionFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const targetLabel = (log: ActivityLog) => {
    if (!log.targetType) return '—';
    const typeMap: Record<string, string> = {
      blog_post: 'Bài viết',
      user: 'Người dùng',
      site_settings: 'Cài đặt',
    };
    return `${typeMap[log.targetType] || log.targetType}${log.targetId ? ` (${log.targetId.slice(0, 8)}...)` : ''}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Nhật ký hoạt động</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Theo dõi mọi hành động của admin — không thể xoá
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-outline-variant px-4 py-2.5 text-sm outline-none focus:border-primary"
        >
          <option value="">Tất cả hành động</option>
          {Object.entries(ACTION_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-on-surface">Thời gian</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface">Admin</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface">Hành động</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface">Đối tượng</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-on-surface-variant">Đang tải...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-on-surface-variant">Chưa có hoạt động nào</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container/50">
                    <td className="px-4 py-3 text-on-surface-variant text-xs whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-on-surface text-xs">{log.admin.fullName}</span>
                      <span className="block text-xs text-on-surface-variant">{log.admin.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-primary-container text-on-primary-container">
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant">
                      {targetLabel(log)}
                    </td>
                    <td className="px-4 py-3 text-xs text-on-surface-variant max-w-[200px] truncate">
                      {log.details ? JSON.stringify(log.details) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-outline-variant">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 text-sm rounded border border-outline-variant disabled:opacity-30"
            >
              ← Trước
            </button>
            <span className="text-sm text-on-surface-variant">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-sm rounded border border-outline-variant disabled:opacity-30"
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
