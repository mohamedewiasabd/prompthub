'use client';

import React, { useState, useEffect } from 'react';
import { AdSenseSettings, PixelSettings } from '@/types';
import {
  DollarSign,
  Activity,
  Save,
  Radio,
  Code2
} from 'lucide-react';
import { trackPixelEvent } from '@/lib/pixel';
import { AdminAdSenseSection } from './adsense/AdminAdSenseSection';
import { AdminPixelsSection } from './adsense/AdminPixelsSection';
import { AdminCustomScriptsSection } from './adsense/AdminCustomScriptsSection';

interface AdminAdSenseAndPixelsProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export function AdminAdSenseAndPixels({ onShowToast }: AdminAdSenseAndPixelsProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // AdSense state
  const [adSense, setAdSense] = useState<AdSenseSettings>({
    enabled: true,
    publisherId: 'ca-pub-6559329089674801',
    autoAds: true,
    headerSlot: '1000000001',
    feedSlot: '1000000002',
    modalSlot: '1000000003',
    sidebarSlot: '1000000004',
    stickyBottomSlot: '1000000005',
    testMode: false
  });

  // Pixels state
  const [pixels, setPixels] = useState<PixelSettings>({
    metaPixelId: '',
    metaPixelEnabled: false,
    ga4MeasurementId: '',
    ga4Enabled: false,
    tiktokPixelId: '',
    tiktokPixelEnabled: false,
    snapchatPixelId: '',
    snapchatPixelEnabled: false,
    twitterPixelId: '',
    twitterPixelEnabled: false,
    pinterestTagId: '',
    pinterestTagEnabled: false,
    linkedInPartnerId: '',
    linkedInEnabled: false,
    customHeadScript: '',
    customBodyScript: ''
  });

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'adsense' | 'pixels' | 'custom-scripts'>('adsense');

  // Load existing configuration
  useEffect(() => {
    let ignore = false;
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (!ignore && data.success) {
          if (data.adSense) setAdSense(data.adSense);
          if (data.pixel) setPixels(data.pixel);
        }
      })
      .catch((err) => {
        console.error('Error fetching settings:', err);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const token = typeof window !== 'undefined' ? (localStorage.getItem('ph_admin_token') || sessionStorage.getItem('ph_admin_token') || '') : '';
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}`, 'x-admin-token': token } : {})
        },
        credentials: 'include',
        body: JSON.stringify({
          adSense,
          pixel: pixels
        })
      });
      const data = await res.json();
      if (data.success) {
        onShowToast('success', 'تم حفظ إعدادات الإعلانات والبكسل بنجاح!', 'تم تطبيق التحديثات على المنصة فورياً');
        if (data.adSense) setAdSense(data.adSense);
        if (data.pixel) setPixels(data.pixel);
      } else {
        onShowToast('error', 'فشل الحفظ', data.error);
      }
    } catch (err: any) {
      onShowToast('error', 'خطأ أثناء الحفظ', err.message);
    } finally {
      setSaving(false);
    }
  };

  const testTriggerPixels = () => {
    trackPixelEvent('PageView', { test: true });
    trackPixelEvent('CopyPrompt', {
      content_name: 'تجربة بكسل التتبع',
      content_category: 'test'
    });
    onShowToast('info', 'تم إطلاق أحداث تجريبية للبكسلات!', 'افتح أدوات المطور (DevTools) أو ملحقات Pixel Helper للتحقق');
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">جاري تحميل إعدادات أدسنس والبكسل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner Overview */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
              <DollarSign className="w-3.5 h-3.5 text-blue-400" />
              <span>الربح المالي والتسويق الرقمي الشامل</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              إدارة إعلانات Google AdSense وبكسلات التتبع الإعلاني
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              تحكم كامل في تفعيل كود أدسنس ومواضع الإعلانات المتجاوبة (Header, In-Feed, Modal, Sticky) وتفعيل بكسلات جميع المنصات الإعلانية (Meta, GA4, TikTok, Snapchat, Twitter, Pinterest).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={testTriggerPixels}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>فحص إطلاق البكسل</span>
            </button>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/30 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>حفظ التغييرات</span>
            </button>
          </div>
        </div>

        {/* Quick status counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 relative z-10 text-right">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-400 block font-medium">حالة Google AdSense:</span>
            <span className={`text-xs font-bold mt-0.5 inline-flex items-center gap-1 ${adSense.enabled ? 'text-emerald-400' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${adSense.enabled ? 'bg-emerald-400' : 'bg-slate-400'}`} />
              {adSense.enabled ? (adSense.testMode ? 'مفعل (وضع المعاينة)' : 'مفعل (نشر حي)') : 'معطل'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-400 block font-medium">Meta (Facebook) Pixel:</span>
            <span className={`text-xs font-bold mt-0.5 inline-flex items-center gap-1 ${pixels.metaPixelEnabled && pixels.metaPixelId ? 'text-blue-400' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${pixels.metaPixelEnabled && pixels.metaPixelId ? 'bg-blue-400' : 'bg-slate-400'}`} />
              {pixels.metaPixelEnabled && pixels.metaPixelId ? 'متصل' : 'غير متصل'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-400 block font-medium">Google Analytics 4:</span>
            <span className={`text-xs font-bold mt-0.5 inline-flex items-center gap-1 ${pixels.ga4Enabled && pixels.ga4MeasurementId ? 'text-amber-400' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full ${pixels.ga4Enabled && pixels.ga4MeasurementId ? 'bg-amber-400' : 'bg-slate-400'}`} />
              {pixels.ga4Enabled && pixels.ga4MeasurementId ? 'متصل (GA4)' : 'غير متصل'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] text-slate-400 block font-medium">بكسلات التواصل الأخرى:</span>
            <span className="text-xs font-bold text-indigo-300 mt-0.5 block">
              {[pixels.tiktokPixelEnabled, pixels.snapchatPixelEnabled, pixels.twitterPixelEnabled, pixels.pinterestTagEnabled, pixels.linkedInEnabled].filter(Boolean).length} منصات نشطة
            </span>
          </div>
        </div>
      </div>

      {/* Sub tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('adsense')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'adsense'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>إعدادات Google AdSense والمواضع</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pixels')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'pixels'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>بكسلات التتبع (Meta, GA4, TikTok, Snap, X)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('custom-scripts')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
            activeSubTab === 'custom-scripts'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>أكواد الهيدر المخصصة (Custom Scripts)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SUB TAB 1: ADSENSE SETTINGS                              */}
      {/* ======================================================== */}
      {activeSubTab === 'adsense' && (
        <AdminAdSenseSection
          adSense={adSense}
          setAdSense={setAdSense}
          saving={saving}
          onSave={handleSaveSettings}
        />
      )}

      {/* ======================================================== */}
      {/* SUB TAB 2: PIXELS (META, GA4, TIKTOK, SNAP, X, PIN, LI)  */}
      {/* ======================================================== */}
      {activeSubTab === 'pixels' && (
        <AdminPixelsSection
          pixels={pixels}
          setPixels={setPixels}
          saving={saving}
          onSave={handleSaveSettings}
        />
      )}

      {/* ======================================================== */}
      {/* SUB TAB 3: CUSTOM HEAD SCRIPTS (CLARITY, HOTJAR, GTM)    */}
      {/* ======================================================== */}
      {activeSubTab === 'custom-scripts' && (
        <AdminCustomScriptsSection
          pixels={pixels}
          setPixels={setPixels}
          saving={saving}
          onSave={handleSaveSettings}
        />
      )}

    </div>
  );
}
