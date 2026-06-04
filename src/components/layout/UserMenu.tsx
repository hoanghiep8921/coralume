'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  role: string;
}

export function UserMenu() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/v1/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data) setUser(json.data);
      })
      .catch(() => { /* not logged in */ })
      .finally(() => setLoading(false));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const isStaff = user?.role === 'coral_staff' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  const initials = user?.fullName
    ?.split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';

  // Loading: show nothing until we know auth state
  if (loading) return null;

  // Not logged in: show CTA button
  if (!user) {
    return (
      <Link
        href="/san-pham"
        className="hidden md:inline-block bg-secondary text-on-secondary px-6 py-2.5 rounded-full font-medium hover:scale-95 transition-transform duration-fast"
      >
        Adopt Your Coral
      </Link>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 cursor-pointer"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-bold text-sm shrink-0 overflow-hidden">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        {/* Name (desktop only) */}
        <span className="hidden md:block text-on-surface font-medium text-sm max-w-[120px] truncate">
          {user.fullName}
        </span>
        {/* Chevron */}
        <svg
          className={`hidden md:block w-4 h-4 text-on-surface-variant transition-transform duration-fast ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-surface-container-lowest rounded-lg shadow-lg border border-outline-variant overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-outline-variant">
            <div className="font-medium text-sm text-on-surface truncate">{user.fullName}</div>
            <div className="text-xs text-on-surface-variant truncate">{user.email}</div>
            <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-primary-container text-on-primary-container font-medium">
              {user.role === 'coral_staff' ? 'Coral Staff' :
               user.role === 'admin' ? 'Admin' :
               user.role === 'ambassador' ? 'Đại sứ' :
               user.role === 'editor' ? 'Editor' : 'Người giám hộ'}
            </span>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors"
              onClick={() => setOpen(false)}
            >
              <svg className="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
              </svg>
              Dashboard
            </Link>

            {isStaff && (
              <Link
                href="/coral-portal"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary font-semibold hover:bg-surface-container transition-colors"
                onClick={() => setOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Coral Portal
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors"
                onClick={() => setOpen(false)}
              >
                <svg className="w-4 h-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin Panel
              </Link>
            )}

            <div className="border-t border-outline-variant my-1" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer text-left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
