'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import { Prompt, Category } from '@/types';
import { PromptRatingReview } from '@/components/PromptRatingReview';
import { useFavorites, useCopyHistory } from '@/lib/use-user-data';
import {
  Sparkles,
  Copy,
  Check,
  Sliders,
  ChevronRight,
  Share2,
  Lightbulb,
  CheckCircle2,
  ArrowUpRight,
  Bot,
  Heart,
  Eye,
  ArrowRight,
  Star,
  MessageSquare,
  Bookmark,
  Clock
} from 'lucide-react';

export function PromptDetailClient({
  prompt: initialPrompt,
  categories: initialCategories
}: {
  prompt: Prompt;
  categories: Category[];
}) {
  const [prompt, setPrompt] = useState<Prompt | null>(initialPrompt);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const id = initialPrompt.id;

  // Variables state
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedCustom, setCopiedCustom] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [liked, setLiked] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const { isFav, toggle: toggleFav } = useFavorites();
  const { add: addToHistory } = useCopyHistory();

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const toastId = Date.now().toString();
    setToasts((prev) => [...prev, { id: toastId, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
    }, 3000);
  };

  const removeToast = (toastId: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== toastId));
  };

  useEffect(() => {
    // Initialize variables from the server-passed prompt
    const initialVars: Record<string, string> = {};
    if (initialPrompt.variables) {
      initialPrompt.variables.forEach((v: any) => {
        initialVars[v.key] = v.defaultValue || '';
      });
    }
    setVariableValues(initialVars);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt.id]);

  // Dynamically inject SEO + Open Graph meta tags for share previews
  useEffect(() => {
    if (!prompt) return;
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/p/${prompt.id}`;
    const title = `${prompt.title} | PromptHub`;
    const desc = prompt.description || 'برومبت ذكاء اصطناعي احترافي من مكتبة البرومبتات الذكية';

    const setMeta = (attr: string, key: string, value: string) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', 'article');
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:site_name', 'PromptHub');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', desc);
    document.title = title;
  }, [prompt]);

  const handleFav = () => {
    if (prompt) toggleFav(prompt.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4 text-center">
          <h2 className="text-xl font-bold text-slate-900">البرومبت غير موجود أو تم نقله</h2>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate live custom text (language-aware)
  const basePromptText =
    lang === 'en' && prompt.promptTextEn ? prompt.promptTextEn : prompt.promptText;
  let customizedPromptText = basePromptText;
  if (prompt.variables && prompt.variables.length > 0) {
    prompt.variables.forEach((v) => {
      const val = variableValues[v.key]?.trim() || `[${v.key}]`;
      customizedPromptText = customizedPromptText.split(`[${v.key}]`).join(val);
    });
  }

  const handleCopyRaw = async () => {
    await navigator.clipboard.writeText(basePromptText);
    setCopiedRaw(true);
    addToast('success', 'تم نسخ البرومبت الأصلي بنجاح!');
    setTimeout(() => setCopiedRaw(false), 2000);
    addToHistory({ id: prompt.id, title: prompt.title });
    fetch(`/api/prompts/${prompt.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'copy' })
    });
  };

  const handleCopyCustomized = async () => {
    await navigator.clipboard.writeText(customizedPromptText);
    setCopiedCustom(true);
    addToast('success', 'تم نسخ البرومبت المخصص بنجاح!');
    setTimeout(() => setCopiedCustom(false), 2000);
    addToHistory({ id: prompt.id, title: prompt.title });
    fetch(`/api/prompts/${prompt.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'copy' })
    });
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    addToast('success', 'تم نسخ رابط هذا البرومبت للمشاركة!');
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const openInPlatform = (platform: 'chatgpt' | 'claude' | 'gemini' | 'deepseek') => {
    const textToUse = customizedPromptText;
    navigator.clipboard.writeText(textToUse);
    addToast('info', 'تم نسخ النص وتوجيهك للأداة');

    const encoded = encodeURIComponent(textToUse);
    let url = '';
    if (platform === 'chatgpt') url = `https://chatgpt.com/?q=${encoded}`;
    if (platform === 'claude') url = `https://claude.ai/new`;
    if (platform === 'gemini') url = `https://gemini.google.com/app`;
    if (platform === 'deepseek') url = `https://chat.deepseek.com/`;

    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header categories={categories} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-blue-600 transition-colors font-medium">
            الرئيسية
          </Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-400" />
          <Link href={`/category/${prompt.categorySlug}`} className="hover:text-blue-600 transition-colors font-medium">
            {prompt.categorySlug}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-400" />
          <span className="text-slate-900 font-bold truncate max-w-[200px]">{prompt.title}</span>
        </nav>

        {/* HERO PROMPT CARD */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/category/${prompt.categorySlug}`}
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                >
                  {prompt.categorySlug}
                </Link>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{(prompt.ratingAverage || 4.8).toFixed(1)}</span>
                  <span className="text-[10px] text-amber-600 font-normal">({prompt.ratingCount || 10} تقييم)</span>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                  prompt.difficulty === 'مبتدئ'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : prompt.difficulty === 'متقدم'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  المستوى: {prompt.difficulty}
                </span>
                {prompt.framework && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {prompt.framework}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-3xl font-bold text-slate-900 leading-snug">
                {prompt.title}
              </h1>
              {prompt.titleEn && (
                <p className="text-xs text-slate-400 font-sans font-medium">{prompt.titleEn}</p>
              )}

              {(prompt.promptTextEn || prompt.descriptionEn) && (
                <div className="flex items-center gap-1 mt-2 bg-slate-100 rounded-lg p-0.5 self-start">
                  <button
                    onClick={() => setLang('ar')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                      lang === 'ar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => setLang('en')}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                      lang === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            {/* Actions: Copy & Share */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleFav}
                className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border cursor-pointer shadow-xs ${
                  isFav(prompt.id)
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
                title={isFav(prompt.id) ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
              >
                <Bookmark className={`w-4 h-4 ${isFav(prompt.id) ? 'fill-rose-600' : ''}`} />
                <span>{isFav(prompt.id) ? 'محفوظ' : 'حفظ'}</span>
              </button>
              <button
                onClick={handleCopyShareLink}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer shadow-xs"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>تم نسخ الرابط</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>مشاركة الرابط</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-xs font-bold text-slate-500">وصف البرومبت:</h3>
            <p className="text-sm text-slate-700 leading-relaxed font-normal">
              {lang === 'en' && prompt.descriptionEn ? prompt.descriptionEn : prompt.description}
            </p>
          </div>

          {/* Interactive Variable Customizer (if variables exist) */}
          {prompt.variables && prompt.variables.length > 0 && (
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-indigo-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  <span>تخصيص متغيرات البرومبت مباشرة:</span>
                </h3>
                <span className="text-[11px] font-semibold text-indigo-600">
                  {prompt.variables.length} متغيرات
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {prompt.variables.map((v) => (
                  <div key={v.key} className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                      <span>{v.label}</span>
                      <span className="text-[10px] text-indigo-600 font-mono">[{v.key}]</span>
                    </label>
                    <input
                      type="text"
                      value={variableValues[v.key] || ''}
                      onChange={(e) =>
                        setVariableValues({ ...variableValues, [v.key]: e.target.value })
                      }
                      placeholder={v.placeholder}
                      className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-indigo-600 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                    />
                  </div>
                ))}
              </div>

              {/* Customized Output Box */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">البرومبت المخصص الجاهز:</span>
                  <button
                    onClick={handleCopyCustomized}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    {copiedCustom ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>تم نسخ المخصص!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ البرومبت المخصص</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-indigo-100 leading-relaxed whitespace-pre-wrap dir-ltr text-left shadow-inner">
                  {customizedPromptText}
                </div>
              </div>
            </div>
          )}

          {/* Original Prompt Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">نص البرومبت الأصلي (Template):</span>
              <button
                onClick={handleCopyRaw}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {copiedRaw ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ النص الأصلي</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-slate-100 leading-relaxed whitespace-pre-wrap dir-ltr text-left shadow-inner">
              {basePromptText}
            </div>
          </div>

          {/* Direct Launch in AI Tools */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Bot className="w-4 h-4 text-blue-600" />
              <span>تجربة فورية في:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => openInPlatform('chatgpt')}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>ChatGPT</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => openInPlatform('claude')}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Claude</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => openInPlatform('gemini')}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Gemini</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => openInPlatform('deepseek')}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>DeepSeek</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pro Tips */}
          {prompt.tips && prompt.tips.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>نصائح ذهبية لتحقيق أعلى دقة:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-800">
                {prompt.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sample Output */}
          {prompt.sampleOutput && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>عينة مخرجات واقعية:</span>
              </h4>
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono leading-relaxed whitespace-pre-wrap">
                {prompt.sampleOutput}
              </div>
            </div>
          )}

          {/* Prompt Ratings & User Reviews */}
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>تقييمات وآراء المستخدمين حول هذا البرومبت</span>
            </h3>
            <PromptRatingReview
              promptId={prompt.id}
              promptTitle={prompt.title}
              initialAverage={prompt.ratingAverage || 4.8}
              initialCount={prompt.ratingCount || 10}
              onRatingSubmitted={(newAvg, newCount) => {
                setPrompt(prev => prev ? { ...prev, ratingAverage: newAvg, ratingCount: newCount } : prev);
              }}
            />
          </div>
        </div>
      </main>

      <Footer categories={categories} />
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
