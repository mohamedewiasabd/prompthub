'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TECHNIQUES } from '@/lib/seed-techniques';
import { ArrowRight, Lightbulb, BookOpen, CheckCircle } from 'lucide-react';

const DIFFICULTY_COLOR: Record<string, string> = {
  'مبتدئ': 'bg-green-100 text-green-700',
  'متوسط': 'bg-amber-100 text-amber-700',
  'متقدم': 'bg-red-100 text-red-700',
};

export default function TechniqueDetailPage() {
  const params = useParams();
  const slug = params?.technique as string;
  const tech = TECHNIQUES.find(t => t.slug === slug);

  if (!tech) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50" dir="rtl">
        <Header categories={[]} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">التقنية غير موجودة</h1>
            <Link href="/learn" className="text-blue-600 hover:underline">العودة للدروس</Link>
          </div>
        </main>
        <Footer categories={[]} />
      </div>
    );
  }

  const related = TECHNIQUES.filter(t => tech.relatedSlugs.includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50" dir="rtl">
      <Header categories={[]} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/learn" className="hover:text-blue-600">الدروس</Link>
          <ArrowRight className="w-3 h-3" />
          <span className="text-slate-900 font-semibold">{tech.name}</span>
        </nav>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${DIFFICULTY_COLOR[tech.difficulty]}`}>
              {tech.difficulty}
            </span>
            <span className="text-xs text-slate-500">{tech.category}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{tech.name}</h1>
          <span className="text-sm text-slate-500 font-mono">{tech.nameEn}</span>

          <p className="text-sm text-slate-700 leading-relaxed">{tech.description}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <BookOpen className="w-5 h-5 text-blue-600" />
            الشرح الكامل
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">{tech.fullDescription}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">متى تستخدم هذه التقنية؟</h2>
          <ul className="space-y-2">
            {tech.whenToUse.map((use, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {use}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 space-y-4">
          <h2 className="text-lg font-bold text-blue-900">كيف تعمل؟</h2>
          <p className="text-sm text-blue-800 leading-relaxed">{tech.howItWorks}</p>
        </div>

        {tech.examples.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">أمثلة عملية</h2>
            {tech.examples.map((ex, i) => (
              <div key={i} className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900">{ex.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-red-50 rounded-xl">
                    <span className="text-[10px] font-bold text-red-600 uppercase">بدون التقنية</span>
                    <p className="text-xs text-slate-700 mt-1 font-mono leading-relaxed">{ex.before}</p>
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">مع التقنية</span>
                    <p className="text-xs text-slate-700 mt-1 font-mono leading-relaxed whitespace-pre-wrap">{ex.after}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">{ex.explanation}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-amber-800">
            <Lightbulb className="w-5 h-5" />
            نصائح متقدمة
          </h2>
          <ol className="space-y-2">
            {tech.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="font-bold text-amber-600">{i + 1}.</span>
                {tip}
              </li>
            ))}
          </ol>
        </div>

        {related.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">تقنيات ذات صلة</h2>
            <div className="flex flex-wrap gap-2">
              {related.map(r => (
                <Link key={r.id} href={`/learn/${r.slug}`}>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors cursor-pointer">
                    {r.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer categories={[]} />
    </div>
  );
}
