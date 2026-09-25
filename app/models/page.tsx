'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AI_MODELS } from '@/lib/seed-ai-models';
import { AIModel } from '@/types/ai-models';
import {
  Search, Filter, ExternalLink, Star, Zap, Image, Video, Music, Code, Layers, Brain
} from 'lucide-react';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'الكل', icon: Layers },
  { id: 'text', label: 'نصوص', icon: Brain },
  { id: 'multimodal', label: 'متعدد الوسائط', icon: Zap },
  { id: 'image', label: 'صور', icon: Image },
  { id: 'video', label: 'فيديو', icon: Video },
  { id: 'audio', label: 'صوت', icon: Music },
  { id: 'code', label: 'برمجة', icon: Code },
];

const PRICING_FILTERS = [
  { id: 'all', label: 'الكل' },
  { id: 'free', label: 'مجاني' },
  { id: 'freemium', label: 'مجاني جزئياً' },
  { id: 'paid', label: 'مدفوع' },
  { id: 'open-source', label: 'مفتوح المصدر' },
];

export default function ModelsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [pricing, setPricing] = useState('all');

  const filtered = useMemo(() => {
    let result = [...AI_MODELS];
    if (category !== 'all') result = result.filter(m => m.category === category);
    if (pricing !== 'all') result = result.filter(m => m.pricing === pricing);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.nameEn.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, category, pricing]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" dir="rtl">
      <Header categories={[]} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            دليل نماذج الذكاء الاصطناعي
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            شرح شامل لكل نموذج ذكاء اصطناعي: مميزاته، عيوبه، أفضل استخداماته، ومقارنة بينها.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن نموذج..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setCategory(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                category === f.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.icon && <f.icon className="w-3.5 h-3.5" />}
              {f.label}
            </button>
          ))}
          <span className="mx-2 border-r border-slate-200" />
          {PRICING_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setPricing(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                pricing === f.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            لا توجد نماذج مطابقة لبحثك
          </div>
        )}
      </main>

      <Footer categories={[]} />
    </div>
  );
}

function ModelCard({ model }: { model: AIModel }) {
  const pricingLabel: Record<string, string> = {
    free: 'مجاني',
    freemium: 'مجاني جزئياً',
    paid: 'مدفوع',
    'open-source': 'مفتوح المصدر',
  };
  const pricingColor: Record<string, string> = {
    free: 'bg-green-100 text-green-700',
    freemium: 'bg-blue-100 text-blue-700',
    paid: 'bg-orange-100 text-orange-700',
    'open-source': 'bg-purple-100 text-purple-700',
  };

  return (
    <Link href={`/models/${model.slug}`}>
      <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{model.logo}</span>
            <div>
              <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {model.name}
              </h3>
              <span className="text-xs text-slate-500">{model.company}</span>
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${pricingColor[model.pricing]}`}>
            {pricingLabel[model.pricing]}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">
          {model.description}
        </p>

        {model.contextWindow && (
          <div className="text-[10px] text-slate-500 mb-2">
            السياق الأقصى: {model.contextWindow}
          </div>
        )}

        <div className="flex flex-wrap gap-1 mt-auto">
          {model.bestFor.slice(0, 3).map((use, i) => (
            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-medium">
              {use}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            {model.features.length} ميزة
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
        </div>
      </div>
    </Link>
  );
}
