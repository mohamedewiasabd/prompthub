'use client';

import React, { useState, useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PromptCard } from '@/components/PromptCard';
import { PromptModal } from '@/components/PromptModal';
import { CategoryShareModal } from '@/components/CategoryShareModal';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import { IconRenderer } from '@/components/IconRenderer';
import { Category, Prompt } from '@/types';
import {
  Sparkles,
  Share2,
  ChevronRight,
  Search,
  ArrowRight,
  Check,
  Copy,
  Sliders,
  Layers,
  Bot
} from 'lucide-react';

export default function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & filter within category
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Modals state
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [promptModalTab, setPromptModalTab] = useState<'view' | 'customize'>('view');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    async function loadCategoryData() {
      try {
        setLoading(true);
        const [catRes, allCatsRes] = await Promise.all([
          fetch(`/api/categories/${slug}`),
          fetch('/api/categories')
        ]);

        const catData = await catRes.json();
        const allCatsData = await allCatsRes.json();

        if (catData.success) {
          setCategory(catData.category);
          setPrompts(catData.prompts || []);
        }
        if (allCatsData.success) {
          setAllCategories(allCatsData.categories || []);
        }
      } catch (err) {
        console.error('Failed to load category:', err);
        addToast('error', 'فشل تحميل بيانات القسم');
      } finally {
        setLoading(false);
      }
    }

    loadCategoryData();
  }, [slug]);

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    let result = [...prompts];

    if (selectedModel !== 'all') {
      const qm = selectedModel.toLowerCase();
      result = result.filter((p) => p.models.some((m) => m.toLowerCase().includes(qm)));
    }

    if (selectedDifficulty !== 'all') {
      result = result.filter((p) => p.difficulty === selectedDifficulty);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.titleEn && p.titleEn.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.promptText.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [prompts, selectedModel, selectedDifficulty, searchQuery]);

  const handleCopyPrompt = async (p: Prompt) => {
    try {
      await navigator.clipboard.writeText(p.promptText);
      addToast('success', 'تم نسخ البرومبت بنجاح!');
      fetch(`/api/prompts/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'copy' })
      });
      setPrompts((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, copies: item.copies + 1 } : item))
      );
    } catch {
      addToast('error', 'تعذر النسخ');
    }
  };

  const handleCopyCategoryUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    addToast('success', 'تم نسخ رابط هذا القسم للمشاركة!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header categories={allCategories} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors font-medium">
            الرئيسية
          </Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-400" />
          <span>الأقسام</span>
          <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-400" />
          <span className="text-slate-900 font-bold">{category?.name || slug}</span>
        </nav>

        {/* CATEGORY HEADER BANNER */}
        {category && (
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
                  <IconRenderer name={category.icon} className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      قسم متخصص
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {prompts.length} برومبت متاح
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {category.name}
                  </h1>
                  <p className="text-xs text-slate-400 font-sans font-medium">{category.nameEn}</p>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl pt-1 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Share Category Actions */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  onClick={handleCopyCategoryUrl}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 transition-colors shadow-xs cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>تم نسخ الرابط</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>نسخ رابط القسم</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm shadow-blue-500/20 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة عبر التواصل</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH & FILTERS WITHIN CATEGORY */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`بحث داخل قسم ${category?.name || ''}...`}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="all">كل النماذج</option>
              <option value="ChatGPT">ChatGPT</option>
              <option value="Claude">Claude</option>
              <option value="Gemini">Gemini</option>
              <option value="DeepSeek">DeepSeek</option>
              <option value="Midjourney">Midjourney</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
            >
              <option value="all">كل المستويات</option>
              <option value="مبتدئ">مبتدئ</option>
              <option value="متوسط">متوسط</option>
              <option value="متقدم">متقدم</option>
            </select>
          </div>
        </div>

        {/* PROMPTS LIST */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">لا توجد برومبتات مطابقة في هذا القسم</h3>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لجميع الأقسام</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                onOpenDetails={(item) => {
                  setSelectedPrompt(item);
                  setPromptModalTab('view');
                  setIsPromptModalOpen(true);
                }}
                onOpenCustomize={(item) => {
                  setSelectedPrompt(item);
                  setPromptModalTab('customize');
                  setIsPromptModalOpen(true);
                }}
                onCopyPrompt={handleCopyPrompt}
                onLikePrompt={(item) => {
                  fetch(`/api/prompts/${item.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'like' })
                  });
                }}
                onSharePrompt={(item) => {
                  setSelectedPrompt(item);
                  setIsPromptModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <Footer categories={allCategories} />

      <PromptModal
        prompt={selectedPrompt}
        isOpen={isPromptModalOpen}
        initialTab={promptModalTab}
        onClose={() => setIsPromptModalOpen(false)}
        onCopy={(txt) => {
          navigator.clipboard.writeText(txt);
          addToast('success', 'تم النسخ بنجاح!');
        }}
      />

      <CategoryShareModal
        category={category}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
