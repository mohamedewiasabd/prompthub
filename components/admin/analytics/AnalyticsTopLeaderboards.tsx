'use client';

import React from 'react';
import { AnalyticsSummary } from '@/types';
import { Award, Copy, Eye, Search } from 'lucide-react';

interface AnalyticsTopLeaderboardsProps {
  topPrompts: AnalyticsSummary['topPrompts'];
  topSearches: AnalyticsSummary['topSearches'];
  getRelativeTime: (timestamp: string) => string;
}

export const AnalyticsTopLeaderboards: React.FC<AnalyticsTopLeaderboardsProps> = ({
  topPrompts,
  topSearches,
  getRelativeTime
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Top Prompts Leaderboard */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>أكثر البرومبتات تفاعلاً ونسخاً (Top Prompts)</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">الترتيب حسب النقاط</span>
        </div>

        {topPrompts.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">لا توجد برومبتات كافية بعد.</p>
        ) : (
          <div className="space-y-2.5">
            {topPrompts.map((p, idx) => (
              <div
                key={p.id}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 transition-colors flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-800'
                        : idx === 1
                        ? 'bg-slate-200 text-slate-800'
                        : idx === 2
                        ? 'bg-amber-800/10 text-amber-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate">{p.title}</span>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                    <Copy className="w-3 h-3" />
                    <span>{p.copies}</span>
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{p.views}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Top Search Keywords */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-600" />
            <span>الكلمات والعبارات الأكثر بحثاً (Search Keywords)</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">اهتمامات الزوار</span>
        </div>

        {topSearches.length === 0 ? (
          <div className="text-center py-8 text-slate-400 space-y-1">
            <p className="text-xs">لم يتم تسجيل عمليات بحث بعد.</p>
            <p className="text-[11px]">ستظهر هنا الكلمات المفتاحية فور قيام الزوار بالبحث.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {topSearches.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-purple-600 font-bold text-xs font-mono">#{idx + 1}</span>
                  <span className="text-xs font-bold text-slate-800 truncate">&quot;{item.query}&quot;</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                    {item.count} بحث
                  </span>
                  <span className="text-[10px] text-slate-400">{getRelativeTime(item.lastSearched)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
