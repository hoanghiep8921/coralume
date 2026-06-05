import { describe, it, expect } from 'vitest';
import { blogPostSchema } from '@/lib/validation';

// ============================================================
// BLOG VALIDATION SCHEMA
// ============================================================

describe('blogPostSchema', () => {
  const validPost = {
    title: 'Bảo tồn san hô tại vịnh Nha Trang - Hành trình 2024',
    slug: 'bao-ton-san-ho-nha-trang-2024',
    content: 'Nội dung chi tiết về hành trình bảo tồn san hô tại vịnh Nha Trang, bao gồm các hoạt động trồng san hô, giám sát và đánh giá tác động môi trường.',
    category: 'conservation' as const,
  };

  // SRS 1.1: Title — post title validation
  it('should accept valid blog post', () => {
    const result = blogPostSchema.safeParse(validPost);
    expect(result.success).toBe(true);
  });

  it('should reject title < 10 chars', () => {
    const result = blogPostSchema.safeParse({ ...validPost, title: 'Short' });
    expect(result.success).toBe(false);
  });

  it('should reject title > 500 chars', () => {
    const result = blogPostSchema.safeParse({ ...validPost, title: 'x'.repeat(501) });
    expect(result.success).toBe(false);
  });

  it('should accept title at exactly 10 chars', () => {
    const result = blogPostSchema.safeParse({ ...validPost, title: '1234567890' });
    expect(result.success).toBe(true);
  });

  // SRS 1.2: Categories
  it('should accept "ecology" (Sinh thái san hô)', () => {
    const result = blogPostSchema.safeParse({ ...validPost, category: 'ecology' });
    expect(result.success).toBe(true);
  });

  it('should accept "conservation" (Bảo tồn)', () => {
    const result = blogPostSchema.safeParse({ ...validPost, category: 'conservation' });
    expect(result.success).toBe(true);
  });

  it('should accept "green_economy" (Kinh tế xanh)', () => {
    const result = blogPostSchema.safeParse({ ...validPost, category: 'green_economy' });
    expect(result.success).toBe(true);
  });

  it('should accept "adopter_stories" (Chuyến lặn của adopter)', () => {
    const result = blogPostSchema.safeParse({ ...validPost, category: 'adopter_stories' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid category', () => {
    const result = blogPostSchema.safeParse({ ...validPost, category: 'invalid' });
    expect(result.success).toBe(false);
  });

  // SRS 1.3: Content and slug
  it('should reject content < 100 chars', () => {
    const result = blogPostSchema.safeParse({ ...validPost, content: 'Too short' });
    expect(result.success).toBe(false);
  });

  it('should reject invalid slug (uppercase)', () => {
    const result = blogPostSchema.safeParse({ ...validPost, slug: 'Invalid-Slug' });
    expect(result.success).toBe(false);
  });

  it('should accept Vietnamese slug with hyphens', () => {
    const result = blogPostSchema.safeParse({ ...validPost, slug: 'bao-ton-2024-nha-trang' });
    expect(result.success).toBe(true);
  });

  // Optional fields
  it('should accept optional excerpt', () => {
    const result = blogPostSchema.safeParse({ ...validPost, excerpt: 'Tóm tắt ngắn gọn' });
    expect(result.success).toBe(true);
  });

  it('should reject excerpt > 500 chars', () => {
    const result = blogPostSchema.safeParse({ ...validPost, excerpt: 'x'.repeat(501) });
    expect(result.success).toBe(false);
  });

  it('should accept optional featuredImage URL', () => {
    const result = blogPostSchema.safeParse({ ...validPost, featuredImage: 'https://example.com/ocean.jpg' });
    expect(result.success).toBe(true);
  });

  it('should reject invalid featuredImage URL', () => {
    const result = blogPostSchema.safeParse({ ...validPost, featuredImage: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('should accept tags array', () => {
    const result = blogPostSchema.safeParse({
      ...validPost,
      tags: ['san-ho', 'nha-trang', 'bao-ton'],
    });
    expect(result.success).toBe(true);
  });

  it('should reject more than 10 tags', () => {
    const result = blogPostSchema.safeParse({
      ...validPost,
      tags: Array(11).fill('tag'),
    });
    expect(result.success).toBe(false);
  });

  it('should accept readingTime 1-60 min', () => {
    const result = blogPostSchema.safeParse({ ...validPost, readingTime: 5 });
    expect(result.success).toBe(true);
  });

  it('should reject readingTime < 1', () => {
    const result = blogPostSchema.safeParse({ ...validPost, readingTime: 0 });
    expect(result.success).toBe(false);
  });

  it('should accept draft status', () => {
    const result = blogPostSchema.safeParse({ ...validPost, status: 'draft' });
    expect(result.success).toBe(true);
  });

  it('should accept published status', () => {
    const result = blogPostSchema.safeParse({ ...validPost, status: 'published' });
    expect(result.success).toBe(true);
  });
});

// ============================================================
// BLOG CATEGORY LABELS
// ============================================================

describe('Blog category labels (SRS B-02)', () => {
  const SRS_LABELS: Record<string, string> = {
    ecology: 'Sinh thái san hô',
    conservation: 'Bảo tồn',
    green_economy: 'Kinh tế xanh',
    adopter_stories: 'Chuyến lặn của adopter',
  };

  it('should have all 4 SRS categories', () => {
    expect(Object.keys(SRS_LABELS)).toHaveLength(4);
  });

  it('ecology = "Sinh thái san hô" (not "Sinh thái")', () => {
    expect(SRS_LABELS.ecology).toBe('Sinh thái san hô');
    expect(SRS_LABELS.ecology).not.toBe('Sinh thái');
  });

  it('adopter_stories = "Chuyến lặn của adopter" (not "Câu chuyện")', () => {
    expect(SRS_LABELS.adopter_stories).toBe('Chuyến lặn của adopter');
    expect(SRS_LABELS.adopter_stories).not.toBe('Câu chuyện');
  });

  it('conservation = "Bảo tồn"', () => {
    expect(SRS_LABELS.conservation).toBe('Bảo tồn');
  });

  it('green_economy = "Kinh tế xanh"', () => {
    expect(SRS_LABELS.green_economy).toBe('Kinh tế xanh');
  });
});
