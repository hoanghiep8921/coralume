import type { Metadata } from 'next';
import { Suspense } from 'react';
import { siteConfig } from '@/config/site';
import { BlogClient } from './BlogClient';
import {
  StructuredData,
  breadcrumbSchema,
} from '@/components/layout/StructuredData';

export const metadata: Metadata = {
  title: 'Blog — Coralume',
  description: 'Kiến thức về san hô & đại dương. Khám phá bài viết về sinh thái, bảo tồn, kinh tế xanh và câu chuyện từ cộng đồng.',
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: 'Coralume Blog — Kiến thức về san hô & Đại dương',
    description: 'Khám phá câu chuyện, kiến thức và cập nhật từ Coralume về bảo tồn san hô tại Nha Trang.',
    url: `${siteConfig.url}/blog`,
    type: 'website',
  },
};

/**
 * SRS Section 4.6: Blog / Kiến thức San hô
 *
 * 1.1 Hero: "Kiến thức về san hô & đại dương" + ocean wide image + fade-in
 * 1.2 Categories: Sinh thái san hô, Bảo tồn, Kinh tế xanh, Chuyến lặn của adopter — AJAX reload
 * 1.3 Article grid: thumbnail, title, excerpt 2 dòng, date, tag, reading time, pagination 12/trang
 * 1.4 Detail: max-width 720px, font 18px, line-height 1.7, TOC sticky, scroll progress bar
 */
export default function BlogPage() {
  return (
    <>
      {/* Schema.org BreadcrumbList */}
      <StructuredData
        data={breadcrumbSchema([
          { name: 'Trang chủ', url: siteConfig.url },
          { name: 'Blog', url: `${siteConfig.url}/blog` },
        ])}
      />

      <Suspense fallback={
        <main className="flex-1 bg-surface pt-24 pb-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
              <svg className="animate-spin w-8 h-8 text-on-tertiary-container" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-on-surface-variant">Đang tải blog...</p>
          </div>
        </main>
      }>
        <BlogClient />
      </Suspense>
    </>
  );
}
