/**
 * Admin path configuration.
 *
 * SRS §4.10: "/admin (không liên kết public). Có thể đặt URL phức tạp hơn để tăng bảo mật."
 *
 * Set NEXT_PUBLIC_ADMIN_PATH in .env to use a custom admin URL.
 * Default: /admin
 * Example: NEXT_PUBLIC_ADMIN_PATH=/quan-ly-he-thong-2026
 */
export const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || '/admin';

/** Check if a pathname matches the admin prefix */
export function isAdminPath(pathname: string): boolean {
  return pathname.startsWith(ADMIN_PATH);
}
