import { getCurrentUser, canAccess } from '@/lib/auth';

/**
 * Admin API guard — throws if user is not admin or editor.
 * Allows both admin and editor roles to pass.
 * Returns the authenticated user payload on success.
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  if (!canAccess(user.role, 'editor')) {
    throw new Error('FORBIDDEN');
  }
  return user;
}

/**
 * Strict admin guard — only allows the `admin` role.
 * Use for sensitive routes: users, products, corals, dashboard.
 */
export async function requireAdminOnly() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  if (user.role !== 'admin') {
    throw new Error('FORBIDDEN');
  }
  return user;
}
