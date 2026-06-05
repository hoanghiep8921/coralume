'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  role?: string;
}

/**
 * Admin base path — uses env var if configured, falls back to /admin.
 * The rewrite rule in next.config.ts maps this custom path internally to /admin.
 *
 * Set NEXT_PUBLIC_ADMIN_PATH in .env to use a custom admin URL (SRS §4.10).
 * Example: NEXT_PUBLIC_ADMIN_PATH=/quan-ly-he-thong-2026
 */
const ADMIN_BASE = process.env.NEXT_PUBLIC_ADMIN_PATH || '/admin';

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();
  const isAdmin = role === 'admin';

  /**
   * Check if a link is active. Normalizes both the env-based path
   * and the internal /admin path so highlighting works regardless
   * of whether ADMIN_BASE is customized.
   */
  function isLinkActive(href: string): boolean {
    if (pathname === href) return true;
    // Also check the internal /admin equivalent of the path
    const internalPath = href.replace(ADMIN_BASE, '/admin');
    if (pathname === internalPath) return true;
    if (href !== ADMIN_BASE && pathname.startsWith(href)) return true;
    if (internalPath !== '/admin' && pathname.startsWith(internalPath)) return true;
    return false;
  }

  const links = [
    { href: `${ADMIN_BASE}`, label: 'Dashboard', icon: 'dashboard', adminOnly: false },
    { href: `${ADMIN_BASE}/blog`, label: 'Bài viết', icon: 'article', adminOnly: false },
    { href: `${ADMIN_BASE}/users`, label: 'Người dùng', icon: 'group', adminOnly: true },
    { href: `${ADMIN_BASE}/staff`, label: 'Nhân viên', icon: 'badge', adminOnly: true },
    { href: `${ADMIN_BASE}/corals`, label: 'San hô', icon: 'water_drop', adminOnly: true },
    { href: `${ADMIN_BASE}/products`, label: 'Sản phẩm', icon: 'inventory_2', adminOnly: true },
    { href: `${ADMIN_BASE}/settings`, label: 'Cài đặt', icon: 'settings', adminOnly: true },
    { href: `${ADMIN_BASE}/activity`, label: 'Hoạt động', icon: 'history', adminOnly: true },
    { href: `${ADMIN_BASE}/analytics`, label: 'Thống kê', icon: 'monitoring', adminOnly: true },
    { href: `${ADMIN_BASE}/email`, label: 'Gửi email', icon: 'mail', adminOnly: true },
  ];

  const visibleLinks = links.filter((l) => !l.adminOnly || isAdmin);

  return (
    <aside
      id="admin-sidebar"
      className="w-64 min-h-screen bg-primary flex-shrink-0 hidden lg:block"
    >
      <div className="p-6">
        <Link href={ADMIN_BASE} className="font-display text-xl font-bold text-on-primary">
          Coralume Admin
        </Link>
        {role && (
          <p className="text-on-primary/60 text-xs mt-1 font-label-sm capitalize">
            {role === 'admin' ? 'Super Admin' : role === 'editor' ? 'Editor' : role}
          </p>
        )}
      </div>
      <nav className="px-3 space-y-1">
        {visibleLinks.map((link) => {
          const isActive = isLinkActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => {
                // Close mobile sidebar on navigation
                const sidebar = document.getElementById('admin-sidebar');
                if (sidebar && window.innerWidth < 1024) {
                  sidebar.classList.add('hidden');
                }
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body-md transition-colors duration-fast ${
                isActive
                  ? 'bg-on-primary/15 text-on-primary font-medium'
                  : 'text-on-primary/70 hover:text-on-primary hover:bg-on-primary/10'
              }`}
            >
              <span className="material-symbols-outlined text-xl" aria-hidden="true">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
