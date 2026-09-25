'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MODEL_COMPARISONS, AI_MODELS } from '@/lib/seed-ai-models';
import { ArrowRight, Trophy, Scale } from 'lucide-react';

export default function ComparePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" dir="rtl">
      <Header categories={[]} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            مقارنة نماذج الذكاء الاصطناعي
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            مقارنات تفصيلية بين أقوى نماذج الذكاء الاصطناعي في مختلف المجالات.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MODEL_COMPARISONS.map(comp => {
            const modelA = AI_MODELS.find(m => m.id === comp.modelA);
            const modelB = AI_MODELS.find(m => m.id === comp.modelB);
            const modelC = comp.modelC ? AI_MODELS.find(m => m.id === comp.modelC) : null;

            return (
              <Link key={comp.id} href={`/compare/${comp.slug}`}>
                <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <Scale className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {comp.category}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                    {comp.title}
                  </h2>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{modelA?.logo}</span>
                      <span className="text-sm font-semibold">{modelA?.name}</span>
                    </div>
                    <span className="text-slate-400 font-bold">vs</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{modelB?.logo}</span>
                      <span className="text-sm font-semibold">{modelB?.name}</span>
                    </div>
                    {modelC && (
                      <>
                        <span className="text-slate-400 font-bold">vs</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{modelC.logo}</span>
                          <span className="text-sm font-semibold">{modelC.name}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                    {comp.description}
                  </p>

                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <Trophy className="w-4 h-4" />
                      <span className="text-xs font-bold">النتيجة: </span>
                    </div>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed">{comp.verdict}</p>
                  </div>

                  <div className="mt-3 text-xs text-slate-500">
                    {comp.criteria.length} معايير مقارنة
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer categories={[]} />
    </div>
  );
}
