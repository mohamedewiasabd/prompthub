'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Sliders, Star } from 'lucide-react';

export const HomeHeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-12 text-center shadow-xs">
      <div className="relative z-10 max-w-3xl mx-auto space-y-5">
        {/* Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>أكبر مكتبة عربية تفاعلية لأوامر وبرومبتات الذكاء الاصطناعي</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          برومبتات احترافية ومجانية لكل شيء
          <span className="block text-blue-600 mt-1">
            مع محرر متغيرات وتقييمات حية
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
          اكتشف مئات الأوامر المصاغة بأحدث إطارات هندسة البرومبتات (Prompt Engineering) لـ ChatGPT، Claude، Midjourney، Gemini، وDeepSeek. نسخ فوري وتخصيص للمتغيرات بدون تسجيل دخول.
        </p>

        {/* Highlights badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-700 pt-2 font-medium">
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            مجاني 100% بدون اشتراك
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Sliders className="w-4 h-4 text-indigo-600" />
            محرر متغيرات مباشر
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            تقييمات وآراء المستخدمين
          </span>
        </div>
      </div>
    </section>
  );
};
