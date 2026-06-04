'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0F4C5C', '#E87750', '#5BA8B5', '#F4B89A', '#B5D8E8', '#8A9BA8'];

const monthLabels: Record<string, string> = {
  '01': 'T1', '02': 'T2', '03': 'T3', '04': 'T4', '05': 'T5', '06': 'T6',
  '07': 'T7', '08': 'T8', '09': 'T9', '10': 'T10', '11': 'T11', '12': 'T12',
};
function fmtMonth(m: string) { const p = m.split('-'); return monthLabels[p[1] || ''] || m; }
function fmtVnd(n: number) { return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(0)}K` : `${n}`; }

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/admin/analytics')
      .then(r => r.json())
      .then(j => setData(j.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-on-surface-variant py-8">Đang tải dữ liệu...</p>;
  if (!data) return <p className="text-center text-on-surface-variant py-8">Không có dữ liệu</p>;

  const { overview, adoptionStatus, revenueByTier, paymentsByMethod, userGrowth, monthlyTrend } = data;
  const chartData = monthlyTrend.map((d: any) => ({ ...d, monthLabel: fmtMonth(d.month) }));
  const userData = userGrowth.map((d: any) => ({ ...d, monthLabel: fmtMonth(d.month) }));
  const statusData = [
    { name: 'Pending', value: adoptionStatus.pending },
    { name: 'Active', value: adoptionStatus.active },
    { name: 'Completed', value: adoptionStatus.completed },
  ];
  const pieData = paymentsByMethod.map((p: any) => ({ name: p.method, value: p.total }));

  return (
    <div>
      <h1 className="font-display text-display-lg-mobile text-primary mb-6">Analytics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Người dùng', value: overview.userCount },
          { label: 'Adopters', value: overview.adopters },
          { label: 'Tỷ lệ chuyển đổi', value: `${overview.conversionRate}%` },
          { label: 'San hô', value: overview.coralCount },
          { label: 'Doanh thu', value: `${fmtVnd(overview.totalRevenue)}đ` },
        ].map(c => (
          <div key={c.label} className="bg-surface-container-lowest rounded-xl p-4 shadow-card border border-outline-variant text-center">
            <p className="text-xs text-on-surface-variant mb-1">{c.label}</p>
            <p className="font-mono text-xl text-primary font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Nhận nuôi theo tháng</h2>
          <div className="h-64">
            <ResponsiveContainer><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" /><XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} /><YAxis allowDecimals={false} tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="adoptions" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} /></LineChart></ResponsiveContainer>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Doanh thu theo tháng</h2>
          <div className="h-64">
            <ResponsiveContainer><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" /><XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} /><YAxis tickFormatter={fmtVnd} tick={{ fontSize: 12 }} /><Tooltip formatter={(v: any) => [`${Number(v).toLocaleString('vi-VN')}đ`]} /><Bar dataKey="revenue" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Tăng trưởng người dùng</h2>
          <div className="h-64">
            <ResponsiveContainer><LineChart data={userData}><CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" /><XAxis dataKey="monthLabel" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="newUsers" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 4 }} name="Người mới" /><Line type="monotone" dataKey="totalUsers" stroke="var(--color-secondary)" strokeWidth={2} dot={{ r: 4 }} name="Tổng" /></LineChart></ResponsiveContainer>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant">
          <h2 className="font-headline-md text-headline-md text-primary mb-4">Trạng thái nhận nuôi</h2>
          <div className="h-64">
            <ResponsiveContainer><PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}><Cell fill={COLORS[0]} /><Cell fill={COLORS[1]} /><Cell fill={COLORS[2]} /></Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue by Tier */}
      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant mb-6">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">Nhận nuôi theo gói sản phẩm</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm"><thead><tr className="border-b border-outline-variant"><th className="text-left py-2 font-label-sm">Gói</th><th className="text-right py-2 font-label-sm">Số lượng</th></tr></thead><tbody>{revenueByTier.map((r: any) => <tr key={r.name} className="border-b border-outline-variant/30"><td className="py-2 text-on-surface">{r.name}</td><td className="py-2 text-right font-mono text-primary">{r.adoptions}</td></tr>)}</tbody></table>
        </div>
      </div>
    </div>
  );
}
