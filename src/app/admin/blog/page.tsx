'use client';

import { useState, useEffect, useCallback } from 'react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  status: string;
  readingTime?: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: { id: string; fullName: string };
}

const categoryLabels: Record<string, string> = {
  ecology: 'Sinh thái san hô',
  conservation: 'Bảo tồn',
  green_economy: 'Kinh tế xanh',
  adopter_stories: 'Chuyến lặn của adopter',
};

const categoryColors: Record<string, string> = {
  ecology: 'bg-blue-100 text-blue-700',
  conservation: 'bg-green-100 text-green-700',
  green_economy: 'bg-amber-100 text-amber-700',
  adopter_stories: 'bg-secondary/10 text-secondary',
};

const emptyPost = (): Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'author'> => ({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: 'ecology',
  tags: [],
  status: 'draft',
  readingTime: 1,
  publishedAt: undefined,
});

function slugify(text: string): string {
  const from = 'àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ';
  const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd';
  let s = text.toLowerCase().trim();
  for (let i = 0; i < from.length; i++) {
    s = s.replaceAll(from[i], to[i]);
  }
  s = s
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return s || 'bai-viet';
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPost());
  const [saving, setSaving] = useState(false);

  const fetchPosts = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const query = q ? `?search=${encodeURIComponent(q)}` : '';
      const res = await fetch(`/api/v1/admin/blog${query}`);
      const json = await res.json();
      setPosts(json.data?.posts || []);
    } catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // ==========================================================
  // CRUD handlers
  // ==========================================================

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyPost());
    setShowModal(true);
  };

  const openEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/admin/blog/${id}`);
      const json = await res.json();
      if (json.data) {
        const p = json.data;
        setForm({
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt || '',
          content: p.content,
          featuredImage: p.featuredImage || '',
          category: p.category,
          tags: p.tags,
          status: p.status,
          readingTime: p.readingTime,
          publishedAt: p.publishedAt,
        });
        setEditingId(id);
        setShowModal(true);
      }
    } catch { /* ignore */ }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    try {
      const body = {
        ...form,
        slug: form.slug || slugify(form.title),
        tags: Array.isArray(form.tags) ? form.tags : [],
      };

      if (editingId) {
        await fetch(`/api/v1/admin/blog/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        await fetch('/api/v1/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      setShowModal(false);
      fetchPosts(search);
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa bài viết này? Hành động này không thể hoàn tác.')) return;
    try {
      await fetch(`/api/v1/admin/blog/${id}`, { method: 'DELETE' });
      fetchPosts(search);
    } catch { /* ignore */ }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      await fetch(`/api/v1/admin/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: currentStatus === 'draft' ? 'published' : 'draft' }),
      });
      fetchPosts(search);
    } catch { /* ignore */ }
  };

  // ==========================================================
  // Form helpers
  // ==========================================================

  const updateForm = (field: string, value: string | string[]) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !editingId) {
        next.slug = slugify(value as string);
      }
      return next;
    });
  };

  // ==========================================================
  // Render
  // ==========================================================

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-display-lg-mobile text-primary">Quản lý bài viết</h1>
        <button
          onClick={openCreate}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Tạo bài viết mới
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchPosts(search)}
          placeholder="Tìm theo tiêu đề..."
          className="flex-1 max-w-md rounded-lg border border-outline-variant px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={() => fetchPosts(search)}
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
                <th className="text-left px-4 py-3 font-label-sm text-on-surface-variant">Tiêu đề</th>
                <th className="text-left px-4 py-3 font-label-sm text-on-surface-variant">Danh mục</th>
                <th className="text-center px-4 py-3 font-label-sm text-on-surface-variant">Trạng thái</th>
                <th className="text-left px-4 py-3 font-label-sm text-on-surface-variant">Tác giả</th>
                <th className="text-left px-4 py-3 font-label-sm text-on-surface-variant">Ngày đăng</th>
                <th className="text-right px-4 py-3 font-label-sm text-on-surface-variant">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Đang tải...</td></tr>
              ) : posts.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-on-surface-variant">Chưa có bài viết nào</td></tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b border-outline-variant/50 hover:bg-surface-container-low">
                    <td className="px-4 py-3 font-medium text-on-surface max-w-xs truncate">
                      {post.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-label-sm text-xs px-2 py-0.5 rounded-full ${categoryColors[post.category] || 'bg-surface-container text-on-surface-variant'}`}>
                        {categoryLabels[post.category] || post.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-label-sm text-xs px-2 py-0.5 rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-surface-container-low text-on-surface-variant'
                      }`}>
                        {post.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{post.author.fullName}</td>
                    <td className="px-4 py-3 text-on-surface-variant text-xs">{formatDate(post.publishedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleStatus(post.id, post.status)}
                          className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                            post.status === 'published'
                              ? 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          title={post.status === 'published' ? 'Chuyển về nháp' : 'Xuất bản'}
                        >
                          {post.status === 'published' ? 'Bỏ xuất bản' : 'Xuất bản'}
                        </button>
                        <button
                          onClick={() => openEdit(post.id)}
                          className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
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
          <div className="bg-surface-container-lowest rounded-2xl shadow-[0px_10px_40px_rgba(15,76,92,0.12)] w-full max-w-2xl my-8 animate-[slideUp_0.3s_var(--ease-out-expo)]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <h2 className="font-display text-headline-md text-primary">
                {editingId ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-sm font-label-sm text-on-surface mb-1">
                  Tiêu đề <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder="Nhập tiêu đề bài viết"
                  className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-label-sm text-on-surface mb-1">Slug</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => updateForm('slug', e.target.value)}
                    placeholder="tu-dong-tao-tu-tieu-de"
                    className="flex-1 rounded-lg border border-outline-variant px-4 py-2 text-sm font-mono outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => updateForm('slug', slugify(form.title))}
                    className="px-3 py-2 text-xs rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors"
                    title="Tạo lại từ tiêu đề"
                  >
                    <span className="material-symbols-outlined text-base">autorenew</span>
                  </button>
                </div>
              </div>

              {/* Category + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-label-sm text-on-surface mb-1">Danh mục</label>
                  <select
                    value={form.category}
                    onChange={(e) => updateForm('category', e.target.value)}
                    className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm outline-none focus:border-primary bg-surface-container-lowest"
                  >
                    {Object.entries(categoryLabels).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-label-sm text-on-surface mb-1">Trạng thái</label>
                  <select
                    value={form.status}
                    onChange={(e) => updateForm('status', e.target.value)}
                    className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm outline-none focus:border-primary bg-surface-container-lowest"
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Đã xuất bản</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-label-sm text-on-surface mb-1">
                  Tags <span className="text-on-surface-variant font-normal">(phân cách bằng dấu phẩy)</span>
                </label>
                <input
                  type="text"
                  value={Array.isArray(form.tags) ? form.tags.join(', ') : ''}
                  onChange={(e) => updateForm('tags', e.target.value.split(',').map((t) => t.trim()).filter(Boolean))}
                  placeholder="Ví dụ: san hô, bảo tồn, đại dương"
                  className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-label-sm text-on-surface mb-1">Mô tả ngắn</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => updateForm('excerpt', e.target.value)}
                  placeholder="Tóm tắt ngắn gọn về bài viết..."
                  rows={3}
                  className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm outline-none focus:border-primary resize-vertical"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-label-sm text-on-surface mb-1">
                  Nội dung <span className="text-error">*</span>
                  <span className="text-on-surface-variant font-normal ml-2">(HTML)</span>
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => updateForm('content', e.target.value)}
                  placeholder="<p>Nhập nội dung bài viết dạng HTML...</p>"
                  rows={14}
                  className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm font-mono outline-none focus:border-primary resize-vertical"
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-label-sm text-on-surface mb-1">Ảnh đại diện (URL)</label>
                <input
                  type="url"
                  value={form.featuredImage || ''}
                  onChange={(e) => updateForm('featuredImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-lg border border-outline-variant px-4 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim() || !form.content.trim()}
                className="bg-primary text-on-primary px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>Đang lưu...</>
                ) : (
                  <>{editingId ? 'Cập nhật' : 'Tạo bài viết'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
