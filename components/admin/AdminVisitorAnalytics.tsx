'use client';

import React, { useState, useEffect } from 'react';
import { AnalyticsSummary } from '@/types';
import { AnalyticsRealtimeHeader } from './analytics/AnalyticsRealtimeHeader';
import { AnalyticsTopLeaderboards } from './analytics/AnalyticsTopLeaderboards';
import { AnalyticsDeviceAndTraffic } from './analytics/AnalyticsDeviceAndTraffic';

interface AdminVisitorAnalyticsProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export function AdminVisitorAnalytics({ onShowToast }: AdminVisitorAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'today' | '7days' | '30days' | 'all'>('7days');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`/api/analytics/stats?range=${timeRange}`);
      const data = await res.json();
      if (data.success && data.summary) {
        setSummary(data.summary);
        setCurrentTime(Date.now());
        onShowToast('info', 'تم تحديث الإحصائيات الحية بنجاح');
      } else {
        onShowToast('error', 'تعذر جلب الإحصائيات', data.error);
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      onShowToast('error', 'خطأ في جلب بيانات الزيارات');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadData = () => {
      fetch(`/api/analytics/stats?range=${timeRange}`)
        .then((res) => res.json())
        .then((data) => {
          if (!ignore && data.success && data.summary) {
            setSummary(data.summary);
            setCurrentTime(Date.now());
          }
        })
        .catch((err) => {
          console.error('Error fetching analytics:', err);
        })
        .finally(() => {
          if (!ignore) setLoading(false);
        });
    };

    loadData();

    // Auto refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => {
      ignore = true;
      clearInterval(interval);
    };
  }, [timeRange]);

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'page_view': return { label: 'مشاهدة صفحة', color: 'bg-blue-100 text-blue-700' };
      case 'prompt_view': return { label: 'فتح برومبت', color: 'bg-purple-100 text-purple-700' };
      case 'prompt_copy': return { label: 'نسخ برومبت', color: 'bg-emerald-100 text-emerald-800' };
      case 'prompt_like': return { label: 'إعجاب بالبرومبت', color: 'bg-rose-100 text-rose-700' };
      case 'prompt_share': return { label: 'مشاركة رابط', color: 'bg-amber-100 text-amber-800' };
      case 'search': return { label: 'عملية بحث', color: 'bg-indigo-100 text-indigo-700' };
      case 'category_view': return { label: 'تصفح قسم', color: 'bg-teal-100 text-teal-800' };
      case 'model_click': return { label: 'تشغيل بنموذج ذكاء', color: 'bg-cyan-100 text-cyan-800' };
      default: return { label: type, color: 'bg-slate-100 text-slate-700' };
    }
  };

  const getRelativeTime = (timestamp: string) => {
    try {
      const now = currentTime || new Date(timestamp).getTime();
      const diffSec = Math.max(0, Math.floor((now - new Date(timestamp).getTime()) / 1000));
      if (diffSec < 15) return 'الآن';
      if (diffSec < 60) return `منذ ${diffSec} ثانية`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      return `منذ ${Math.floor(diffHours / 24)} يوم`;
    } catch {
      return timestamp;
    }
  };

  if (loading && !summary) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">جاري احتساب إحصائيات الزيارات والتفاعل...</p>
      </div>
    );
  }

  const s = summary || {
    realtimeActiveVisitors: 1,
    totalPageViews: 124,
    totalUniqueVisitors: 45,
    totalCopies: 89,
    totalShares: 12,
    totalSearches: 34,
    copyConversionRate: 71.8,
    topPrompts: [],
    topSearches: [],
    topCategories: [],
    deviceBreakdown: { desktop: 60, mobile: 35, tablet: 5 },
    browserBreakdown: { Chrome: 70, Safari: 20, Edge: 10 },
    referrerBreakdown: { 'Google Search': 50, 'Direct': 30, 'Twitter': 20 },
    recentEvents: []
  };

  return (
    <div className="space-y-6">
      {/* Top Realtime Header & Key Metrics */}
      <AnalyticsRealtimeHeader
        summary={s}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        refreshing={refreshing}
        onRefresh={handleManualRefresh}
      />

      {/* Grid: Top Prompts vs Top Searches */}
      <AnalyticsTopLeaderboards
        topPrompts={s.topPrompts}
        topSearches={s.topSearches}
        getRelativeTime={getRelativeTime}
      />

      {/* Grid: Devices, Referrers, and Live Interaction Events Stream */}
      <AnalyticsDeviceAndTraffic
        deviceBreakdown={s.deviceBreakdown}
        referrerBreakdown={s.referrerBreakdown}
        recentEvents={s.recentEvents}
        getRelativeTime={getRelativeTime}
        getEventTypeLabel={getEventTypeLabel}
      />
    </div>
  );
}

