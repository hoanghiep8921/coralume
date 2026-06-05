'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

/** SRS B-01/B-02: Category labels exactly per spec */
const CATEGORIES = [
  { value: '', label: 'Tất cả', icon: 'layers' },
  { value: 'ecology', label: 'Sinh thái san hô', icon: 'water_drop' },
  { value: 'conservation', label: 'Bảo tồn', icon: 'eco' },
  { value: 'green_economy', label: 'Kinh tế xanh', icon: 'analytics' },
  { value: 'adopter_stories', label: 'Chuyến lặn của adopter', icon: 'groups' },
];

const CATEGORY_COLORS: Record<string, string> = {
  conservation: 'bg-green-100 text-green-700',
  ecology: 'bg-blue-100 text-blue-700',
  green_economy: 'bg-amber-100 text-amber-700',
  adopter_stories: 'bg-secondary/10 text-secondary',
};

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  readingTime: number;
  publishedAt: string;
  author: { fullName: string };
}

export function BlogClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get('category') || '';
  const initialPage = parseInt(searchParams.get('page') || '1');

  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<{ posts: Post[]; total: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  // SRS B-01: Fade-in animation trigger
  useEffect(() => {
    setHeroVisible(true);
  }, []);

  // SRS B-02: AJAX reload on category/page change
  const fetchPosts = useCallback(async (cat: string, p: number) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (cat) query.set('category', cat);
      query.set('page', String(p));
      query.set('limit', '12');
      const res = await fetch(`/api/v1/blog?${query}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch {
      // keep current data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(category, page);
  }, [category, page, fetchPosts]);

  // Update URL without full navigation (AJAX behavior per SRS B-02)
  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    router.replace(`/blog${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [category, page, router]);

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setPage(1); // reset to page 1 on category change
  };

  const getCategoryLabel = (cat: string) =>
    CATEGORIES.find((c) => c.value === cat)?.label || cat;

  return (
    <main className="flex-1 bg-surface">
      {/* ================================================================
          SRS 1.1: Hero Blog — "Kiến thức về san hô & đại dương"
          Ocean wide image background + fade-in animation
          ================================================================ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Ocean background gradient (image placeholder until CLB provides) */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/10 to-surface"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 Q 40 0 50 5 T 60 5' fill='none' stroke='rgba(15,76,92,0.06)' stroke-width='2'/%3E%3Cpath d='M0 15 Q 10 10 20 15 T 40 15 T 60 15' fill='none' stroke='rgba(15,76,92,0.06)' stroke-width='2'/%3E%3C/svg%3E")`,
          }}
        />

        <div
          className={`relative z-10 text-center px-[var(--spacing-margin-mobile)] max-w-4xl mx-auto transition-all duration-slow ${
            heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[30px]'
          }`}
        >
          <span className="text-secondary font-label-sm uppercase tracking-widest mb-2 block">
            Blog
          </span>
          {/* SRS B-01: exact headline */}
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">
            Kiến thức về san hô &amp; đại dương
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Khám phá hành trình bảo tồn san hô, câu chuyện từ cộng đồng và kiến thức khoa học biển.
          </p>
        </div>
      </section>

      <div className="px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] pb-16">
        <div className="max-w-[var(--spacing-container-max)] mx-auto">
          {/* ================================================================
              SRS 1.2: Category Filter — AJAX reload
              ================================================================ */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-label-sm transition-colors ${
                  category === cat.value
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:border-primary'
                }`}
              >
                <span className="material-symbols-outlined text-lg" aria-hidden="true">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* ================================================================
              SRS 1.3: Article Grid — thumbnail, title, excerpt 2 dòng,
              date, tag, reading time, hover effect, pagination 12/trang
              ================================================================ */}
          {loading ? (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                <svg className="animate-spin w-8 h-8 text-on-tertiary-container" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <p className="text-on-surface-variant">Đang tải bài viết...</p>
            </div>
          ) : !data || data.posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/40" aria-hidden="true">article</span>
              </div>
              <p className="text-on-surface-variant text-lg">Chưa có bài viết nào trong mục này.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {data.posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-normal"
                  >
                    <div className="h-48 bg-primary-fixed-dim/20 flex items-center justify-center overflow-hidden">
                      {post.featuredImage ? (
                        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <span className="material-symbols-outlined text-5xl text-on-surface-variant/30" aria-hidden="true">article</span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-label-sm px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] || 'bg-surface-container text-on-surface-variant'}`}>
                          {getCategoryLabel(post.category)}
                        </span>
                        <span className="text-xs text-on-surface-variant">{post.readingTime} phút đọc</span>
                      </div>
                      <h2 className="font-headline-md text-headline-md text-primary mb-2 group-hover:text-secondary transition-colors line-clamp-2">{post.title}</h2>
                      <p className="text-sm text-on-surface-variant line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-on-surface-variant">
                        <span>{post.author.fullName}</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* SRS B-03: Pagination 12/trang */}
              {data.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: data.totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                        page === i + 1
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:border-primary'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
