'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SKILL_DOMAINS } from '@/lib/seed-techniques';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

const DIFFICULTY_COLOR: Record<string, string> = {
  'مبتدئ': 'bg-green-100 text-green-700',
  'متوسط': 'bg-amber-100 text-amber-700',
  'متقدم': 'bg-red-100 text-red-700',
};

export default function SkillsPage() {
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" dir="rtl">
      <Header categories={[]} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            مهارات الذكاء الاصطناعي حسب المجال
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            قوالب برومبتات جاهزة ومهارات عملية مصنفة حسب المجال: البرمجة، الكتابة، التسويق، توليد الصور، والأعمال.
          </p>
        </div>

        {SKILL_DOMAINS.map(domain => (
          <section key={domain.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">{domain.name}</h2>
              <span className="text-xs text-slate-500">{domain.nameEn}</span>
            </div>
            <p className="text-sm text-slate-600">{domain.description}</p>

            <div className="space-y-3">
              {domain.skills.map(skill => {
                const isExpanded = expandedSkill === skill.id;
                return (
                  <div key={skill.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <button
                      onClick={() => setExpandedSkill(isExpanded ? null : skill.id)}
                      className="w-full flex items-center justify-between p-4 text-right cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${DIFFICULTY_COLOR[skill.difficulty]}`}>
                          {skill.difficulty}
                        </span>
                        <div>
                          <h3 className="font-bold text-sm text-slate-900">{skill.name}</h3>
                          <span className="text-xs text-slate-500">{skill.nameEn}</span>
                        </div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3 border-t border-slate-100">
                        <p className="text-xs text-slate-600 mt-3">{skill.description}</p>

                        <div className="relative">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-blue-600 uppercase">قالب البرومبت</span>
                            <button
                              onClick={() => handleCopy(skill.promptTemplate, skill.id)}
                              className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                            >
                              {copiedId === skill.id ? (
                                <><Check className="w-3 h-3 text-emerald-500" /> تم النسخ</>
                              ) : (
                                <><Copy className="w-3 h-3" /> نسخ</>
                              )}
                            </button>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {skill.promptTemplate}
                          </div>
                        </div>

                        {skill.example && (
                          <div>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase">مثال تطبيقي</span>
                            <div className="p-3 bg-emerald-50 rounded-xl text-xs text-slate-700 leading-relaxed mt-1">
                              {skill.example}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      <Footer categories={[]} />
    </div>
  );
}
