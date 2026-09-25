'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AI_MODELS } from '@/lib/seed-ai-models';
import { CheckCircle, XCircle, Star, Lightbulb, ExternalLink, ArrowRight } from 'lucide-react';

export default function ModelDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const model = AI_MODELS.find(m => m.slug === slug);

  if (!model) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50" dir="rtl">
        <Header categories={[]} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-slate-900">النموذج غير موجود</h1>
            <Link href="/models" className="text-blue-600 hover:underline">
              العودة لدليل النماذج
            </Link>
          </div>
        </main>
        <Footer categories={[]} />
      </div>
    );
  }

  const related = AI_MODELS.filter(m => m.category === model.category && m.id !== model.id).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50" dir="rtl">
      <Header categories={[]} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/models" className="hover:text-blue-600">دليل النماذج</Link>
          <ArrowRight className="w-3 h-3" />
          <span className="text-slate-900 font-semibold">{model.name}</span>
        </nav>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{model.logo}</span>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{model.name}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                <span>{model.company}</span>
                {model.version && <span className="px-2 py-0.5 bg-slate-100 rounded-full text-xs font-medium">v{model.version}</span>}
                {model.releasedDate && <span>{model.releasedDate}</span>}
              </div>
            </div>
            <a
              href={model.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              الموقع الرسمي
            </a>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-slate-700 leading-relaxed">{model.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">التكلفة</span>
              <p className="font-semibold text-slate-900 mt-1">{model.pricingDetails}</p>
            </div>
            {model.contextWindow && (
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500 font-medium">السياق الأقصى</span>
                <p className="font-semibold text-slate-900 mt-1">{model.contextWindow}</p>
              </div>
            )}
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-xs text-slate-500 font-medium">اللغات المدعومة</span>
              <p className="font-semibold text-slate-900 mt-1">{model.languages.join('، ')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-emerald-700">
              <CheckCircle className="w-5 h-5" />
              نقاط القوة
            </h2>
            <ul className="space-y-2">
              {model.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-lg font-bold text-red-700">
              <XCircle className="w-5 h-5" />
              نقاط الضعف
            </h2>
            <ul className="space-y-2">
              {model.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-red-500 mt-0.5">✗</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-blue-700">
            <Star className="w-5 h-5" />
            الأفضل لـ
          </h2>
          <div className="flex flex-wrap gap-2">
            {model.bestFor.map((use, i) => (
              <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {use}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-purple-700">
            ⚡ الميزات الخاصة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {model.features.map((f, i) => (
              <div key={i} className="p-3 bg-purple-50 rounded-xl">
                <h4 className="font-bold text-purple-900 text-sm">{f.nameAr}</h4>
                <span className="text-xs text-purple-600 font-mono">{f.name}</span>
                <p className="text-xs text-slate-600 mt-1">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-amber-800">
            <Lightbulb className="w-5 h-5" />
            نصائح الاستخدام
          </h2>
          <ol className="space-y-2">
            {model.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="font-bold text-amber-600">{i + 1}.</span>
                {tip}
              </li>
            ))}
          </ol>
        </div>

        {related.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">نماذج ذات صلة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(r => (
                <Link key={r.id} href={`/models/${r.slug}`}>
                  <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all cursor-pointer">
                    <span className="text-2xl">{r.logo}</span>
                    <h3 className="font-bold text-sm text-slate-900 mt-2">{r.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{r.description}</p>
                  </div>
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
