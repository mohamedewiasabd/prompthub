'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Bot, FileText, Share2, Shield, Heart, Cpu, Trophy, Newspaper, Download, FileSearch, Terminal } from 'lucide-react';
import { Category } from '@/types';
import { useI18n } from '@/lib/i18n';

interface FooterProps {
  categories?: Category[];
}

export function Footer({ categories = [] }: FooterProps) {
  const { t } = useI18n();

  return (
    <footer className="w-full border-t border-slate-200 bg-white mt-20 text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900">PromptHub</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md">
              {t('nav.home') === 'Home'
                ? 'The first Arabic open platform for browsing and discovering AI prompts — 100% free with no login required. Designed with advanced semantic data structure for humans and AI agents alike.'
                : 'المنصة العربية المفتوحة والأولى لعرض واكتشاف أوامر وهندسة الذكاء الاصطناعي (Prompt Engineering) بشكل مجاني 100% وبدون أي قيود أو تسجيل دخول. تم تصميم المنصة بهيكلية بيانات دلالية متقدمة لتكون سهلة الفهم للباحثين وروبوتات الذكاء الاصطناعي على حد سواء.'}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                <Shield className="w-3 h-3 text-emerald-600" />
                {t('nav.home') === 'Home' ? 'Free for all, no signup' : 'مجاني للجميع بدون تسجيل'}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                <Cpu className="w-3 h-3 text-blue-600" />
                {t('nav.home') === 'Home' ? 'Powered by Gemini' : 'توليد ذكي بواسطة Gemini 3.7'}
              </span>
            </div>
          </div>

          {/* Col 2: Top Categories */}
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              {t('footer.categories')}
            </h3>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-slate-600 hover:text-blue-600 transition-colors flex items-center justify-between py-0.5"
                  >
                    <span>{cat.name}</span>
                    {cat.promptCount !== undefined && (
                      <span className="text-slate-400 text-[10px] bg-slate-50 px-1.5 py-0.2 rounded">({cat.promptCount})</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Explore Resources */}
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              {t('nav.home') === 'Home' ? 'Explore' : 'استكشف'}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/models" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('nav.models')}</span>
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('nav.compare')}</span>
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('footer.learnLabel')}</span>
                </Link>
              </li>
              <li>
                <Link href="/skills" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('footer.skillsLabel')}</span>
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <Trophy className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('footer.trendingLabel')}</span>
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('footer.helpLabel')}</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <Newspaper className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('footer.blogLabel')}</span>
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('footer.resourcesLabel')}</span>
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <FileSearch className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('footer.casesLabel')}</span>
                </Link>
              </li>
              <li>
                <Link href="/shortcuts" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <Bot className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('footer.shortcutsLabel')}</span>
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('footer.docsLabel')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: AI Agents & Technical SEO */}
          <div>
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-blue-600" />
              {t('footer.aiLabel')}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/llms.txt" target="_blank" className="text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1.5 py-0.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t('footer.promptsApi')}</span>
                </Link>
              </li>
              <li>
                <Link href="/llms-full.txt" target="_blank" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('footer.fullApi')}</span>
                </Link>
              </li>
              <li>
                <Link href="/api/ai-read/prompts" target="_blank" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <Bot className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('footer.directApi')}</span>
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" target="_blank" className="text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1.5 py-0.5">
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t('footer.sitemap')}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>{t('footer.copy')}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              {t('nav.home') === 'Home' ? 'Made with' : 'صُنع بحب'} <Heart className="w-3 h-3 text-red-500 fill-red-500" /> {t('nav.home') === 'Home' ? 'for Arabic speakers' : 'للوطن العربي'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
