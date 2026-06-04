'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/users', label: 'Người dùng', icon: 'group' },
  { href: '/admin/corals', label: 'San hô', icon: 'water_drop' },
  { href: '/admin/products', label: 'Sản phẩm', icon: 'inventory_2' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-primary flex-shrink-0 hidden lg:block">
      <div className="p-6">
        <Link href="/admin" className="font-display text-xl font-bold text-on-primary">
          Coralume Admin
        </Link>
      </div>
      <nav className="px-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
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
