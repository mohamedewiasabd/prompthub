'use client';

import React from 'react';
import { AnalyticsSummary } from '@/types';
import {
  Activity,
  Globe,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';

interface AnalyticsDeviceAndTrafficProps {
  deviceBreakdown: AnalyticsSummary['deviceBreakdown'];
  referrerBreakdown: AnalyticsSummary['referrerBreakdown'];
  recentEvents: AnalyticsSummary['recentEvents'];
  getRelativeTime: (timestamp: string) => string;
  getEventTypeLabel: (type: string) => { label: string; color: string };
}

export const AnalyticsDeviceAndTraffic: React.FC<AnalyticsDeviceAndTrafficProps> = ({
  deviceBreakdown,
  referrerBreakdown,
  recentEvents,
  getRelativeTime,
  getEventTypeLabel
}) => {
  const totalDevices =
    (deviceBreakdown.desktop || 0) +
    (deviceBreakdown.mobile || 0) +
    (deviceBreakdown.tablet || 0) || 1;
  const desktopPct = Math.round(((deviceBreakdown.desktop || 0) / totalDevices) * 100);
  const mobilePct = Math.round(((deviceBreakdown.mobile || 0) / totalDevices) * 100);
  const tabletPct = 100 - (desktopPct + mobilePct);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Device Types Breakdown */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Smartphone className="w-4 h-4 text-blue-600" />
          <span>نوع الأجهزة (Device Breakdown)</span>
        </h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Monitor className="w-3.5 h-3.5 text-slate-500" />
                <span>الكمبيوتر المكتبي (Desktop)</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">%{desktopPct}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${desktopPct}%` }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span>الهواتف الذكية (Mobile)</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">%{mobilePct}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${mobilePct}%` }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Tablet className="w-3.5 h-3.5 text-slate-500" />
                <span>الأجهزة اللوحية (Tablet)</span>
              </span>
              <span className="font-bold text-slate-900 font-mono">%{tabletPct}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${tabletPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Traffic Sources Breakdown */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>مصادر الزيارات (Referrers)</span>
        </h3>

        <div className="space-y-2.5">
          {Object.entries(referrerBreakdown).slice(0, 5).map(([ref, count], idx) => (
            <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
              <span className="font-medium text-slate-800 truncate">{ref}</span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono">
                {count} زيارة
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Events Stream */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500" />
            <span>سجل التفاعل الحي (Live Stream)</span>
          </h3>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {recentEvents.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">جاري انتظار تفاعلات جديدة...</p>
          ) : (
            recentEvents.map((ev) => {
              const badge = getEventTypeLabel(ev.eventType);
              return (
                <div key={ev.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {getRelativeTime(ev.timestamp)}
                    </span>
                  </div>
                  {ev.targetName && (
                    <p className="text-slate-800 font-medium truncate text-[11px]">{ev.targetName}</p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
