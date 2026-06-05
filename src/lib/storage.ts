import { writeFile, unlink, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { randomUUID } from 'crypto';

// ============================================================
// CONSTANTS
// ============================================================

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
export const ALLOWED_MIME_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_IMAGE_COUNT = 5;

// ============================================================
// STORAGE PROVIDER
// ============================================================
// Free CDN: Next.js `public/` directory + next/image optimization.
// When deployed to Vercel, static files are auto-distributed
// via global CDN with optimal cache headers.
// For user uploads at scale, swap this with Cloudinary free tier
// (25 GB storage, built-in CDN, auto-optimization).

const publicDir = join(process.cwd(), 'public');

export const storage = {
  async upload(file: Buffer, key: string, _contentType: string): Promise<string> {
    const fullPath = join(publicDir, key);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, file);
    return `/${key}`;
  },

  async delete(key: string): Promise<void> {
    const fullPath = join(publicDir, key);
    try { await unlink(fullPath); } catch { /* already gone */ }
  },

  getPublicUrl(key: string): string {
    return `/${key}`;
  },
};

// ============================================================
// HELPERS
// ============================================================

export function generateKey(type: string, extension: string): string {
  const uuid = randomUUID();
  return `uploads/${type}/${uuid}.${extension}`;
}

export function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
  };
  return map[mimeType] || 'bin';
}

export function validateFile(file: { type: string; size: number }): string | null {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return `Định dạng không hỗ trợ: ${file.type}. Hỗ trợ: JPEG, PNG, WebP, MP4, WebM`;
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;

  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    return `File quá lớn (tối đa ${maxMB}MB)`;
  }

  return null;
}
