import { getCurrentUser } from '@/lib/auth';

/**
 * Admin API guard — throws if user is not admin.
 * Returns the authenticated user payload on success.
 */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  if (user.role !== 'admin') {
    throw new Error('FORBIDDEN');
  }
  return user;
}
