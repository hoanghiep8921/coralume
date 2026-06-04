'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  role?: string;
}

export function AdminSidebar({ role }: AdminSidebarProps) {
  const pathname = usePathname();
  const isAdmin = role === 'admin';

  const links = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard', adminOnly: false },
    { href: '/admin/blog', label: 'Bài viết', icon: 'article', adminOnly: false },
    { href: '/admin/users', label: 'Người dùng', icon: 'group', adminOnly: true },
    { href: '/admin/staff', label: 'Nhân viên', icon: 'badge', adminOnly: true },
    { href: '/admin/corals', label: 'San hô', icon: 'water_drop', adminOnly: true },
    { href: '/admin/products', label: 'Sản phẩm', icon: 'inventory_2', adminOnly: true },
    { href: '/admin/settings', label: 'Cài đặt', icon: 'settings', adminOnly: true },
    { href: '/admin/activity', label: 'Hoạt động', icon: 'history', adminOnly: true },
  ];

  const visibleLinks = links.filter((l) => !l.adminOnly || isAdmin);

  return (
    <aside
      id="admin-sidebar"
      className="w-64 min-h-screen bg-primary flex-shrink-0 hidden lg:block"
    >
      <div className="p-6">
        <Link href="/admin" className="font-display text-xl font-bold text-on-primary">
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
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
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
