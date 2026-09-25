'use client';

import React from 'react';
import { PixelSettings } from '@/types';
import { Activity, Save } from 'lucide-react';

interface AdminPixelsSectionProps {
  pixels: PixelSettings;
  setPixels: React.Dispatch<React.SetStateAction<PixelSettings>>;
  saving: boolean;
  onSave: () => void;
}

export const AdminPixelsSection: React.FC<AdminPixelsSectionProps> = ({
  pixels,
  setPixels,
  saving,
  onSave
}) => {
  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span>بكسلات التتبع الإعلاني لكافة منصات التواصل والتسويق</span>
          </h3>
          <p className="text-xs text-slate-500">
            يتم إطلاق أحداث التحويل المخصصة تلقائياً لجميع المنصات المفعلة: PageView, ViewContent, CopyPrompt, Search, RatingReview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Meta (Facebook / Instagram) Pixel */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  f
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Meta (Facebook & Instagram) Pixel</span>
                  <span className="text-[10px] text-slate-500">تتبع الحملات الإعلانية على فيسبوك وإنستغرام</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pixels.metaPixelEnabled}
                onChange={(e) => setPixels({ ...pixels, metaPixelEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">معرّف البكسل (Pixel ID):</label>
              <input
                type="text"
                value={pixels.metaPixelId || ''}
                onChange={(e) => setPixels({ ...pixels, metaPixelId: e.target.value })}
                placeholder="مثال: 1234567890123456"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
            </div>
          </div>

          {/* 2. Google Analytics 4 (GA4) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center text-xs">
                  G
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Google Analytics 4 (GA4) / GTag</span>
                  <span className="text-[10px] text-slate-500">تتبع إحصائيات جوجل ومسارات التحويل المتقدمة</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pixels.ga4Enabled}
                onChange={(e) => setPixels({ ...pixels, ga4Enabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">معرّف القياس (Measurement ID):</label>
              <input
                type="text"
                value={pixels.ga4MeasurementId || ''}
                onChange={(e) => setPixels({ ...pixels, ga4MeasurementId: e.target.value })}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
            </div>
          </div>

          {/* 3. TikTok Pixel */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-black text-white font-bold flex items-center justify-center text-xs">
                  TT
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">TikTok Pixel</span>
                  <span className="text-[10px] text-slate-500">تتبع إعلانات تيك توك ومعدلات التفاعل</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pixels.tiktokPixelEnabled}
                onChange={(e) => setPixels({ ...pixels, tiktokPixelEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">معرّف تيك توك بكسل (Pixel ID):</label>
              <input
                type="text"
                value={pixels.tiktokPixelId || ''}
                onChange={(e) => setPixels({ ...pixels, tiktokPixelId: e.target.value })}
                placeholder="مثال: C6ABCD1234EF5678"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
            </div>
          </div>

          {/* 4. Snapchat Pixel */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-yellow-400 text-black font-bold flex items-center justify-center text-xs">
                  👻
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Snapchat Pixel</span>
                  <span className="text-[10px] text-slate-500">تتبع إعلانات سناب شات وحملات الخليج العربي</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pixels.snapchatPixelEnabled}
                onChange={(e) => setPixels({ ...pixels, snapchatPixelEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">معرّف سناب شات بكسل (Pixel ID):</label>
              <input
                type="text"
                value={pixels.snapchatPixelId || ''}
                onChange={(e) => setPixels({ ...pixels, snapchatPixelId: e.target.value })}
                placeholder="مثال: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
            </div>
          </div>

          {/* 5. Twitter (X) Pixel */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                  𝕏
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Twitter / X Ads Pixel</span>
                  <span className="text-[10px] text-slate-500">تتبع إعلانات منصة X وتغريدات الترويج</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={pixels.twitterPixelEnabled}
                onChange={(e) => setPixels({ ...pixels, twitterPixelEnabled: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">معرّف بكسل تويتر (Pixel ID):</label>
              <input
                type="text"
                value={pixels.twitterPixelId || ''}
                onChange={(e) => setPixels({ ...pixels, twitterPixelId: e.target.value })}
                placeholder="مثال: o1234"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
            </div>
          </div>

          {/* 6. Pinterest Tag & LinkedIn */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                  P
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Pinterest Tag & LinkedIn</span>
                  <span className="text-[10px] text-slate-500">تتبع إعلانات بنترست ولينكد إن</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-slate-500">Pinterest:</label>
                <input
                  type="checkbox"
                  checked={pixels.pinterestTagEnabled}
                  onChange={(e) => setPixels({ ...pixels, pinterestTagEnabled: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Pinterest Tag ID:</label>
              <input
                type="text"
                value={pixels.pinterestTagId || ''}
                onChange={(e) => setPixels({ ...pixels, pinterestTagId: e.target.value })}
                placeholder="مثال: 2612345678901"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
              />
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
            <span>حفظ إعدادات البكسل</span>
          </button>
        </div>
      </div>
    </div>
  );
};
