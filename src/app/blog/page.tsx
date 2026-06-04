import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Blog — Coralume',
  description: 'Tin tức, câu chuyện và kiến thức về bảo tồn san hô, đại dương và môi trường biển.',
  openGraph: {
    title: 'Coralume Blog — Bảo tồn san hô & Đại dương',
    description: 'Khám phá câu chuyện, kiến thức và cập nhật từ Coralume về bảo tồn san hô tại Nha Trang.',
    url: `${siteConfig.url}/blog`,
    type: 'website',
  },
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

const categories = [
  { value: '', label: 'Tất cả', icon: 'layers' },
  { value: 'conservation', label: 'Bảo tồn', icon: 'eco' },
  { value: 'ecology', label: 'Sinh thái', icon: 'water_drop' },
  { value: 'green_economy', label: 'Kinh tế xanh', icon: 'analytics' },
  { value: 'adopter_stories', label: 'Câu chuyện', icon: 'groups' },
];

const categoryColors: Record<string, string> = {
  conservation: 'bg-green-100 text-green-700',
  ecology: 'bg-blue-100 text-blue-700',
  green_economy: 'bg-amber-100 text-amber-700',
  adopter_stories: 'bg-secondary/10 text-secondary',
};

async function fetchPosts(category?: string, page = 1) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const query = new URLSearchParams();
    if (category) query.set('category', category);
    query.set('page', String(page));
    query.set('limit', '12');
    const res = await fetch(`${baseUrl}/api/v1/blog?${query}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()).data as { posts: Post[]; total: number; page: number; totalPages: number };
  } catch { return null; }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || '';
  const page = parseInt(params.page || '1');
  const data = await fetchPosts(category, page);

  return (
    <main className="flex-1 bg-surface pt-24 pb-16 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
      <div className="max-w-[var(--spacing-container-max)] mx-auto">
        <div className="text-center mb-12">
          <span className="text-secondary font-label-sm uppercase tracking-widest mb-2 block">Blog</span>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4">Tin tức &amp; Câu chuyện</h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Khám phá hành trình bảo tồn san hô, câu chuyện từ cộng đồng và kiến thức khoa học biển.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={`/blog${cat.value ? `?category=${cat.value}` : ''}`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-label-sm transition-colors ${
                category === cat.value
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:border-primary'
              }`}
            >
              <span className="material-symbols-outlined text-lg" aria-hidden="true">{cat.icon}</span>
              {cat.label}
            </Link>
          ))}
        </div>

        {!data || data.posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant/40" aria-hidden="true">article</span>
            </div>
            <p className="text-on-surface-variant text-lg">Chưa có bài viết nào.</p>
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
                      <span className={`text-xs font-label-sm px-2 py-0.5 rounded-full ${categoryColors[post.category] || 'bg-surface-container text-on-surface-variant'}`}>
                        {categories.find((c) => c.value === post.category)?.label || post.category}
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

            {data.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: data.totalPages }, (_, i) => (
                  <Link
                    key={i}
                    href={`/blog?${category ? `category=${category}&` : ''}page=${i + 1}`}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                      page === i + 1 ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:border-primary'
                    }`}
                  >
                    {i + 1}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
