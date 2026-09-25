'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryPills } from '@/components/CategoryPills';
import { SearchAndFilterBar } from '@/components/SearchAndFilterBar';
import { PromptCard } from '@/components/PromptCard';
import { PromptModal } from '@/components/PromptModal';
import { CategoryShareModal } from '@/components/CategoryShareModal';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import { AdSenseBanner } from '@/components/AdSenseBanner';
import { ShortcutsSection } from '@/components/ShortcutsSection';
import { HomeHeroSection } from '@/components/home/HomeHeroSection';
import { HomeTrendingAndNewShowcase } from '@/components/home/HomeTrendingAndNewShowcase';
import { HomeFaqSection } from '@/components/home/HomeFaqSection';
import { trackInternal, trackPixelEvent } from '@/lib/pixel';
import { Category, Prompt } from '@/types';
import { useCopyHistory } from '@/lib/use-user-data';
import {
  Search,
  Layers,
  Flame,
  Clock,
  Star
} from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  // Active View Tab on Homepage
  const [homeViewTab, setHomeViewTab] = useState<'all' | 'trending' | 'newest' | 'top-rated'>('all');

  // Filter & Search states
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('trending');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);

  // Initialize filters from URL query params (for shareable/bookmarked search links)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const cat = params.get('cat');
    const model = params.get('model');
    const diff = params.get('diff');
    const sort = params.get('sort');
    const tag = params.get('tag');
    const feat = params.get('featured');

    if (q) setSearchQuery(q);
    if (cat) setActiveCategorySlug(cat);
    if (model) setSelectedModel(model);
    if (diff) setSelectedDifficulty(diff);
    if (sort) setSortBy(sort);
    if (tag) setSelectedTag(tag);
    if (feat === '1') setFeaturedOnly(true);
  }, []);

  // Modals state
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [promptModalInitialTab, setPromptModalInitialTab] = useState<'view' | 'customize' | 'reviews'>('view');

  const [shareCategory, setShareCategory] = useState<Category | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const searchInputRef = useRef<HTMLDivElement>(null);

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

  const { add: addToHistory } = useCopyHistory();

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [catRes, promptRes] = await Promise.all([
          fetch('/api/categories', { cache: 'no-store' }),
          fetch('/api/prompts', { cache: 'no-store' })
        ]);

        const catData = await catRes.json();
        const promptData = await promptRes.json();

        if (catData.success) {
          setCategories(catData.categories || []);
        }
        if (promptData.success) {
          setPrompts(promptData.prompts || []);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        addToast('error', 'فشل تحميل البيانات', 'يرجى تحديث الصفحة');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Top Trending Prompts (Calculated dynamically: Views + Copies*2 + Likes*3 + Rating*20)
  const trendingPrompts = useMemo(() => {
    const score = (p: Prompt) => (p.views * 0.4) + (p.copies * 2) + (p.likes * 3) + ((p.ratingAverage || 4.5) * 20);
    return [...prompts].sort((a, b) => score(b) - score(a)).slice(0, 3);
  }, [prompts]);

  // Top Newest Prompts (Calculated dynamically by creation date)
  const newestPrompts = useMemo(() => {
    return [...prompts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
  }, [prompts]);

  // Main filtered and sorted list
  const filteredPrompts = useMemo(() => {
    let result = [...prompts];

    // Quick View Tab presets
    if (homeViewTab === 'trending') {
      const score = (p: Prompt) => (p.views * 0.4) + (p.copies * 2) + (p.likes * 3) + ((p.ratingAverage || 4.5) * 20);
      result.sort((a, b) => score(b) - score(a));
    } else if (homeViewTab === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (homeViewTab === 'top-rated') {
      result.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0) || (b.ratingCount || 0) - (a.ratingCount || 0));
    }

    // Category filter
    if (activeCategorySlug !== 'all') {
      const cat = categories.find((c) => c.slug === activeCategorySlug);
      result = result.filter(
        (p) => p.categorySlug === activeCategorySlug || (cat && p.categoryId === cat.id)
      );
    }

    // Model filter
    if (selectedModel !== 'all') {
      const qModel = selectedModel.toLowerCase();
      result = result.filter((p) =>
        p.models.some((m) => m.toLowerCase().includes(qModel))
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      result = result.filter((p) => p.difficulty === selectedDifficulty);
    }

    // Tag filter
    if (selectedTag && selectedTag !== 'all' && selectedTag.trim()) {
      const t = selectedTag.toLowerCase().trim();
      result = result.filter((p) => p.tags.some((tag) => tag.toLowerCase().includes(t)));
    }

    // Featured only filter
    if (featuredOnly) {
      result = result.filter((p) => p.featured === true);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.titleEn && p.titleEn.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.promptText.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.models.some((m) => m.toLowerCase().includes(q))
      );
    }

    // Custom Sorting (when user selects specific sort override)
    if (homeViewTab === 'all') {
      if (sortBy === 'trending') {
        const score = (p: Prompt) => (p.views * 0.4) + (p.copies * 2) + (p.likes * 3) + ((p.ratingAverage || 4.5) * 20);
        result.sort((a, b) => score(b) - score(a));
      } else if (sortBy === 'rating') {
        result.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0) || (b.ratingCount || 0) - (a.ratingCount || 0));
      } else if (sortBy === 'copies') {
        result.sort((a, b) => b.copies - a.copies);
      } else if (sortBy === 'views') {
        result.sort((a, b) => b.views - a.views);
      } else if (sortBy === 'likes') {
        result.sort((a, b) => b.likes - a.likes);
      } else {
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return result;
  }, [prompts, categories, activeCategorySlug, selectedModel, selectedDifficulty, searchQuery, sortBy, homeViewTab, selectedTag, featuredOnly]);

  // Search debounce tracking
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return;
    const timer = setTimeout(() => {
      trackInternal('search', { targetName: searchQuery.trim() });
      trackPixelEvent('Search', { search_string: searchQuery.trim() });
    }, 1200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync active filters to the URL query params (shareable/bookmarkable search links)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (activeCategorySlug !== 'all') params.set('cat', activeCategorySlug);
    if (selectedModel !== 'all') params.set('model', selectedModel);
    if (selectedDifficulty !== 'all') params.set('diff', selectedDifficulty);
    if (sortBy !== 'latest') params.set('sort', sortBy);
    if (selectedTag && selectedTag !== 'all') params.set('tag', selectedTag);
    if (featuredOnly) params.set('featured', '1');
    const qs = params.toString();
    const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState({}, '', url);
  }, [searchQuery, activeCategorySlug, selectedModel, selectedDifficulty, sortBy, selectedTag, featuredOnly]);

  const handleShareSearch = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      addToast('success', 'تم نسخ رابط البحث', 'شاركه ليتمكن الآخرون من رؤية نفس النتائج والتصفية.');
    } catch {
      addToast('error', 'تعذر النسخ', 'يرجى المحاولة مجدداً.');
    }
  };

  // Handlers
  const handleCopyPrompt = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      addToast('success', 'تم نسخ البرومبت بنجاح!', 'يمكنك الآن لصقه مباشرة في أداة الذكاء الاصطناعي');
      addToHistory({ id: prompt.id, title: prompt.title });
      
      // Dispatch Internal & Pixel Conversion Events
      trackInternal('prompt_copy', {
        targetId: prompt.id,
        targetName: prompt.title
      });
      trackPixelEvent('CopyPrompt', {
        content_name: prompt.title,
        content_category: prompt.categorySlug,
        content_ids: [prompt.id]
      });

      fetch(`/api/prompts/${prompt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'copy' })
      });
      setPrompts((prev) =>
        prev.map((p) => (p.id === prompt.id ? { ...p, copies: p.copies + 1 } : p))
      );
    } catch {
      addToast('error', 'تعذر النسخ تلقائياً');
    }
  };

  const handleCopyCustomText = async (text: string, title?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      addToast('success', 'تم نسخ النص بنجاح!', title ? `برومبت: ${title}` : undefined);
      if (selectedPrompt) {
        addToHistory({ id: selectedPrompt.id, title: title || selectedPrompt.title });
        trackInternal('prompt_copy', {
          targetId: selectedPrompt.id,
          targetName: title || selectedPrompt.title
        });
        trackPixelEvent('CopyPrompt', {
          content_name: title || selectedPrompt.title,
          content_category: selectedPrompt.categorySlug,
          content_ids: [selectedPrompt.id]
        });
      }
    } catch {
      addToast('error', 'تعذر النسخ');
    }
  };

  const handleLikePrompt = async (prompt: Prompt) => {
    try {
      trackInternal('prompt_like', {
        targetId: prompt.id,
        targetName: prompt.title
      });
      fetch(`/api/prompts/${prompt.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' })
      });
      setPrompts((prev) =>
        prev.map((p) => (p.id === prompt.id ? { ...p, likes: p.likes + 1 } : p))
      );
      addToast('info', 'شكراً لإعجابك!', 'تم تسجيل تقييمك للبرومبت');
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDetails = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setPromptModalInitialTab('view');
    setIsPromptModalOpen(true);
    
    trackInternal('prompt_view', {
      targetId: prompt.id,
      targetName: prompt.title
    });
    trackPixelEvent('ViewContent', {
      content_name: prompt.title,
      content_category: prompt.categorySlug,
      content_ids: [prompt.id]
    });

    fetch(`/api/prompts/${prompt.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'view' })
    });
  };

  const handleOpenCustomize = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setPromptModalInitialTab('customize');
    setIsPromptModalOpen(true);

    trackInternal('prompt_view', {
      targetId: prompt.id,
      targetName: prompt.title
    });
    trackPixelEvent('ViewContent', {
      content_name: prompt.title,
      content_category: prompt.categorySlug,
      content_ids: [prompt.id]
    });
  };

  const handleSelectCategory = (slug: string) => {
    setActiveCategorySlug(slug);
    const cat = categories.find(c => c.slug === slug);
    trackInternal('category_view', {
      targetId: slug,
      targetName: cat?.name || slug
    });
    trackPixelEvent('CategoryView', {
      content_category: slug,
      content_name: cat?.name || slug
    });
  };

  const handleShareCategory = (cat: Category) => {
    setShareCategory(cat);
    setIsShareModalOpen(true);
    trackPixelEvent('SharePrompt', {
      content_category: cat.slug,
      content_name: cat.name
    });
  };

  const scrollToSearch = () => {
    searchInputRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans" dir="rtl">
      <Header
        categories={categories}
        onSearchFocus={scrollToSearch}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-10 sm:space-y-12">
        
        {/* HERO SECTION */}
        <HomeHeroSection />

        {/* SECTION 1: TRENDING PROMPTS & NEW PROMPTS SHOWCASE */}
        {!loading && prompts.length > 0 && searchQuery === '' && activeCategorySlug === 'all' && (
          <HomeTrendingAndNewShowcase
            trendingPrompts={trendingPrompts}
            newestPrompts={newestPrompts}
            onOpenDetails={handleOpenDetails}
            onCopyPrompt={handleCopyPrompt}
            onViewAllTrending={() => {
              setHomeViewTab('trending');
              setSortBy('trending');
              scrollToSearch();
            }}
            onViewAllNewest={() => {
              setHomeViewTab('newest');
              setSortBy('latest');
              scrollToSearch();
            }}
          />
        )}

        {/* CATEGORY SELECTOR PILLS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>تصفح حسب القسم</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {categories.length} أقسام متاحة
            </span>
          </div>

          <CategoryPills
            categories={categories}
            activeSlug={activeCategorySlug}
            onSelectCategory={handleSelectCategory}
            onShareCategory={handleShareCategory}
          />
        </section>

        {/* SHORTCUTS / SLASH COMMANDS SECTION */}
        <ShortcutsSection shortcutCountToShow={6} showHeader={false} />

        {/* TOP ADSENSE BANNER */}
        <AdSenseBanner placement="header" />

        {/* SEARCH & ADVANCED FILTERS BAR */}
        <section ref={searchInputRef} className="space-y-4">
          <SearchAndFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={setSelectedDifficulty}
            selectedCategorySlug={activeCategorySlug}
            onCategoryChange={setActiveCategorySlug}
            categories={categories}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalResults={filteredPrompts.length}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
            featuredOnly={featuredOnly}
            onFeaturedChange={setFeaturedOnly}
            onShareSearch={handleShareSearch}
          />

          {/* Quick View Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setHomeViewTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  homeViewTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                جميع البرومبتات ({prompts.length})
              </button>

              <button
                onClick={() => setHomeViewTab('trending')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  homeViewTab === 'trending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>البرومبتات الشائعة</span>
              </button>

              <button
                onClick={() => setHomeViewTab('newest')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  homeViewTab === 'newest'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>الأحدث إضافة</span>
              </button>

              <button
                onClick={() => setHomeViewTab('top-rated')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  homeViewTab === 'top-rated'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>الأعلى تقييماً</span>
              </button>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              عرض {filteredPrompts.length} من أصل {prompts.length}
            </span>
          </div>
        </section>

        {/* PROMPTS GRID */}
        <section className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-64 rounded-2xl bg-white border border-slate-200 animate-pulse p-5 space-y-4"
                >
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-6 bg-slate-100 rounded w-3/4" />
                  <div className="h-16 bg-slate-50 rounded" />
                </div>
              ))}
            </div>
          ) : filteredPrompts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">لم يتم العثور على أي برومبتات مطابقة</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                جرب تغيير كلمات البحث، أو إزالة فلتر النموذج أو الصعوبة، أو اختيار قسم آخر.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedModel('all');
                  setSelectedDifficulty('all');
                  setActiveCategorySlug('all');
                  setHomeViewTab('all');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
              >
                إعادة ضبط جميع الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredPrompts.map((prompt, index) => (
                <React.Fragment key={prompt.id}>
                  <PromptCard
                    prompt={prompt}
                    onOpenDetails={handleOpenDetails}
                    onOpenCustomize={handleOpenCustomize}
                    onCopyPrompt={handleCopyPrompt}
                    onLikePrompt={handleLikePrompt}
                    onSharePrompt={(p) => {
                      setSelectedPrompt(p);
                      setIsPromptModalOpen(true);
                    }}
                  />
                  {/* Insert an In-Feed AdSense banner after the 3rd and 9th prompt */}
                  {(index === 2 || (index > 2 && (index - 2) % 6 === 0)) && (
                    <AdSenseBanner placement="feed" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </section>

        {/* SEO FAQ SECTION */}
        <HomeFaqSection />
      </main>

      {/* FOOTER */}
      <Footer categories={categories} />

      {/* PROMPT DETAILS & CUSTOMIZER MODAL */}
      <PromptModal
        prompt={selectedPrompt}
        isOpen={isPromptModalOpen}
        initialTab={promptModalInitialTab}
        onClose={() => setIsPromptModalOpen(false)}
        onCopy={handleCopyCustomText}
      />

      {/* CATEGORY SHARE MODAL */}
      <CategoryShareModal
        category={shareCategory}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* TOASTS NOTIFIER */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* STICKY BOTTOM ADSENSE BANNER */}
      <AdSenseBanner placement="sticky-bottom" />
    </div>
  );
}
