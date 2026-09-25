'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ShortcutsSection } from '@/components/ShortcutsSection';
import { AdSenseBanner } from '@/components/AdSenseBanner';
import { ChevronRight, Command, Sparkles } from 'lucide-react';
import { Category } from '@/types';

export default function ShortcutsPage() {
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => d.success && setAllCategories(d.categories || []))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header categories={allCategories} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors font-medium">
            الرئيسية
          </Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-400" />
          <span className="text-slate-900 font-bold">أوامر الاختصار الذكية</span>
        </nav>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 sm:p-10 text-white shadow-lg shadow-indigo-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Command className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30">
                  قسم خاص بالأوامر
                </span>
                <span className="text-xs font-medium text-white/80 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  تُولّد تلقائياً عبر لوحة التحكم
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">أوامر الاختصار (Slash Commands)</h1>
              <p className="text-sm text-white/85 max-w-2xl leading-relaxed">
                مجموعة من الأوامر المختصرة الجاهزة تضيف أوضاعاً ووظائف خاصة داخل ChatGPT و Claude و
                Gemini. فقط اكتب الأمر بعد الشرطة المائلة مثل <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono">/together</code> أو{" "}
                <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono">/satellite</code> ثم كبسة Enter.
              </p>
            </div>
          </div>
        </div>

        <ShortcutsSection />

        <AdSenseBanner placement="feed" />
      </main>

      <Footer categories={allCategories} />
    </div>
  );
}
