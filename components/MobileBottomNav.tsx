'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Command, Brain, Bookmark, HelpCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const NAV_ITEMS = [
  { href: '/', key: 'nav.home', icon: Home, match: (p: string) => p === '/' },
  { href: '/shortcuts', key: 'mobile.navShortcuts', icon: Command, match: (p: string) => p.startsWith('/shortcuts') },
  { href: '/models', key: 'mobile.navModels', icon: Brain, match: (p: string) => p.startsWith('/models') },
  { href: '/my', key: 'mobile.navMy', icon: Bookmark, match: (p: string) => p.startsWith('/my') },
  { href: '/help', key: 'mobile.navHelp', icon: HelpCircle, match: (p: string) => p.startsWith('/help') }
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();
  const hidden = pathname.startsWith('/secret-admin-portal');

  useEffect(() => {
    if (hidden) return;
    document.documentElement.classList.add('has-mobile-nav');
    return () => {
      document.documentElement.classList.remove('has-mobile-nav');
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <nav
      className="lg:hidden sticky bottom-0 z-50 w-full border-t border-slate-200 bg-white/95 backdrop-blur-md safe-bottom shadow-[0_-4px_24px_-12px_rgba(15,23,42,0.15)]"
      aria-label="Main navigation"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`pressable flex flex-col items-center justify-center gap-1 py-2.5 min-h-14 transition-colors cursor-pointer ${
                active
                  ? 'text-blue-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <item.icon className={`w-6 h-6 ${active ? 'stroke-[2.2]' : ''}`} />
              <span className={`text-[10px] leading-none ${active ? 'font-bold' : 'font-medium'}`}>
                {t(item.key)}
              </span>
              <span
                className={`h-1 w-6 rounded-full transition-all ${
                  active ? 'bg-blue-600' : 'bg-transparent'
                }`}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}