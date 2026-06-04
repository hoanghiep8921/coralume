'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';

interface CoralItem {
  id: string;
  code: string;
  species: string;
  status: string;
  locationZone: string;
  updates: Array<{ id: string; sizeCm: number; health: string; notes: string; images: string[]; createdAt: string }>;
  adoptions: Array<{ id: string; customName: string; user: { fullName: string; email: string } }>;
}

interface AdoptionItem {
  id: string;
  customName: string;
  status: string;
  user: { fullName: string; email: string };
  product: { name: string; tier: string };
  coral: { code: string } | null;
}

interface DashboardData {
  needUpdate: number;
  totalAssigned: number;
  corals: CoralItem[];
}

function daysSince(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Hôm nay';
  if (diff === 1) return 'Hôm qua';
  return `${diff} ngày trước`;
}

export function CoralPortalClient({ data }: { data: DashboardData | null }) {
  const [tab, setTab] = useState<'dashboard' | 'adopters'>('dashboard');
  const [corals, setCorals] = useState<CoralItem[]>([]);
  const [adoptions, setAdoptions] = useState<AdoptionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'overdue' | 'recent'>('all');

  const fetchCorals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/portal/dashboard');
      const json = await res.json();
      setCorals(json.data?.corals || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  const fetchAdoptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/portal/adoptions');
      const json = await res.json();
      setAdoptions(json.data || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (tab === 'dashboard') fetchCorals();
    else fetchAdoptions();
  }, [tab, fetchCorals, fetchAdoptions]);

  // Client-side filter
  const filteredCorals = useMemo(() => {
    if (filter === 'all') return corals;
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    return corals.filter((coral) => {
      const lastUpdate = coral.updates?.[0];
      const isOverdue = !lastUpdate || (now - new Date(lastUpdate.createdAt).getTime()) > thirtyDays;
      if (filter === 'overdue') return isOverdue;
      return !isOverdue;
    });
  }, [corals, filter]);

  return (
    <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-display font-bold text-primary">Coral Portal</h1>
          <p className="text-sm text-on-surface-variant">Cập nhật ảnh, video và chỉ số san hô</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant">
          <span className="text-2xl font-mono font-bold text-error">
            {String(data?.needUpdate ?? '—')}
          </span>
          <span className="block text-xs text-on-surface-variant mt-1">Cần cập nhật &gt;30 ngày</span>
        </div>
        <div className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant">
          <span className="text-2xl font-mono font-bold text-primary">
            {String(data?.totalAssigned ?? '—')}
          </span>
          <span className="block text-xs text-on-surface-variant mt-1">San hô đang chăm sóc</span>
        </div>
        <div className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant">
          <span className="text-2xl font-mono font-bold text-on-tertiary-container">
            {corals.length}
          </span>
          <span className="block text-xs text-on-surface-variant mt-1">Hiển thị</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-outline-variant mb-4">
        <button
          onClick={() => setTab('dashboard')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-[1px] ${
            tab === 'dashboard' ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant'
          }`}
        >
          San hô cần chăm sóc
        </button>
        <button
          onClick={() => setTab('adopters')}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-[1px] ${
            tab === 'adopters' ? 'border-secondary text-secondary' : 'border-transparent text-on-surface-variant'
          }`}
        >
          Người nhận nuôi
        </button>
      </div>

      {/* Filter (coral tab only) */}
      {tab === 'dashboard' && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {([
            { value: 'all', label: 'Tất cả' },
            { value: 'overdue', label: `Quá hạn >30 ngày` },
            { value: 'recent', label: 'Đã cập nhật gần đây' },
          ] as const).map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap border transition-colors ${
                filter === opt.value
                  ? 'bg-primary-container text-on-primary-container border-primary'
                  : 'border-outline-variant text-on-surface-variant hover:border-primary'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {tab === 'dashboard' && (
        <div className="space-y-3">
          {loading ? (
            <p className="text-on-surface-variant text-center py-8">Đang tải...</p>
          ) : filteredCorals.length === 0 ? (
            <p className="text-on-surface-variant text-center py-8">Không có san hô nào</p>
          ) : (
            filteredCorals.map((coral) => {
              const lastUpdate = coral.updates?.[0];
              const adopter = coral.adoptions?.[0];

              return (
                <div key={coral.id} className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-mono text-sm text-primary font-bold">{coral.code}</span>
                      <span className="text-on-surface-variant text-sm ml-3">{coral.species || '—'}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-label-sm ${
                      lastUpdate ? 'bg-green-100 text-green-700' : 'bg-error-container text-error'
                    }`}>
                      {lastUpdate ? daysSince(lastUpdate.createdAt) : 'Chưa cập nhật'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                    <span>Người nuôi: {adopter?.user?.fullName || '—'}</span>
                    <span>Size: {lastUpdate?.sizeCm ? `${lastUpdate.sizeCm}cm` : '—'}</span>
                    <span>Sức khoẻ: {lastUpdate?.health || '—'}</span>
                  </div>
                  <div className="mt-3">
                    <Link
                      href={`/coral-portal/update?coralId=${coral.id}`}
                      className="text-xs bg-primary text-on-primary px-3 py-1.5 rounded font-medium inline-block"
                    >
                      Cập nhật
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Adopters View-Only */}
      {tab === 'adopters' && (
        <div className="space-y-3">
          {loading ? (
            <p className="text-on-surface-variant text-center py-8">Đang tải...</p>
          ) : adoptions.length === 0 ? (
            <p className="text-on-surface-variant text-center py-8">Không có người nhận nuôi</p>
          ) : (
            adoptions.map((adoption) => (
              <div key={adoption.id} className="bg-surface-container-lowest rounded-lg p-4 border border-outline-variant">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium text-on-surface">{adoption.user?.fullName || '—'}</span>
                    <span className="text-on-surface-variant text-sm ml-3">{adoption.user?.email || '—'}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-label-sm ${
                    adoption.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {adoption.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </div>
                <div className="text-xs text-on-surface-variant">
                  <span>{adoption.product?.name || '—'}</span>
                  <span className="mx-2">·</span>
                  <span>San hô: {adoption.coral?.code || 'Chưa gán'}</span>
                  <span className="mx-2">·</span>
                  <span>Tên đặt: {adoption.customName || 'Chưa đặt'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
