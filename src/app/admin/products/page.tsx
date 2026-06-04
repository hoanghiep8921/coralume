'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  slug: string;
  name: string;
  tier: string;
  priceMin: number;
  priceMax: number;
  isActive: boolean;
  benefits: string[];
  description?: string;
}

const tierLabels: Record<string, string> = {
  standard: 'Seed Coral', premium: 'Reef Guardian', premium_plus: 'Diving',
};

const emptyProduct = () => ({
  name: '',
  slug: '',
  tier: 'standard',
  priceMin: 200000,
  priceMax: 300000,
  description: '',
  benefits: [] as string[],
  isActive: true,
});

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct());
  const [benefitsText, setBenefitsText] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/products');
      const json = await res.json();
      setProducts(json.data || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const toggleActive = async (id: string, current: boolean) => {
    await fetch(`/api/v1/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    fetchProducts();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xóa sản phẩm "${name}"? Hành động này không thể hoàn tác.`)) return;
    await fetch(`/api/v1/admin/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyProduct());
    setBenefitsText('');
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      slug: p.slug,
      tier: p.tier,
      priceMin: p.priceMin,
      priceMax: p.priceMax,
      description: p.description || '',
      benefits: p.benefits,
      isActive: p.isActive,
    });
    setBenefitsText(p.benefits.join('\n'));
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const body = {
        ...form,
        benefits: benefitsText
          .split('\n')
          .map((b) => b.trim())
          .filter(Boolean),
      };

      if (editingId) {
        await fetch(`/api/v1/admin/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        await fetch('/api/v1/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      setShowModal(false);
      fetchProducts();
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-display-lg-mobile text-primary">Quản lý sản phẩm</h1>
        <button
          onClick={openCreate}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Tạo sản phẩm mới
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-card border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="text-left px-4 py-3 font-label-sm">Tên</th>
                <th className="text-left px-4 py-3 font-label-sm">Tier</th>
                <th className="text-right px-4 py-3 font-label-sm">Giá thấp nhất</th>
                <th className="text-right px-4 py-3 font-label-sm">Giá cao nhất</th>
                <th className="text-center px-4 py-3 font-label-sm">Trạng thái</th>
                <th className="text-right px-4 py-3 font-label-sm">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Đang tải...</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-b border-outline-variant/50">
                    <td className="px-4 py-3 font-medium text-on-surface">{p.name}</td>
                    <td className="px-4 py-3">
                      <span className="bg-secondary/10 text-secondary font-label-sm px-2 py-0.5 rounded-full text-xs">
                        {tierLabels[p.tier] || p.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-on-surface">
                      {p.priceMin.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-on-surface">
                      {p.priceMax.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-label-sm text-xs px-2 py-0.5 rounded-full ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-error-container text-error'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleActive(p.id, p.isActive)}
                          className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                            p.isActive ? 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container' : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {p.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-error-container text-error hover:bg-error/20 transition-colors"
                        >
                          Xóa
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[5vh] bg-black/40 backdrop-blur-sm overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div className="bg-surface-container-lowest rounded-2xl shadow-[0px_10px_40px_rgba(15,76,92,0.12)] w-full max-w-xl my-8 animate-[slideUp_0.3s_var(--ease-out-expo)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <h2 className="font-display text-headline-md text-primary">
                {editingId ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="px-6 py-4 space-y-4 max-h-[65vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-label-sm text-on-surface mb-1">Tên sản phẩm <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-label-sm text-on-surface mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm font-mono outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-label-sm text-on-surface mb-1">Tier</label>
                  <select
                    value={form.tier}
                    onChange={(e) => setForm({ ...form, tier: e.target.value })}
                    className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm outline-none focus:border-primary bg-surface-container-lowest"
                  >
                    {Object.entries(tierLabels).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-label-sm text-on-surface mb-1">Giá thấp nhất (VND)</label>
                  <input
                    type="number"
                    value={form.priceMin}
                    onChange={(e) => setForm({ ...form, priceMin: Number(e.target.value) })}
                    className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm font-mono outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-label-sm text-on-surface mb-1">Giá cao nhất (VND)</label>
                  <input
                    type="number"
                    value={form.priceMax}
                    onChange={(e) => setForm({ ...form, priceMax: Number(e.target.value) })}
                    className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm font-mono outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-label-sm text-on-surface mb-1">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm outline-none focus:border-primary resize-vertical"
                />
              </div>
              <div>
                <label className="block text-sm font-label-sm text-on-surface mb-1">
                  Quyền lợi <span className="text-on-surface-variant font-normal">(mỗi dòng 1 quyền lợi)</span>
                </label>
                <textarea
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  rows={5}
                  placeholder="Giấy chứng nhận kỹ thuật số&#10;Cập nhật ảnh/video hàng tháng&#10;..."
                  className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm outline-none focus:border-primary resize-vertical"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-label-sm text-on-surface">Trạng thái:</label>
                <select
                  value={form.isActive ? 'active' : 'inactive'}
                  onChange={(e) => setForm({ ...form, isActive: e.target.value === 'active' })}
                  className="rounded-lg border border-outline-variant px-3 py-1.5 text-sm bg-surface-container-lowest"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
                className="bg-primary text-on-primary px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo sản phẩm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
