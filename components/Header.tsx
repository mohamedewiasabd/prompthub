'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Search, Bot, Lock, Menu, X, BookOpen, Layers, Command, Brain, Scale, GraduationCap, Wrench, Bookmark, TrendingUp, HelpCircle, Newspaper, Download, FileSearch, Globe, ChevronLeft, ChevronDown, MoreHorizontal } from 'lucide-react';
import { AccountMenu } from '@/components/AccountMenu';
import { Category } from '@/types';
import { useI18n } from '@/lib/i18n';

interface HeaderProps {
  categories?: Category[];
  onSearchFocus?: () => void;
}

const DRAWER_LINKS = [
  { href: '/', key: 'nav.home', icon: BookOpen },
  { href: '/shortcuts', key: 'nav.shortcuts', icon: Command },
  { href: '/models', key: 'nav.models', icon: Brain },
  { href: '/compare', key: 'nav.compare', icon: Scale },
  { href: '/learn', key: 'nav.learn', icon: GraduationCap },
  { href: '/skills', key: 'nav.skills', icon: Wrench },
  { href: '/trending', key: 'nav.trending', icon: TrendingUp },
  { href: '/blog', key: 'nav.blog', icon: Newspaper },
  { href: '/resources', key: 'nav.resources', icon: Download },
  { href: '/case-studies', key: 'nav.cases', icon: FileSearch },
  { href: '/my', key: 'nav.myLibrary', icon: Bookmark },
  { href: '/help', key: 'nav.help', icon: HelpCircle }
];

// Inline links shown directly on lg screens (kept short to avoid wrapping/overlap)
const INLINE_LINKS = [
  { href: '/', key: 'nav.home', icon: BookOpen },
  { href: '/shortcuts', key: 'nav.shortcuts', icon: Command },
  { href: '/models', key: 'nav.models', icon: Brain },
  { href: '/compare', key: 'nav.compare', icon: Scale }
];

// Secondary links grouped inside the "More" dropdown (prevents header overflow on desktop)
const MORE_LINKS = [
  { href: '/learn', key: 'nav.learn', icon: GraduationCap },
  { href: '/skills', key: 'nav.skills', icon: Wrench },
  { href: '/trending', key: 'nav.trending', icon: TrendingUp },
  { href: '/blog', key: 'nav.blog', icon: Newspaper },
  { href: '/resources', key: 'nav.resources', icon: Download },
  { href: '/case-studies', key: 'nav.cases', icon: FileSearch },
  { href: '/my', key: 'nav.myLibrary', icon: Bookmark },
  { href: '/help', key: 'nav.help', icon: HelpCircle }
];

