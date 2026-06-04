'use client';

import Link from 'next/link';

interface AdminHeaderProps {
  adminName?: string;
}

export function AdminHeader({ adminName }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between px-6 lg:px-8 flex-shrink-0">
      {/* Mobile menu toggle */}
      <button
        type="button"
        className="lg:hidden text-on-surface"
        onClick={() => {
          const sidebar = document.getElementById('admin-sidebar');
          sidebar?.classList.toggle('hidden');
        }}
        aria-label="Toggle menu"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>

      <div className="flex-1 lg:flex-none" />

      <div className="flex items-center gap-4">
        <span className="text-sm text-on-surface-variant hidden sm:block">
          {adminName || 'Admin'}
        </span>
        <Link
          href="/"
          className="text-sm text-on-tertiary-container hover:text-primary transition-colors"
        >
          Về trang chính →
        </Link>
      </div>
    </header>
  );
}
