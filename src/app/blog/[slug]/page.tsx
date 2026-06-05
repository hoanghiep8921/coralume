import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogDetailClient } from './BlogDetailClient';

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

async function fetchPost(slug: string): Promise<PostData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/blog/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()).data;
  } catch { return null; }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return { title: 'Không tìm thấy' };
  return {
    title: `${post.title} — Coralume Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://coralume.vn'}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  return (
    <BlogDetailClient post={post} slug={slug} />
  );
}
