/**
 * @fileoverview Header Component
 * 
 * Main navigation header for public pages.
 * Mobile: hamburger on left, title centered
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COMPANY_INFO } from '@/lib/constants';

const navigation = [
  { name: '首頁', href: '/' },
  { name: '服務項目', href: '/services' },
  { name: '關於我們', href: '/about' },
  { name: '活動花絮', href: '/events' },
  { name: '運動專欄', href: '/articles' },
  { name: '聯絡我們', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile: hamburger on left */}
          <button
            type="button"
            className="md:hidden p-2 -ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-brand-brown" />
            ) : (
              <Menu className="h-6 w-6 text-brand-brown" />
            )}
          </button>

          {/* Mobile: centered title */}
          <Link
            href="/"
            className="md:hidden flex items-center space-x-2 absolute left-1/2 -translate-x-1/2"
          >
            <Image
              src="/images/logo.png"
              alt={COMPANY_INFO.name}
              width={54}
              height={54}
              className="w-9 h-9"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-brand-brown">
                {COMPANY_INFO.name}
              </span>
              <span className="text-[10px] text-brand-brown/70">
                {COMPANY_INFO.nameEn}
              </span>
            </div>
          </Link>

          {/* Desktop: Logo + Title on left */}
          <Link href="/" className="hidden md:flex items-center space-x-3">
            <Image
              src="/images/logo.png"
              alt={COMPANY_INFO.name}
              width={54}
              height={54}
              className="w-11 h-11"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-bold text-brand-brown">
                {COMPANY_INFO.name}
              </span>
              <span className="text-xs text-brand-brown/70">
                {COMPANY_INFO.nameEn}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-brand-yellow',
                  pathname === item.href
                    ? 'text-brand-yellow'
                    : 'text-brand-brown'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Spacer for mobile to balance hamburger */}
          <div className="md:hidden w-10" />
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-base font-medium transition-colors',
                    pathname === item.href
                      ? 'text-brand-yellow'
                      : 'text-brand-brown'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
