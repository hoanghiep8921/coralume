'use client';

import { useState, useEffect, useCallback } from 'react';

interface StaffUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  _count: { blogPosts: number; coralUpdates: number };
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'editor' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      const res = await fetch(`/api/v1/admin/staff?${params}`);
      const json = await res.json();
      setStaff(json.data || []);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/v1/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: json.error || 'Lỗi' });
        return;
      }
      setMessage({ type: 'success', text: `Đã tạo tài khoản ${json.data.fullName}` });
      setShowModal(false);
      setForm({ fullName: '', email: '', password: '', role: 'editor' });
      fetchStaff();
      setTimeout(() => setMessage(null), 3000);
    } catch {
      setMessage({ type: 'error', text: 'Không thể kết nối' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleBlock = async (id: string, currentActive: boolean) => {
    try {
      await fetch(`/api/v1/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      fetchStaff();
    } catch { /* ignore */ }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await fetch(`/api/v1/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      fetchStaff();
    } catch { /* ignore */ }
  };

  const roleLabel = (role: string) =>
    role === 'editor' ? 'Editor' :
    role === 'coral_staff' ? 'Coral Staff' : role;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary">Quản lý nhân viên</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Phân quyền đăng bài — Editor có thể viết blog, Coral Staff cập nhật san hô
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-secondary text-on-secondary px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-secondary-container transition-colors"
        >
          + Tạo nhân viên mới
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-error-container text-error'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchStaff()}
          placeholder="Tìm theo tên hoặc email..."
          className="flex-1 rounded-lg border border-outline-variant px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-outline-variant px-4 py-2.5 text-sm outline-none focus:border-primary"
        >
          <option value="">Tất cả role</option>
          <option value="editor">Editor</option>
          <option value="coral_staff">Coral Staff</option>
        </select>
        <button
          onClick={fetchStaff}
          className="px-6 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-semibold"
        >
          Tìm
        </button>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-container border-b border-outline-variant">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-on-surface">Tên</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface">Email</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface">Role</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface">Bài viết</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium text-on-surface">Ngày tạo</th>
                <th className="text-right px-4 py-3 font-medium text-on-surface">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-on-surface-variant">Đang tải...</td></tr>
              ) : staff.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-on-surface-variant">Không có nhân viên nào</td></tr>
              ) : (
                staff.map((s) => (
                  <tr key={s.id} className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container/50">
                    <td className="px-4 py-3 font-medium text-on-surface">{s.fullName}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{s.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={s.role}
                        onChange={(e) => handleRoleChange(s.id, e.target.value)}
                        className="rounded border border-outline-variant px-2 py-1 text-xs outline-none"
                      >
                        <option value="editor">Editor</option>
                        <option value="coral_staff">Coral Staff</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {s.role === 'editor' ? s._count.blogPosts : s._count.coralUpdates}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          s.isActive ? 'bg-green-100 text-green-700' : 'bg-error-container text-error'
                        }`}
                      >
                        {s.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs">
                      {new Date(s.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleToggleBlock(s.id, s.isActive)}
                        className={`text-xs px-3 py-1 rounded font-medium ${
                          s.isActive
                            ? 'text-error hover:bg-error-container/20'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {s.isActive ? 'Khoá' : 'Mở khoá'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-surface rounded-2xl w-full max-w-md shadow-2xl p-6">
            <h2 className="text-lg font-display font-bold text-primary mb-4">Tạo tài khoản nhân viên</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Họ tên</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="block w-full rounded-lg border border-outline-variant px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="block w-full rounded-lg border border-outline-variant px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Mật khẩu</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="block w-full rounded-lg border border-outline-variant px-3 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="Tối thiểu 8 ký tự"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Quyền</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="block w-full rounded-lg border border-outline-variant px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="editor">Editor — Quản lý bài viết blog</option>
                  <option value="coral_staff">Coral Staff — Cập nhật san hô</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant text-sm font-medium"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-secondary text-on-secondary text-sm font-semibold disabled:opacity-50"
                >
                  {saving ? 'Đang tạo...' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
