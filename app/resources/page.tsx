'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RESOURCE_PACKS, buildPackTxt, buildPackJson, buildAllTxt, ResourcePack } from '@/lib/seed-resources';
import { Download, FileJson, FileText, Check, Layers } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function PackCard({ pack }: { pack: ResourcePack }) {
  const [done, setDone] = useState<'txt' | 'json' | null>(null);
  const { t } = useI18n();

  const handleDownload = (format: 'txt' | 'json') => {
    const filename = `prompthub-${pack.id}-${new Date().toISOString().split('T')[0]}`;
    if (format === 'txt') {
      downloadFile(`${filename}.txt`, buildPackTxt(pack), 'text/plain;charset=utf-8');
    } else {
      downloadFile(`${filename}.json`, buildPackJson(pack), 'application/json;charset=utf-8');
    }
    setDone(format);
    setTimeout(() => setDone(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
      <div className={`bg-gradient-to-br ${pack.color} p-5`}>
        <div className="flex items-center justify-between">
          <span className="text-4xl drop-shadow">{pack.icon}</span>
          <span className="text-[10px] font-bold text-white bg-black/20 rounded-lg px-2 py-1 backdrop-blur">
            {pack.templates.length} {t('resources.badge') === 'Downloadable Resources' ? 'templates' : 'قالباً'}
          </span>
        </div>
        <h2 className="mt-3 font-extrabold text-white text-lg">{t('resources.badge') === 'Downloadable Resources' ? pack.nameEn : pack.name}</h2>
        <p className="text-white/85 text-xs font-sans">{t('resources.badge') === 'Downloadable Resources' ? pack.name : pack.nameEn}</p>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <p className="text-sm text-slate-600 leading-relaxed flex-1">{pack.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => handleDownload('txt')}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl px-3 py-2.5 transition-colors cursor-pointer"
          >
            {done === 'txt' ? <Check className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4" />}
            {t('resources.downloadTxt')}
          </button>
          <button
            onClick={() => handleDownload('json')}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl px-3 py-2.5 transition-colors cursor-pointer"
          >
            {done === 'json' ? <Check className="w-4 h-4" /> : <FileJson className="w-4 h-4" />}
            {t('resources.downloadJson')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [allDone, setAllDone] = useState(false);
  const [openPack, setOpenPack] = useState<string | null>(null);
  const { t } = useI18n();

  const handleDownloadAll = () => {
    downloadFile(`prompthub-all-packs-${new Date().toISOString().split('T')[0]}.txt`, buildAllTxt(), 'text/plain;charset=utf-8');
    setAllDone(true);
    setTimeout(() => setAllDone(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header categories={[]} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
            <Layers className="w-3.5 h-3.5" />
            {t('resources.badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            {t('resources.title')}
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base">
            {t('resources.subtitle')}
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleDownloadAll}
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl px-6 py-3 transition-colors cursor-pointer"
          >
            {allDone ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            {t('resources.downloadAll')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {RESOURCE_PACKS.map(pack => (
            <div key={pack.id} className="space-y-2">
              <PackCard pack={pack} />
              <button
                onClick={() => setOpenPack(openPack === pack.id ? null : pack.id)}
                className={`w-full text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors ${openPack === pack.id ? 'text-blue-600' : ''}`}
              >
                {openPack === pack.id ? t('resources.hidePreview') : t('resources.preview')} ▾
              </button>
              {openPack === pack.id && (
                <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                  {pack.templates.map((tmpl, i) => (
                    <details key={i} className="group p-4">
                      <summary className="text-xs font-bold text-slate-700 cursor-pointer list-none flex items-center justify-between">
                        <span>{tmpl.title}</span>
                        <span className="text-slate-300 group-open:rotate-180 transition-transform">▾</span>
                      </summary>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{tmpl.text}</p>
                    </details>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center text-sm text-slate-500">
          {t('resources.note')}
        </div>
      </main>

      <Footer />
    </div>
  );
}
