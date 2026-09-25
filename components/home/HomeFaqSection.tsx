'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';

export const HomeFaqSection: React.FC = () => {
  return (
    <section className="mt-16 pt-12 border-t border-slate-200 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <span>الأسئلة الشائعة حول برومبتات الذكاء الاصطناعي</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          كل ما تحتاج معرفته عن استخدام وتخصيص أوامر الذكاء الاصطناعي وتقييمها
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900">هل الموقع مجاني حقاً وبدون تسجيل دخول؟</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            نعم، 100% من الأوامر والبرومبتات والتقييمات متاحة للجمهور مجاناً وبدون الحاجة لإنشاء أي حساب أو إدخال بيانات شخصية.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900">كيف يعمل نظام تقييم وتعليقات البرومبتات؟</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            يمكن لأي مستخدم تقييم البرومبت من 1 إلى 5 نجوم وكتابة تعليق حول تجربته أو النتائج التي حصل عليها لمساعدة بقية المستخدمين.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900">ما هي ميزة «محرر المتغيرات الذكي»؟</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            تتيح لك تعبئة الحقول مثل [الموضوع] و[الجمهور] مباشرة داخل الموقع، ليتم توليد الأمر النهائي جاهزاً بنقرة واحدة.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-2xs">
          <h3 className="font-bold text-sm text-slate-900">كيف تدعم المنصة محركات الذكاء الاصطناعي والروبوتات؟</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            المنصة مزودة بملف <code className="text-blue-600 bg-blue-50 px-1 py-0.5 rounded font-mono">llms.txt</code> القياسي وبيانات Schema.org وSemantic Markdown لتمكين أنظمة الذكاء الاصطناعي مثل Perplexity وChatGPT من قراءتها وفهرستها بدقة.
          </p>
        </div>
      </div>
    </section>
  );
};
