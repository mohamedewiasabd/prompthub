'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MODEL_COMPARISONS, AI_MODELS } from '@/lib/seed-ai-models';
import { Trophy, ArrowRight, CheckCircle } from 'lucide-react';

export default function ComparisonDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const comparison = MODEL_COMPARISONS.find(c => c.slug === slug);

  if (!comparison) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50" dir="rtl">
        <Header categories={[]} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">المقارنة غير موجودة</h1>
            <Link href="/compare" className="text-blue-600 hover:underline">العودة للمقارنات</Link>
          </div>
        </main>
        <Footer categories={[]} />
      </div>
    );
  }

  const modelA = AI_MODELS.find(m => m.id === comparison.modelA);
  const modelB = AI_MODELS.find(m => m.id === comparison.modelB);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50" dir="rtl">
      <Header categories={[]} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/compare" className="hover:text-blue-600">المقارنات</Link>
          <ArrowRight className="w-3 h-3" />
          <span className="text-slate-900 font-semibold">{comparison.title}</span>
        </nav>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {comparison.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{comparison.title}</h1>
            <p className="text-sm text-slate-600">{comparison.description}</p>
          </div>

          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <span className="text-4xl">{modelA?.logo}</span>
              <h3 className="font-bold text-sm mt-2">{modelA?.name}</h3>
            </div>
            <span className="text-2xl font-bold text-slate-300">VS</span>
            <div className="text-center">
              <span className="text-4xl">{modelB?.logo}</span>
              <h3 className="font-bold text-sm mt-2">{modelB?.name}</h3>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">تفاصيل المقارنة</h2>
          {comparison.criteria.map((c, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{c.nameAr}</h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {AI_MODELS.find(m => m.id === c.winner)?.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(c.scores).map(([modelId, score]) => {
                  const m = AI_MODELS.find(mod => mod.id === modelId);
                  return (
                    <div key={modelId} className={`p-3 rounded-xl ${modelId === c.winner ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-slate-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{m?.logo}</span>
                        <span className="text-xs font-semibold">{m?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${modelId === c.winner ? 'bg-emerald-500' : 'bg-slate-400'}`}
                            style={{ width: `${(score / 10) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold">{score}/10</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{c.explanation}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-6 space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-800">
            <CheckCircle className="w-5 h-5" />
            الخلاصة
          </h2>
          <p className="text-sm text-emerald-900 leading-relaxed">{comparison.verdict}</p>
        </div>
      </main>

      <Footer categories={[]} />
    </div>
  );
}
