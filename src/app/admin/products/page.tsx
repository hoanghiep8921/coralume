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
}

const tierLabels: Record<string, string> = {
  standard: 'Seed Coral', premium: 'Reef Guardian', premium_plus: 'Diving',
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h1 className="font-display text-display-lg-mobile text-primary mb-6">Quản lý sản phẩm</h1>

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
                      <button
                        onClick={() => toggleActive(p.id, p.isActive)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                          p.isActive ? 'bg-error-container text-error hover:bg-error/20' : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {p.isActive ? 'Deactivate' : 'Activate'}
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
