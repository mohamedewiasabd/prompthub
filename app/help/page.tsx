'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ChevronDown, ChevronUp, Search, Copy, Star, MessageSquare, Bookmark, Compass, User, Download, Languages } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const FAQ_CATEGORIES = [
  {
    id: 'basics',
    nameKey: 'help.catBasics',
    icon: Compass,
    questions: [
      { qKey: 'help.q1', aKey: 'help.a1' },
      { qKey: 'help.q2', aKey: 'help.a2' },
      { qKey: 'help.q3', aKey: 'help.a3' },
      { qKey: 'help.q4', aKey: 'help.a4' }
    ]
  },
  {
    id: 'usage',
    nameKey: 'help.catUsage',
    icon: Copy,
    questions: [
      { qKey: 'help.q5', aKey: 'help.a5' },
      { qKey: 'help.q6', aKey: 'help.a6' },
      { qKey: 'help.q7', aKey: 'help.a7' },
      { qKey: 'help.q8', aKey: 'help.a8' },
      { qKey: 'help.q9', aKey: 'help.a9' }
    ]
  },
  {
    id: 'library',
    nameKey: 'help.catLibrary',
    icon: Bookmark,
    questions: [
      { qKey: 'help.q10', aKey: 'help.a10' },
      { qKey: 'help.q11', aKey: 'help.a11' },
      { qKey: 'help.q12', aKey: 'help.a12' },
      { qKey: 'help.q13', aKey: 'help.a13' }
    ]
  },
  {
    id: 'search',
    nameKey: 'help.catSearch',
    icon: Search,
    questions: [
      { qKey: 'help.q14', aKey: 'help.a14' },
      { qKey: 'help.q15', aKey: 'help.a15' },
      { qKey: 'help.q16', aKey: 'help.a16' }
    ]
  },
  {
    id: 'account',
    nameKey: 'help.catAccount',
    icon: User,
    questions: [
      { qKey: 'help.q17', aKey: 'help.a17' },
      { qKey: 'help.q18', aKey: 'help.a18' },
      { qKey: 'help.q19', aKey: 'help.a19' }
    ]
  },
  {
    id: 'ai-help',
    nameKey: 'help.catAi',
    icon: MessageSquare,
    questions: [
      { qKey: 'help.q20', aKey: 'help.a20' },
      { qKey: 'help.q21', aKey: 'help.a21' },
      { qKey: 'help.q22', aKey: 'help.a22' }
    ]
  }
];

export default function HelpPage() {
  const [openCategory, setOpenCategory] = useState<string | null>('basics');
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});
  const { t } = useI18n();

  const toggleQuestion = (id: string) => {
    setOpenQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_CATEGORIES.flatMap(cat =>
      cat.questions.map(item => ({
        '@type': 'Question',
        name: t(item.qKey),
        acceptedAnswer: { '@type': 'Answer', text: t(item.aKey) }
      }))
    )
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header categories={[]} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
            <MessageSquare className="w-3.5 h-3.5" />
            {t('help.badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            {t('help.title')}
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t('help.subtitle')}
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isOpen = openCategory === cat.id;
            return (
              <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon className="w-4.5 h-4.5" />
                    </span>
                    <div className="text-right">
                      <h2 className="font-bold text-slate-900">{t(cat.nameKey)}</h2>
                      <p className="text-xs text-slate-500">{t('help.faqCount', cat.questions.length)}</p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 divide-y divide-slate-100">
                    {cat.questions.map((item, idx) => {
                      const qid = `${cat.id}-${idx}`;
                      const open = openQuestions[qid];
                      return (
                        <div key={qid}>
                          <button
                            onClick={() => toggleQuestion(qid)}
                            className="w-full flex items-center justify-between gap-3 p-4 text-right cursor-pointer hover:bg-slate-50 transition-colors"
                          >
                            <span className="font-medium text-sm text-slate-800">{t(item.qKey)}</span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
                          </button>
                          {open && (
                            <div className="px-4 pb-4 -mt-1">
                              <p className="text-sm text-slate-600 leading-relaxed">{t(item.aKey)}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h2 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
            <Compass className="w-5 h-5 text-blue-600" />
            {t('help.quickLinks')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: '/learn', labelKey: 'footer.learnLabel' },
              { href: '/skills', labelKey: 'footer.skillsLabel' },
              { href: '/trending', labelKey: 'footer.trendingLabel' },
              { href: '/my', labelKey: 'nav.myLibrary' },
              { href: '/models', labelKey: 'nav.models' },
              { href: '/shortcuts', labelKey: 'footer.shortcutsLabel' }
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-blue-100 transition-colors"
              >
                <div className="flex-1">
                  <span className="text-sm font-bold text-slate-800 block">{t(link.labelKey)}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-300 -rotate-90" />
              </a>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-l from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2">{t('help.notFoundTitle')}</h2>
          <p className="text-blue-100 text-sm mb-4">
            {t('help.notFoundDesc')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5 font-medium">
              <Languages className="w-3.5 h-3.5" /> {t('help.notFoundBilingual')}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5 font-medium">
              <Download className="w-3.5 h-3.5" /> {t('help.notFoundExport')}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1.5 font-medium">
              <Star className="w-3.5 h-3.5" /> {t('help.notFoundSync')}
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
