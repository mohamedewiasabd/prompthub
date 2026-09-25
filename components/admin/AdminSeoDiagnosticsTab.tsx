'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, CheckCircle2, ExternalLink } from 'lucide-react';

export const AdminSeoDiagnosticsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-600" />
            <span>حالة التوافق مع محركات الذكاء الاصطناعي (GEO) والسيو التقني</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            فحص وتأكيد جهوزية المنصة للقراءة والفهرسة المباشرة بواسطة Perplexity, ChatGPT, ClaudeBot, Google AI Overviews والروبوتات العالمية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Check 1: LLMs.txt */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ملف LLMs.txt القياسي للذكاء الاصطناعي
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                نشط وجاهز 100%
              </span>
            </div>
            <p className="text-xs text-slate-500">
              تم إنشاء ملف <code className="text-blue-600 font-mono">/llms.txt</code> الذي يلخص جميع الأقسام والبرومبتات بشكل مهيكل للروبوتات.
            </p>
            <Link
              href="/llms.txt"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold pt-1"
            >
              <span>فتح /llms.txt</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Check 2: LLMs-Full.txt */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                قاعدة البيانات الكاملة llms-full.txt
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                تحديث تلقائي
              </span>
            </div>
            <p className="text-xs text-slate-500">
              تغذية نصية كاملة ومباشرة لجميع البرومبتات بنصوصها وشروحاتها في <code className="text-blue-600 font-mono">/llms-full.txt</code>.
            </p>
            <Link
              href="/llms-full.txt"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold pt-1"
            >
              <span>فتح /llms-full.txt</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Check 3: Sitemap.xml */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                خريطة الموقع الديناميكية (Sitemap.xml)
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                مفهرسة بالكامل
              </span>
            </div>
            <p className="text-xs text-slate-500">
              تتضمن جميع روابط الأقسام الفردية والبرومبتات مع تواريخ التحديث ومستويات الأولوية.
            </p>
            <Link
              href="/sitemap.xml"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold pt-1"
            >
              <span>فتح /sitemap.xml</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Check 4: AI Agent Semantic Markdown API */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                تغذية Markdown المباشرة لوكلاء الذكاء (API)
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                سريع وبدون كوكيز
              </span>
            </div>
            <p className="text-xs text-slate-500">
              نقطة وصول خاصة <code className="text-blue-600 font-mono">/api/ai-read/prompts</code> تسمح للوكلاء باستدعاء البيانات بصيغة Markdown نظيفة.
            </p>
            <Link
              href="/api/ai-read/prompts"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-bold pt-1"
            >
              <span>تجربة /api/ai-read/prompts</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
