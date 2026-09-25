'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, Command, Search, Sparkles } from 'lucide-react';
import { Shortcut } from '@/types';
import { IconRenderer } from '@/components/IconRenderer';

interface ShortcutsSectionProps {
  shortcutCountToShow?: number;
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
}

export function ShortcutsSection({
  shortcutCountToShow,
  showHeader = true,
  title = "أوامر الاختصار الذكية (Slash Commands)",
  subtitle = "اختصارات جاهزة تستخدمها مباشرة داخل ChatGPT و Claude و Gemini بكتابة الأمر بعد الشرطة المائلة. انسخ الأمر واضغط Enter لتفعيل الوضع المخصص.",
}: ShortcutsSectionProps) {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch('/api/shortcuts', { cache: 'no-store' });
        const data = await res.json();
        if (mounted && data.success) {
          setShortcuts(data.shortcuts || []);
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error('Error loading shortcuts:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useCallback(() => {
    let result = shortcuts;
    if (activeCategory !== 'الكل') {
      result = result.filter((s) => s.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.command.toLowerCase().includes(q) ||
          s.slash.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.nameEn.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [shortcuts, activeCategory, searchQuery]);

  const visible = shortcutCountToShow ? filtered().slice(0, shortcutCountToShow) : filtered();

  const handleCopy = async (s: Shortcut) => {
    try {
      await navigator.clipboard.writeText(s.slash);
      setCopied(s.id);
      fetch(`/api/shortcuts/${s.id}`, { method: 'POST', cache: 'no-store' }).catch(() => {});
      setTimeout(() => setCopied((cur) => (cur === s.id ? null : cur)), 1800);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          جاري تحميل أوامر الاختصار الذكية...
        </div>
      </section>
    );
  }

  if (shortcuts.length === 0) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="flex items-start gap-3 mb-6">
            <div className="w-11 h-11 shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Command className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl">{subtitle}</p>
            </div>
          </div>
        )}

        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={() => setActiveCategory('الكل')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                activeCategory === 'الكل'
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-700'
              }`}
            >
              الكل ({shortcuts.length})
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  activeCategory === c
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="relative mb-6 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن أمر مثل: together, satellite..."
            className="w-full pr-9 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((s) => (
            <div
              key={s.id}
              className="group rounded-2xl bg-white border border-slate-200 p-5 hover:shadow-lg hover:border-violet-200 transition-all flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <IconRenderer name={s.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{s.name}</div>
                    <div className="text-[11px] text-slate-400">{s.nameEn}</div>
                  </div>
                </div>
                {s.category && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 whitespace-nowrap">
                    {s.category}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1">{s.description}</p>

              {s.example && (
                <p className="text-[11px] text-violet-600 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 mb-4 leading-relaxed">
                  {s.example}
                </p>
              )}

              <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <code className="text-sm font-mono font-bold text-violet-700 bg-violet-50 border border-violet-100 rounded-lg px-3 py-1.5">
                  {s.slash}
                </code>
                <button
                  onClick={() => handleCopy(s)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors cursor-pointer"
                >
                  {copied === s.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      تم النسخ
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      نسخ الأمر
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm">
            لا توجد أوامر مطابقة لبحثك
          </div>
        )}
      </div>
    </section>
  );
}
