'use client';

import { useState, useEffect } from 'react';

interface Coral {
  id: string;
  code: string;
  species?: string;
  status: string;
  locationZone?: string;
  adoptions: Array<{ id: string; customName?: string; user?: { fullName: string; email: string } }>;
}

const statusLabels: Record<string, string> = {
  available: 'Sẵn sàng', assigned: 'Đã gán', growing: 'Đang phát triển', dead: 'Đã chết',
};
const statusColors: Record<string, string> = {
  available: 'bg-green-100 text-green-700', assigned: 'bg-primary/10 text-primary',
  growing: 'bg-blue-100 text-blue-700', dead: 'bg-error-container text-error',
};

export default function AdminCoralsPage() {
  const [corals, setCorals] = useState<Coral[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCorals = async () => {
    setLoading(true);
    try {
      const query = statusFilter ? `?status=${statusFilter}` : '';
      const res = await fetch(`/api/v1/admin/corals${query}`);
      const json = await res.json();
      setCorals(json.data?.corals || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchCorals(); }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/v1/admin/corals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchCorals();
  };

  return (
    <div>
      <h1 className="font-display text-display-lg-mobile text-primary mb-6">Quản lý san hô</h1>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'available', 'assigned', 'growing', 'dead'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-label-sm transition-colors ${
              statusFilter === s ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant'
            }`}
          >
            {s ? statusLabels[s] || s : 'Tất cả'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="text-left px-4 py-3 font-label-sm">Mã</th>
                <th className="text-left px-4 py-3 font-label-sm">Loài</th>
                <th className="text-left px-4 py-3 font-label-sm">Khu vực</th>
                <th className="text-center px-4 py-3 font-label-sm">Trạng thái</th>
                <th className="text-left px-4 py-3 font-label-sm">Người nhận nuôi</th>
                <th className="text-right px-4 py-3 font-label-sm">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Đang tải...</td></tr>
              ) : corals.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Không có san hô</td></tr>
              ) : (
                corals.map((coral) => (
                  <tr key={coral.id} className="border-b border-outline-variant/50">
                    <td className="px-4 py-3 font-mono text-primary font-medium">{coral.code}</td>
                    <td className="px-4 py-3 text-on-surface">{coral.species || '—'}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{coral.locationZone || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-label-sm text-xs px-2 py-0.5 rounded-full ${statusColors[coral.status] || ''}`}>
                        {statusLabels[coral.status] || coral.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">
                      {coral.adoptions[0]?.user?.fullName || '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={coral.status}
                        onChange={(e) => updateStatus(coral.id, e.target.value)}
                        className="text-xs border border-outline-variant rounded px-2 py-1 bg-surface-container-lowest"
                      >
                        {Object.entries(statusLabels).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
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
