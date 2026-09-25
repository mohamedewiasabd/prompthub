'use client';

import React from 'react';
import { AdSenseSettings } from '@/types';
import { DollarSign, Layers, Save } from 'lucide-react';

interface AdminAdSenseSectionProps {
  adSense: AdSenseSettings;
  setAdSense: React.Dispatch<React.SetStateAction<AdSenseSettings>>;
  saving: boolean;
  onSave: () => void;
}

export const AdminAdSenseSection: React.FC<AdminAdSenseSectionProps> = ({
  adSense,
  setAdSense,
  saving,
  onSave
}) => {
  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>تهيئة حساب Google AdSense ومواضع الإعلانات</span>
            </h3>
            <p className="text-xs text-slate-500">
              قم بوضع معرّف الناشر (Publisher ID) ومعرّفات الوحدات الإعلانية (Ad Slots).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={adSense.enabled}
                onChange={(e) => setAdSense({ ...adSense, enabled: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-800">تفعيل الإعلانات بالموقع</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 text-blue-900">
              <input
                type="checkbox"
                checked={adSense.testMode}
                onChange={(e) => setAdSense({ ...adSense, testMode: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs font-bold">وضع المعاينة (Test Mode)</span>
            </label>
          </div>
        </div>

        {/* Publisher ID & Auto Ads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>معرّف الناشر (Google AdSense Publisher ID):</span>
              <span className="text-[11px] text-blue-600 font-mono">ca-pub-XXXXXXXXXXXXXXXX</span>
            </label>
            <input
              type="text"
              value={adSense.publisherId}
              onChange={(e) => setAdSense({ ...adSense, publisherId: e.target.value })}
              placeholder="ca-pub-1234567890123456"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs font-mono text-slate-900 font-medium"
            />
            <p className="text-[11px] text-slate-500">
              تجد هذا المعرف في حسابك على AdSense ضمن قسم: الحساب {'>'} الإعدادات {'>'} معلومات الحساب.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">الإعلانات التلقائية (Auto Ads):</label>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">تفعيل Auto Ads من Google</span>
                <span className="text-[11px] text-slate-500">يقوم الذكاء الاصطناعي من جوجل بتوزيع الإعلانات تلقائياً</span>
              </div>
              <input
                type="checkbox"
                checked={adSense.autoAds}
                onChange={(e) => setAdSense({ ...adSense, autoAds: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Ad Slots Configuration */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>معرّفات الوحدات الإعلانية المخصصة (Ad Unit Slots)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Header Slot */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">إعلان أعلى الصفحة (Header)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">Leaderboard</span>
              </div>
              <input
                type="text"
                value={adSense.headerSlot || ''}
                onChange={(e) => setAdSense({ ...adSense, headerSlot: e.target.value })}
                placeholder="Slot ID e.g. 1234567890"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
              <p className="text-[10px] text-slate-500">يظهر تحت الهيدر مباشرة في الصفحة الرئيسية.</p>
            </div>

            {/* 2. Feed Slot */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">إعلان مدمج بالقائمة (In-Feed)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">In-Feed Native</span>
              </div>
              <input
                type="text"
                value={adSense.feedSlot || ''}
                onChange={(e) => setAdSense({ ...adSense, feedSlot: e.target.value })}
                placeholder="Slot ID e.g. 2345678901"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
              <p className="text-[10px] text-slate-500">يظهر بين بطاقات البرومبتات في الشبكة بشكل طبيعي.</p>
            </div>

            {/* 3. Modal Slot */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">إعلان تفاصيل البرومبت (Modal)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">In-Article</span>
              </div>
              <input
                type="text"
                value={adSense.modalSlot || ''}
                onChange={(e) => setAdSense({ ...adSense, modalSlot: e.target.value })}
                placeholder="Slot ID e.g. 3456789012"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
              <p className="text-[10px] text-slate-500">يظهر داخل نافذة عرض البرومبت المفتوحة.</p>
            </div>

            {/* 4. Sticky Bottom Slot */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">شريط إعلاني عائم أسفل الصفحة</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">Sticky Bottom</span>
              </div>
              <input
                type="text"
                value={adSense.stickyBottomSlot || ''}
                onChange={(e) => setAdSense({ ...adSense, stickyBottomSlot: e.target.value })}
                placeholder="Slot ID e.g. 4567890123"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
              <p className="text-[10px] text-slate-500">شريط سفلي ثابت متجاوب يحقق أعلى معدل نقرات.</p>
            </div>

            {/* 5. Sidebar Slot */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">إعلان جانبي (Sidebar / Square)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">300x250</span>
              </div>
              <input
                type="text"
                value={adSense.sidebarSlot || ''}
                onChange={(e) => setAdSense({ ...adSense, sidebarSlot: e.target.value })}
                placeholder="Slot ID e.g. 5678901234"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
              <p className="text-[10px] text-slate-500">وحدة إعلانية مربعة مناسبة للأجهزة اللوحية والمقالات.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>حفظ إعدادات AdSense</span>
          </button>
        </div>
      </div>
    </div>
  );
};
