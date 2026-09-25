'use client';

import React from 'react';
import { Prompt } from '@/types';
import { Flame, Clock, Star, ArrowRight } from 'lucide-react';

interface HomeTrendingAndNewShowcaseProps {
  trendingPrompts: Prompt[];
  newestPrompts: Prompt[];
  onOpenDetails: (prompt: Prompt) => void;
  onCopyPrompt: (prompt: Prompt) => void;
  onViewAllTrending: () => void;
  onViewAllNewest: () => void;
}

export const HomeTrendingAndNewShowcase: React.FC<HomeTrendingAndNewShowcaseProps> = ({
  trendingPrompts,
  newestPrompts,
  onOpenDetails,
  onCopyPrompt,
  onViewAllTrending,
  onViewAllNewest
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Trending Prompts Card Showcase */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-br from-amber-50/70 via-white to-white border border-amber-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">البرومبتات الأكثر شعبية وشهرة</h2>
              <p className="text-xs text-slate-500">تحديث تلقائي بناءً على أعلى المشاهدات والتقييمات والنسخ</p>
            </div>
          </div>
          <button
            onClick={onViewAllTrending}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>عرض المزيد</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>

        <div className="space-y-3">
          {trendingPrompts.map((p, idx) => (
            <div
              key={p.id}
              onClick={() => onOpenDetails(p)}
              className="p-3.5 rounded-2xl bg-white border border-amber-100 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-black flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {p.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="text-amber-700 font-semibold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {(p.ratingAverage || 4.9).toFixed(1)}
                    </span>
                    <span>•</span>
                    <span>{p.copies} استخدام</span>
                    <span>•</span>
                    <span className="text-blue-600">{p.categorySlug}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyPrompt(p);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold shrink-0 border border-amber-200 transition-colors cursor-pointer"
              >
                نسخ
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Newest Prompts Card Showcase */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-br from-blue-50/70 via-white to-white border border-blue-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">أحدث البرومبتات المضافة</h2>
              <p className="text-xs text-slate-500">أحدث الأوامر المطورة لنماذج GPT-4o وClaude 3.7 وDeepSeek</p>
            </div>
          </div>
          <button
            onClick={onViewAllNewest}
            className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
          >
            <span>عرض المزيد</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>

        <div className="space-y-3">
          {newestPrompts.map((p) => (
            <div
              key={p.id}
              onClick={() => onOpenDetails(p)}
              className="p-3.5 rounded-2xl bg-white border border-blue-100 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center shrink-0">
                  جديد
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                    {p.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="text-emerald-700 font-semibold">{p.difficulty}</span>
                    <span>•</span>
                    <span>{p.models[0] || 'ChatGPT'}</span>
                    <span>•</span>
                    <span className="text-blue-600">{p.categorySlug}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyPrompt(p);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold shrink-0 border border-blue-200 transition-colors cursor-pointer"
              >
                نسخ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
