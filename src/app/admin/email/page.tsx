'use client';

import { useState } from 'react';

const roleLabels: Record<string, string> = {
  all: 'Tất cả người dùng',
  adopter: 'Adopter',
  ambassador: 'Ambassador',
  admin: 'Admin',
  editor: 'Editor',
  coral_staff: 'Coral Staff',
};

export default function AdminEmailPage() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [role, setRole] = useState('all');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ total: number; sent: number; failed: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!subject.trim() || !content.trim()) return;
    setSending(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/v1/admin/bulk-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: subject.trim(), content: content.trim(), role }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Lỗi'); return; }
      setResult(json.data);
    } catch { setError('Không thể kết nối'); } finally { setSending(false); }
  };

  return (
    <div>
      <h1 className="font-display text-display-lg-mobile text-primary mb-6">Gửi email hàng loạt</h1>

      <div className="max-w-2xl bg-surface-container-lowest rounded-xl p-6 shadow-card border border-outline-variant space-y-4">
        {error && <div className="bg-error-container text-error text-sm px-4 py-3 rounded-lg">{error}</div>}
        {result && (
          <div className="bg-green-100 text-green-700 text-sm px-4 py-3 rounded-lg">
            Đã gửi: {result.sent}/{result.total} thành công
            {result.failed > 0 && ` (${result.failed} thất bại)`}
          </div>
        )}

        <div>
          <label className="block text-sm font-label-sm text-on-surface mb-1">Đối tượng</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm bg-surface-container-lowest">
            {Object.entries(roleLabels).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-label-sm text-on-surface mb-1">Tiêu đề <span className="text-error">*</span></label>
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Tiêu đề email..." className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm outline-none focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-label-sm text-on-surface mb-1">Nội dung <span className="text-error">*</span> <span className="text-on-surface-variant font-normal">(HTML)</span></label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={10} placeholder="<p>Nội dung email dạng HTML...</p>" className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm font-mono outline-none focus:border-primary resize-vertical" />
        </div>

        <button onClick={handleSend} disabled={sending || !subject.trim() || !content.trim()} className="w-full bg-primary text-on-primary font-semibold py-3 rounded-lg disabled:opacity-50">
          {sending ? 'Đang gửi...' : 'Gửi email'}
        </button>
      </div>
    </div>
  );
}
