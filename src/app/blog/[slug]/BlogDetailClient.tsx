'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { sanitizeBlogHtml } from '@/lib/security';

interface PostData {
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  readingTime: number;
  publishedAt: string;
  author: { fullName: string };
}

/** SRS B-02: exact category labels */
const categoryLabels: Record<string, string> = {
  ecology: 'Sinh thái san hô', conservation: 'Bảo tồn', green_economy: 'Kinh tế xanh', adopter_stories: 'Chuyến lặn của adopter',
};

/**
 * Sanitize raw HTML content with DOMPurify, then inject heading IDs
 * for anchor navigation (TOC links). Preserves existing IDs when present.
 */
function prepareContent(rawHtml: string): string {
  // 1. Sanitize against XSS
  const clean = sanitizeBlogHtml(rawHtml);

  // 2. Inject id attributes on h2/h3 for TOC anchor navigation
  return clean.replace(
    /<h([2-3])(\s[^>]*)?>(.*?)<\/h\1>/gi,
    (match, level, attrs, text) => {
      // Skip if the heading already has an id
      if (attrs && /\bid\s*=/i.test(attrs)) return match;

      // Generate id from plain text content
      const plainText = text.replace(/<[^>]*>/g, '');
      const id = plainText
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // strip Vietnamese diacritics
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const attrsStr = attrs || '';
      return `<h${level}${attrsStr} id="${id}">${text}</h${level}>`;
    }
  );
}

/** Extract headings from HTML content for TOC */
function extractHeadings(html: string): Array<{ id: string; text: string; level: number }> {
  const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/gi;
  const headings: Array<{ id: string; text: string; level: number }> = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, '');
    const id = text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    headings.push({ id, text, level: parseInt(match[1]) });
  }
  return headings;
}

export function BlogDetailClient({ post, slug }: { post: PostData; slug: string }) {
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeId, setActiveId] = useState('');

  // Sanitize + inject heading IDs once (memoized)
  const sanitizedContent = useMemo(() => prepareContent(post.content), [post.content]);

  // Extract headings from sanitized content for TOC
  const headings = useMemo(() => extractHeadings(sanitizedContent), [sanitizedContent]);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollPercent(height > 0 ? Math.round((winScroll / height) * 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Structured article data
  const articleJson = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage || undefined,
    author: { '@type': 'Person', name: post.author.fullName },
    datePublished: post.publishedAt,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://coralume.vn' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://coralume.vn/blog' },
          { '@type': 'ListItem', position: 3, name: post.title, item: `https://coralume.vn/blog/${slug}` },
        ],
      })}} />

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-0.5 z-50 bg-outline-variant">
        <div
          className="h-full bg-secondary transition-all duration-100"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      <main className="flex-1 bg-surface pt-24 pb-16">
        <article className="max-w-[720px] mx-auto px-[var(--spacing-margin-mobile)]">
          {/* Back link */}
          <Link href="/blog" className="text-sm text-on-tertiary-container hover:text-primary transition-colors mb-6 inline-block">
            ← Quay lại Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-secondary/10 text-secondary font-label-sm text-xs px-2 py-0.5 rounded-full">
                {categoryLabels[post.category] || post.category}
              </span>
              <span className="text-xs text-on-surface-variant">{post.readingTime} phút đọc</span>
              <span className="text-xs text-on-surface-variant">
                {new Date(post.publishedAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>

            <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="font-body-lg text-on-surface-variant">{post.excerpt}</p>

            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-outline-variant/50">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                <span className="text-on-primary-container font-bold text-sm">
                  {post.author.fullName.split(' ').map((w) => w[0]).join('')}
                </span>
              </div>
              <div>
                <span className="block text-sm font-medium text-on-surface">{post.author.fullName}</span>
                <span className="text-xs text-on-surface-variant">Tác giả</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="rounded-xl overflow-hidden mb-8">
              <img src={post.featuredImage} alt={post.title} className="w-full object-cover" />
            </div>
          )}

          {/* Layout: TOC sidebar + Content */}
          <div className="lg:flex lg:gap-10">
            {/* Content — sanitized HTML with injected heading IDs */}
            <div className="flex-1 min-w-0 prose max-w-none">
              <div
                className="font-body-lg text-on-surface leading-[1.7] space-y-4"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </div>

            {/* TOC Sidebar — sticky on desktop */}
            {headings.length > 0 && (
              <aside className="hidden lg:block w-56 flex-shrink-0">
                <div className="sticky top-24">
                  <h3 className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant mb-3">
                    Mục lục
                  </h3>
                  <nav className="space-y-1">
                    {headings.map((h) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                          setActiveId(h.id);
                        }}
                        className={`block text-sm py-1 border-l-2 pl-3 transition-colors ${
                          activeId === h.id
                            ? 'border-secondary text-secondary font-medium'
                            : h.level === 2
                              ? 'border-outline-variant text-on-surface-variant hover:text-primary pl-3'
                              : 'border-outline-variant text-on-surface-variant hover:text-primary pl-6'
                        }`}
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-outline-variant/50">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-surface-container-lowest border border-outline-variant text-on-surface-variant text-xs px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>
    </>
  );
}