export function Header({ categories = [], onSearchFocus }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    return () => document.body.classList.remove('menu-open');
  }, [mobileMenuOpen]);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setMobileSearch('');
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = mobileSearch.trim();
    closeMenu();
    if (q) {
      router.push(`/?q=${encodeURIComponent(q)}`);
    }
  };

  const handleMobileSearchClick = () => {
    if (onSearchFocus) {
      onSearchFocus();
    } else {
      router.push('/');
    }
  };

  return (
    <>
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base sm:text-xl text-slate-900 tracking-tight truncate">
                    {locale === 'ar' ? 'برومبتاتي' : 'PromptHub'}
                  </span>
                  <span className="hidden md:inline text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {locale === 'ar' ? 'مجاني 100%' : '100% Free'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 hidden lg:block">
                  {locale === 'ar' ? 'بنك أوامر وهندسة الذكاء الاصطناعي' : 'AI Prompt Engineering Library'}
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation (compact + More dropdown on desktop to prevent overlap) */}
          <nav className="hidden lg:flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-slate-600">
            {INLINE_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                <item.icon className="w-4 h-4 text-slate-400" />
                <span>{t(item.key)}</span>
              </Link>
            ))}

            <div className="relative group">
              <button className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-2 cursor-pointer">
                <Layers className="w-4 h-4 text-slate-400" />
                <span>{locale === 'ar' ? 'الأقسام' : 'Categories'}</span>
              </button>
              
              <div className="absolute top-full right-0 w-64 p-2 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <div className="text-xs font-semibold text-slate-400 px-3 py-1.5 mb-1 border-b border-slate-100">
                  {locale === 'ar' ? 'جميع التصنيفات' : 'All Categories'}
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors"
                    >
                      <span className="truncate">{cat.name}</span>
                      {cat.promptCount !== undefined && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                          {cat.promptCount}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* More dropdown */}
            <div className="relative group">
              <button className="hover:text-blue-600 transition-colors flex items-center gap-1.5 py-2 cursor-pointer">
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
                <span>{locale === 'ar' ? 'المزيد' : 'More'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <div className="absolute top-full right-0 w-60 p-2 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <div className="space-y-1">
                  {MORE_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-slate-400" />
                      <span>{t(item.key)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/llms.txt"
              target="_blank"
              className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 hover:bg-blue-100/60 transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span>{locale === 'ar' ? 'للروبوتات (llms.txt)' : 'LLMs.txt'}</span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={handleMobileSearchClick}
              className="sm:hidden p-2.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-blue-600 transition-colors"
              title={locale === 'ar' ? 'بحث' : 'Search'}
              aria-label="search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
              className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              title={locale === 'ar' ? t('locale.switchToEn') : t('locale.switchToAr')}
            >
              <Globe className="w-4 h-4" />
            </button>
            <AccountMenu />
            {onSearchFocus && (
              <button
                onClick={onSearchFocus}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all text-xs"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden xl:inline">{locale === 'ar' ? 'بحث سريع...' : 'Quick search...'}</span>
                <kbd className="px-1.5 py-0.5 bg-white text-[10px] rounded border border-slate-200 text-slate-500 font-mono shadow-2xs">
                  /
                </kbd>
              </button>
            )}

            <Link
              href="/secret-admin-portal"
              className="hidden sm:flex p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title={locale === 'ar' ? 'بوابة الإدارة (محمية)' : 'Admin Portal'}
            >
              <Lock className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Slide-In Drawer Menu — OUTSIDE the <header> so position:fixed targets the viewport (backdrop-filter on header creates a containing block and collapses fixed children) */}
    {mobileMenuOpen && (
      <div className="lg:hidden">
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
          onClick={closeMenu}
        />
        <div className="fixed inset-y-0 right-0 top-0 z-50 w-[84%] max-w-sm bg-white shadow-2xl flex flex-col animate-slideInRight">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900">{locale === 'ar' ? 'برومبتاتي' : 'PromptHub'}</span>
            </div>
            <button
              onClick={closeMenu}
              className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              aria-label="close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="px-4 pt-3 pb-3 border-b border-slate-100 shrink-0">
            <form onSubmit={handleMobileSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="search"
                  value={mobileSearch}
                  onChange={(e) => setMobileSearch(e.target.value)}
                  placeholder={locale === 'ar' ? 'ابحث عن برومبت...' : 'Search prompts...'}
                  className="w-full pr-10 pl-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[16px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-3 space-y-0.5">
            {DRAWER_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center justify-between px-3 py-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors pressable"
              >
                <span className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-slate-400" />
                  <span>{t(item.key)}</span>
                </span>
                <ChevronLeft className="w-4 h-4 text-slate-300" />
              </Link>
            ))}
          </div>

          {categories.length > 0 && (
            <div className="px-3 pb-4 border-t border-slate-100 shrink-0">
              <div className="px-3 pt-3 pb-2 text-xs font-bold text-slate-400">
                {locale === 'ar' ? 'الأقسام المتاحة:' : 'Categories:'}
              </div>
              <div className="grid grid-cols-1 gap-0.5 max-h-56 overflow-y-auto overscroll-contain">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={closeMenu}
                    className="flex items-center justify-between px-3 py-2 text-xs text-slate-700 rounded-lg hover:bg-slate-50 hover:text-blue-600 pressable"
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">
                      {cat.promptCount || 0}
                    </span>
                  </Link>
                ))}
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between px-1">
                <Link href="/llms.txt" target="_blank" className="text-xs text-blue-600 flex items-center gap-1 font-medium">
                  <Bot className="w-3.5 h-3.5" />
                  <span>{locale === 'ar' ? 'ملف LLMs.txt للذكاء الاصطناعي' : 'LLMs.txt for AI'}</span>
                </Link>
                <Link href="/secret-admin-portal" onClick={closeMenu} className="text-xs text-slate-500 flex items-center gap-1 hover:text-slate-800">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{locale === 'ar' ? 'لوحة تحكم المشرف' : 'Admin Panel'}</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
}