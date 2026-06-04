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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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

  const roleLabels: Record<string, string> = {
    visitor: 'Visitor', adopter: 'Adopter', ambassador: 'Ambassador',
    admin: 'Admin', editor: 'Editor', coral_staff: 'Coral Staff',
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
                      <span className="bg-primary/10 text-primary font-label-sm px-2 py-0.5 rounded-full text-xs">
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-primary">{user._count.adoptions}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-label-sm text-xs px-2 py-0.5 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-error-container text-error'}`}>
                        {user.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleBlock(user.id, user.isActive)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                          user.isActive
                            ? 'bg-error-container text-error hover:bg-error/20'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {user.isActive ? 'Block' : 'Unblock'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
