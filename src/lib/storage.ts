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
// INTERFACE
// ============================================================

export interface StorageProvider {
  /** Upload a file buffer, returns the public URL */
  upload(file: Buffer, key: string, contentType: string): Promise<string>;
  /** Delete a file by its key (relative path) */
  delete(key: string): Promise<void>;
  /** Get the public URL for a given key */
  getPublicUrl(key: string): string;
}

// ============================================================
// LOCAL FILESYSTEM PROVIDER
// ============================================================

function createLocalStorageProvider(baseDir?: string): StorageProvider {
  const publicDir = baseDir || join(process.cwd(), 'public');

  return {
    async upload(file, key, _contentType) {
      const fullPath = join(publicDir, key);
      await mkdir(dirname(fullPath), { recursive: true });
      await writeFile(fullPath, file);
      return `/${key}`;
    },

    async delete(key) {
      const fullPath = join(publicDir, key);
      try {
        await unlink(fullPath);
      } catch {
        // File may already be deleted — ignore
      }
    },

    getPublicUrl(key) {
      return `/${key}`;
    },
  };
}

// ============================================================
// SINGLETON
// ============================================================

const provider = process.env.STORAGE_PROVIDER || 'local';

export const storage: StorageProvider =
  provider === 'local'
    ? createLocalStorageProvider()
    : createLocalStorageProvider(); // Default to local; swap for S3 later

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
