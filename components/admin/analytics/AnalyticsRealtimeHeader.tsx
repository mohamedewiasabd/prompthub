'use client';

import React from 'react';
import { AnalyticsSummary } from '@/types';
import {
  RefreshCw,
  Eye,
  Users,
  Copy,
  TrendingUp,
  Search,
  Share2
} from 'lucide-react';

interface AnalyticsRealtimeHeaderProps {
  summary: AnalyticsSummary;
  timeRange: 'today' | '7days' | '30days' | 'all';
  setTimeRange: (range: 'today' | '7days' | '30days' | 'all') => void;
  refreshing: boolean;
  onRefresh: () => void;
}

export const AnalyticsRealtimeHeader: React.FC<AnalyticsRealtimeHeaderProps> = ({
  summary: s,
  timeRange,
  setTimeRange,
  refreshing,
  onRefresh
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl relative overflow-hidden space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              المتصلون الآن بالمنصة في هذه اللحظة (Realtime Active)
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
              {s.realtimeActiveVisitors}
            </h2>
            <span className="text-xs text-slate-300 font-medium">زائر نشط حالياً</span>
          </div>
        </div>

        {/* Time range selector & Refresh button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-white/10 border border-white/10 text-xs font-medium">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeRange === 'today' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              اليوم
            </button>
            <button
              onClick={() => setTimeRange('7days')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeRange === '7days' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              آخر 7 أيام
            </button>
            <button
              onClick={() => setTimeRange('30days')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeRange === '30days' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              آخر 30 يوماً
            </button>
            <button
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeRange === 'all' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              الكل
            </button>
          </div>

          <button
            onClick={onRefresh}
            disabled={refreshing}
            title="تحديث البيانات فورياً"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 6 Key Analytics Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-white/10 relative z-10 text-right">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 block">إجمالي المشاهدات</span>
          <div className="text-xl font-bold font-mono text-white">{s.totalPageViews}</div>
          <span className="text-[10px] text-blue-300 flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>Page Views</span>
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 block">الزوار الفريدون</span>
          <div className="text-xl font-bold font-mono text-emerald-400">{s.totalUniqueVisitors}</div>
          <span className="text-[10px] text-emerald-300 flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Unique Visitors</span>
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 block">مرات نسخ البرومبت</span>
          <div className="text-xl font-bold font-mono text-indigo-400">{s.totalCopies}</div>
          <span className="text-[10px] text-indigo-300 flex items-center gap-1">
            <Copy className="w-3 h-3" />
            <span>Conversions</span>
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 block">معدل تحويل النسخ</span>
          <div className="text-xl font-bold font-mono text-amber-400">%{s.copyConversionRate}</div>
          <span className="text-[10px] text-amber-300 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Copy Rate</span>
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 block">عمليات البحث</span>
          <div className="text-xl font-bold font-mono text-purple-400">{s.totalSearches}</div>
          <span className="text-[10px] text-purple-300 flex items-center gap-1">
            <Search className="w-3 h-3" />
            <span>Search Queries</span>
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-[11px] text-slate-400 block">المشاركات</span>
          <div className="text-xl font-bold font-mono text-cyan-400">{s.totalShares}</div>
          <span className="text-[10px] text-cyan-300 flex items-center gap-1">
            <Share2 className="w-3 h-3" />
            <span>Shares</span>
          </span>
        </div>
      </div>
    </div>
  );
};
