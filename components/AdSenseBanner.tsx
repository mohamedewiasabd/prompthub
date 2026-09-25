'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AdSenseSettings } from '@/types';
import { Sparkles, X } from 'lucide-react';

interface AdSenseBannerProps {
  placement: 'header' | 'feed' | 'modal' | 'sidebar' | 'sticky-bottom';
  className?: string;
  customSlot?: string;
}

const DEFAULT_PLACEHOLDER_SLOTS = ['1000000001', '1000000002', '1000000003', '1000000004', '1000000005'];

function isConfigured(slot?: string): boolean {
  if (!slot) return false;
  const s = slot.trim();
  return s.length > 0 && !DEFAULT_PLACEHOLDER_SLOTS.includes(s);
}

function isPlaceholderPublisher(pubId?: string): boolean {
  return !pubId || pubId.includes('00000000') || pubId.trim() === '';
}

export function AdSenseBanner({ placement, className = '', customSlot }: AdSenseBannerProps) {
  const [adSettings, setAdSettings] = useState<AdSenseSettings | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [adError, setAdError] = useState(false);
  // number of render attempts; used to gracefully stop hammering adsbygoogle after failures
  const attemptRef = useRef(0);
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.adSense) {
          setAdSettings(data.adSense);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkScript = () => {
      // @ts-expect-error Google adsbygoogle array
      if (window.adsbygoogle) {
        setScriptLoaded(true);
        return;
      }
      const scriptEl = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
      if (scriptEl) {
        scriptEl.addEventListener('load', () => setScriptLoaded(true));
        scriptEl.addEventListener('error', () => setAdError(true));
        return;
      }
      setTimeout(checkScript, 300);
    };
    checkScript();
  }, []);

  const publisherId = adSettings?.publisherId || '';
  let slotId = customSlot || '';
  if (!slotId && adSettings) {
    if (placement === 'header') slotId = adSettings.headerSlot || '';
    else if (placement === 'feed') slotId = adSettings.feedSlot || '';
    else if (placement === 'modal') slotId = adSettings.modalSlot || '';
    else if (placement === 'sidebar') slotId = adSettings.sidebarSlot || '';
    else if (placement === 'sticky-bottom') slotId = adSettings.stickyBottomSlot || '';
  }

  const isEnabled = adSettings ? adSettings.enabled : true;
  const isTestMode = adSettings ? adSettings.testMode : true;
  const slotConfigured = isConfigured(slotId);
  const publisherConfigured = !isPlaceholderPublisher(publisherId);
  const readyForRealAd = isEnabled && !isTestMode && slotConfigured && publisherConfigured;

  const pushAd = useCallback(() => {
    if (!readyForRealAd || !scriptLoaded || adError) return;
    if (typeof window === 'undefined') return;
    if (attemptRef.current >= 3) {
      setAdError(true);
      return;
    }
    attemptRef.current += 1;
    try {
      // @ts-expect-error Google adsbygoogle array
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.debug('AdSense push error:', e);
      setAdError(true);
    }
  }, [readyForRealAd, scriptLoaded, adError]);

  useEffect(() => {
    if (scriptLoaded && readyForRealAd) {
      pushAd();
    }
  }, [scriptLoaded, readyForRealAd, pushAd]);

  useEffect(() => {
    if (!adRef.current || !readyForRealAd || !scriptLoaded || adError) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pushAd();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(adRef.current);
    return () => observer.disconnect();
  }, [readyForRealAd, scriptLoaded, adError, pushAd]);

  if (!isEnabled || isDismissed) {
    return null;
  }

  const showConfigurePrompt = !slotConfigured || !publisherConfigured;

  // Sticky Bottom Placement
  if (placement === 'sticky-bottom') {
    return (
      <div className="adsense-bottom-slot fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-2 sm:p-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden">
            {isTestMode || showConfigurePrompt ? (
              <div className="h-14 sm:h-16 rounded-xl bg-linear-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/80 flex items-center px-4 text-slate-700">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                    Google AdSense
                  </span>
                  <span className="font-medium text-slate-600 hidden sm:inline">
                    {showConfigurePrompt ? 'أدخل رقم الوحدة الإعلانية من لوحة التحكم' : 'شريط إعلاني متجاوب أسفل الصفحة'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-blue-800 bg-white/80 px-2 py-1 rounded-md border border-blue-100">
                  Slot: {slotId || 'غير محدد'}
                </span>
              </div>
            ) : (
              <div ref={adRef}>
                <ins
                  className="adsbygoogle block"
                  style={{ display: 'block', height: '60px' }}
                  data-ad-client={publisherId}
                  data-ad-slot={slotId}
                  data-ad-format="horizontal"
                  data-full-width-responsive="true"
                />
              </div>
            )}
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            title="إغلاق الإعلان"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Feed Card In-Grid Placement
  if (placement === 'feed') {
    return (
      <div className={`col-span-1 md:col-span-2 lg:col-span-3 my-4 ${className}`}>
        <div className="p-4 sm:p-6 rounded-3xl bg-linear-to-br from-slate-50 to-blue-50/40 border border-blue-100 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span>إعلان مخصص</span>
              <span className="text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.2 rounded">AdSense In-Feed</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Google Sponsored</span>
          </div>

          {isTestMode || showConfigurePrompt ? (
            <div className="py-8 px-4 rounded-2xl bg-white/80 border border-dashed border-blue-200 text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>موضع إعلاني مدمج بين البرومبتات (In-Feed Ad Unit)</span>
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {showConfigurePrompt
                  ? 'ضع رقم الوحدة الإعلانية (Ad Slot) لهذا الموضع من لوحة التحكم ليظهر الإعلان هنا.'
                  : 'يظهر هذا الإعلان بطريقة متناسقة وسلسة بين بطاقات البرومبتات.'}
              </p>
            </div>
          ) : (
            <div ref={adRef}>
              <ins
                className="adsbygoogle block"
                style={{ display: 'block', textAlign: 'center' }}
                data-ad-layout="in-article"
                data-ad-format="fluid"
                data-ad-client={publisherId}
                data-ad-slot={slotId}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Modal Inside Prompt Details Placement
  if (placement === 'modal') {
    return (
      <div className={`my-4 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 ${className}`}>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] font-bold text-slate-400">إعلان ممول (Google Ads)</span>
          <span className="text-[10px] text-slate-400">Sponsored</span>
        </div>
        {isTestMode || showConfigurePrompt ? (
          <div className="py-4 px-3 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-600 font-medium">
            {showConfigurePrompt
              ? 'أدخل رقم الوحدة الإعلانية لهذا الموضع من لوحة التحكم'
              : 'مساحة إعلانية داخل نافذة تفاصيل البرومبت'}
          </div>
        ) : (
          <div ref={adRef}>
            <ins
              className="adsbygoogle block"
              style={{ display: 'block', textAlign: 'center' }}
              data-ad-layout="in-article"
              data-ad-format="fluid"
              data-ad-client={publisherId}
              data-ad-slot={slotId}
            />
          </div>
        )}
      </div>
    );
  }

  // Header / Top Banner Placement (Leaderboard)
  return (
    <div className={`w-full max-w-5xl mx-auto my-6 px-4 ${className}`}>
      <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2 text-[10px] text-slate-400 font-medium px-1">
          <span>إعلان</span>
          <span className="font-mono text-slate-400">AdSense Leaderboard</span>
        </div>
        {isTestMode || showConfigurePrompt ? (
          <div className="h-20 sm:h-24 rounded-xl bg-linear-to-r from-slate-50 to-blue-50/50 border border-slate-200/80 flex items-center justify-center text-center p-3">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 block">
                مساحة إعلانية رئيسية في أعلى الموقع (Leaderboard 728x90 / Responsive)
              </span>
              <span className="text-[11px] text-slate-500 block">
                {showConfigurePrompt
                  ? 'أدخل رقم الوحدة الإعلانية (Leaderboard Slot) من لوحة التحكم ليظهر الإعلان هنا.'
                  : 'وضع المعاينة متاح من لوحة التحكم.'}
              </span>
            </div>
          </div>
        ) : (
          <div ref={adRef}>
            <ins
              className="adsbygoogle block text-center"
              style={{ display: 'block' }}
              data-ad-client={publisherId}
              data-ad-slot={slotId}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        )}
      </div>
    </div>
  );
}
