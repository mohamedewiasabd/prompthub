'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TECHNIQUES } from '@/lib/seed-techniques';
import { Brain, ArrowLeft } from 'lucide-react';

const DIFFICULTY_COLOR: Record<string, string> = {
  'مبتدئ': 'bg-green-100 text-green-700',
  'متوسط': 'bg-amber-100 text-amber-700',
  'متقدم': 'bg-red-100 text-red-700',
};

export default function LearnPage() {
  const grouped = TECHNIQUES.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<string, typeof TECHNIQUES>);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" dir="rtl">
      <Header categories={[]} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            دليل تقنيات البرمجة (Prompt Engineering)
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            تعلّم كيف تكتب برومبتات احترافية: من الأساسيات إلى التقنيات المتقدمة التي تُحدث فرقاً حقيقياً في جودة النتائج.
          </p>
        </div>

        {Object.entries(grouped).map(([category, techniques]) => (
          <section key={category} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {techniques.map(tech => (
                <Link key={tech.id} href={`/learn/${tech.slug}`}>
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                          <Brain className="w-4 h-4" />
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${DIFFICULTY_COLOR[tech.difficulty]}`}>
                          {tech.difficulty}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
                      {tech.name}
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">{tech.nameEn}</span>

                    <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-2">
                      {tech.description}
                    </p>

                    <div className="mt-3 flex items-center gap-1 text-xs text-blue-600 font-semibold group-hover:gap-2 transition-all">
                      اقرأ الدليل
                      <ArrowLeft className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer categories={[]} />
    </div>
  );
}
