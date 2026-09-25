'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Prompt } from '@/types';
import {
  X,
  Copy,
  Check,
  Sliders,
  ExternalLink,
  Sparkles,
  Share2,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  ArrowUpRight,
  Bot,
  Star,
  MessageSquare
} from 'lucide-react';
import { PromptRatingReview } from './PromptRatingReview';
import { AdSenseBanner } from './AdSenseBanner';
import { trackInternal, trackPixelEvent } from '@/lib/pixel';

interface PromptModalProps {
  prompt: Prompt | null;
  isOpen: boolean;
  initialTab?: 'view' | 'customize' | 'reviews';
  onClose: () => void;
  onCopy: (text: string, title?: string) => void;
}

export function PromptModal({
  prompt,
  isOpen,
  initialTab = 'view',
  onClose,
  onCopy
}: PromptModalProps) {
  if (!isOpen || !prompt) return null;

  return (
    <PromptModalContent
      key={prompt.id}
      prompt={prompt}
      initialTab={initialTab}
      onClose={onClose}
      onCopy={onCopy}
    />
  );
}

function PromptModalContent({
  prompt,
  initialTab = 'view',
  onClose,
  onCopy
}: {
  prompt: Prompt;
  initialTab: 'view' | 'customize' | 'reviews';
  onClose: () => void;
  onCopy: (text: string, title?: string) => void;
}) {
  const [currentTab, setCurrentTab] = useState<'view' | 'customize' | 'reviews'>(initialTab);
  const [variableValues, setVariableValues] = useState<Record<string, string>>(() => {
    const initialVars: Record<string, string> = {};
    if (prompt.variables) {
      prompt.variables.forEach((v) => {
        initialVars[v.key] = v.defaultValue || '';
      });
    }
    return initialVars;
  });
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedCustom, setCopiedCustom] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  // Compute live customized prompt (language-aware)
  const basePromptText =
    lang === 'en' && prompt.promptTextEn ? prompt.promptTextEn : prompt.promptText;
  let customizedPromptText = basePromptText;
  if (prompt.variables && prompt.variables.length > 0) {
    prompt.variables.forEach((v) => {
      const val = variableValues[v.key]?.trim() || `[${v.key}]`;
      customizedPromptText = customizedPromptText.split(`[${v.key}]`).join(val);
    });
  }

  const handleCopyRaw = () => {
    onCopy(basePromptText, prompt.title);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const handleCopyCustomized = () => {
    onCopy(customizedPromptText, prompt.title);
    setCopiedCustom(true);
    setTimeout(() => setCopiedCustom(false), 2000);
  };

  const handleShareLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = `${origin}/p/${prompt.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  const openInPlatform = (platform: 'chatgpt' | 'claude' | 'gemini' | 'deepseek') => {
    const textToUse = currentTab === 'customize' ? customizedPromptText : basePromptText;
    onCopy(textToUse, prompt.title);

    let url = '';
    const encoded = encodeURIComponent(textToUse);

    if (platform === 'chatgpt') {
      url = `https://chatgpt.com/?q=${encoded}`;
    } else if (platform === 'claude') {
      url = `https://claude.ai/new`;
    } else if (platform === 'gemini') {
      url = `https://gemini.google.com/app`;
    } else if (platform === 'deepseek') {
      url = `https://chat.deepseek.com/`;
    }

    if (url) {
      trackInternal('model_click', {
        targetId: prompt.id,
        targetName: `${prompt.title} -> ${platform}`
      });
      trackPixelEvent('ViewContent', {
        content_name: `${prompt.title} (${platform})`,
        content_category: prompt.categorySlug,
        content_ids: [prompt.id]
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
      <div
        onClick={() => onClose()}
        className="absolute inset-0"
      />
      <div
        className="relative w-full max-w-4xl max-h-[90vh] sm:max-h-[92vh] flex flex-col bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile grab handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <span className="w-10 h-1.5 rounded-full bg-slate-200" />
        </div>
        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-white shrink-0">
          <div className="space-y-1.5 pr-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                {prompt.categorySlug}
              </span>

              {/* Rating badge */}
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{(prompt.ratingAverage || 4.8).toFixed(1)}</span>
                <span className="text-[10px] text-amber-600 font-normal">({prompt.ratingCount || 10} تقييم)</span>
              </div>

              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                prompt.difficulty === 'مبتدئ'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : prompt.difficulty === 'متقدم'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {prompt.difficulty}
              </span>

              {prompt.framework && (
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                  {prompt.framework}
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {prompt.title}
            </h2>
            {prompt.titleEn && (
              <p className="text-xs text-slate-400 font-sans dir-ltr text-right">{prompt.titleEn}</p>
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

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareLink}
              title="نسخ رابط هذا البرومبت للمشاركة"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs flex items-center gap-1.5 font-medium cursor-pointer"
            >
              {copiedShareLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline text-emerald-600 font-bold">تم النسخ</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">مشاركة</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 sm:px-6 pt-3 border-b border-slate-100 flex items-center gap-3 sm:gap-6 bg-slate-50/70 shrink-0 overflow-x-auto">
          <button
            onClick={() => setCurrentTab('view')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'view'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>نص البرومبت والشرح</span>
          </button>

          {prompt.variables && prompt.variables.length > 0 && (
            <button
              onClick={() => setCurrentTab('customize')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                currentTab === 'customize'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>محرر المتغيرات الذكي ({prompt.variables.length})</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('reviews')}
            className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              currentTab === 'reviews'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500" />
            <span>التقييمات والمراجعات</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: VIEW & DETAILS */}
          {currentTab === 'view' && (
            <div className="space-y-6">
              
              {/* Description box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  وصف البرومبت والهدف منه
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {lang === 'en' && prompt.descriptionEn ? prompt.descriptionEn : prompt.description}
                </p>
              </div>

              {/* Main Prompt Text Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">
                    نص أمر الذكاء الاصطناعي (Prompt Template):
                  </span>
                  <button
                    onClick={handleCopyRaw}
                    className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer"
                  >
                    {copiedRaw ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>تم النسخ للحافظة</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ النص الأصلي</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-blue-200 leading-relaxed whitespace-pre-wrap dir-ltr text-left selection:bg-blue-600">
                  {basePromptText}
                </div>
              </div>

              {/* Pro Tips */}
              {prompt.tips && prompt.tips.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    نصائح للحصول على أدق إجابة من الذكاء الاصطناعي
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-900">
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
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    مثال على مخرجات الذكاء الاصطناعي المتوقعة
                  </h4>
                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed whitespace-pre-wrap dir-ltr text-left">
                    {prompt.sampleOutput}
              </div>
            </div>
          )}

              {/* Target Models & Tags */}
              <div className="space-y-3 pt-2">
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1.5">
                    النماذج الموصى بها:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {prompt.models.map((m, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1.5">
                    الوسوم والكلمات الدلالية:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {prompt.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODAL ADSENSE BANNER */}
          {currentTab === 'view' && <AdSenseBanner placement="modal" />}

          {/* TAB 2: INTERACTIVE CUSTOMIZER */}
          {currentTab === 'customize' && prompt.variables && (
            <div className="space-y-6">
              
              {/* Instructions */}
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 font-medium leading-relaxed">
                املأ الحقول التالية لتخصيص البرومبت حسب متطلباتك ومجال عملك. سيتم استبدال المتغيرات تلقائياً في النص الجاهز أدناه.
              </div>

              {/* Form fields for variables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prompt.variables.map((v) => (
                  <div key={v.key} className="space-y-1.5">
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
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 transition-all font-medium"
                    />
                  </div>
                ))}
              </div>

              {/* Live Preview Box */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    معاينة البرومبت المخصص الجاهز للنسخ:
                  </span>
                  <button
                    onClick={handleCopyCustomized}
                    className="flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs cursor-pointer"
                  >
                    {copiedCustom ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>تم نسخ البرومبت المخصص!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ البرومبت المخصص</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-indigo-200 leading-relaxed whitespace-pre-wrap dir-ltr text-left">
                  {customizedPromptText}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RATINGS & REVIEWS */}
          {currentTab === 'reviews' && (
            <PromptRatingReview
              promptId={prompt.id}
              promptTitle={prompt.title}
              initialAverage={prompt.ratingAverage || 4.8}
              initialCount={prompt.ratingCount || 10}
            />
          )}
        </div>

        {/* Modal Bottom Action Bar (Launch in AI Tools) */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <Bot className="w-4 h-4 text-blue-600" />
            <span>تجربة ونسخ فوري إلى:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => openInPlatform('chatgpt')}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>ChatGPT</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            </button>

            <button
              onClick={() => openInPlatform('claude')}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-amber-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>Claude</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
            </button>

            <button
              onClick={() => openInPlatform('gemini')}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>Gemini</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
            </button>

            <button
              onClick={() => openInPlatform('deepseek')}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-cyan-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <span>DeepSeek</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
