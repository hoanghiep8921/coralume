'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/san-pham', label: 'Adopt' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/ve-chung-toi', label: 'Nha Trang' },
  { href: '/cong-dong', label: 'Community' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-shadow duration-normal ${
        isScrolled ? 'shadow-lg' : ''
      } glass-nav bg-surface/80`}
    >
      <div className="flex justify-between items-center w-full px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] py-4 max-w-[var(--spacing-container-max)] mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="font-headline-md text-headline-md font-bold tracking-tight text-primary"
        >
          Coralume
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors duration-fast font-body-md text-body-md ${
                i === 0
                  ? 'text-primary border-b-2 border-secondary font-medium'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/san-pham"
          className="hidden md:inline-block bg-secondary text-on-secondary px-6 py-2.5 rounded-full font-medium hover:scale-95 transition-transform duration-fast"
        >
          Adopt Your Coral
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-primary p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-nav bg-surface/95 border-t border-outline-variant">
          <div className="px-[var(--spacing-margin-mobile)] py-4 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 text-on-surface hover:text-primary transition-colors duration-fast font-body-md"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/san-pham"
              className="block text-center bg-secondary text-on-secondary px-6 py-3 rounded-full font-medium hover:scale-95 transition-transform duration-fast"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Adopt Your Coral
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
