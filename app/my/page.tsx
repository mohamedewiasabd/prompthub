'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getFavorites, getCopyHistory, clearCopyHistory } from '@/lib/user-data';
import { Prompt } from '@/types';
import { Heart, Clock, Trash2, Star, BookOpen, ChevronRight, Download, FileJson, FileText, Cloud, CloudOff } from 'lucide-react';
import { useUser } from '@/lib/use-user';

function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function MyLibraryPage() {
  const { user } = useUser();
  const [tab, setTab] = useState<'favorites' | 'history'>('favorites');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favPrompts, setFavPrompts] = useState<Prompt[]>([]);
  const [history, setHistory] = useState(getCopyHistory());
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFavorites(getFavorites());
    setHistory(getCopyHistory());
  }, []);

  // Load favorites from API
  useEffect(() => {
    if (tab !== 'favorites' || favorites.length === 0) {
      setFavPrompts([]);
      return;
    }
    (async () => {
      try {
        const res = await fetch('/api/prompts', { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          const all = data.prompts as Prompt[];
          setFavPrompts(all.filter(p => favorites.includes(p.id)));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [tab, favorites]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" dir="rtl">
      <Header categories={categories} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900">مكتبتي</h1>
          <p className="text-slate-600 text-sm">برومبتاتك المحفوظة وسجل النسخ الخاص بك.</p>
        </div>

        {/* Account sync status */}
        <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold ${user ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
          {user ? (
            <>
              <Cloud className="w-4 h-4" />
              <span>أنت مسجّل كـ {user.email} — بياناتك متزامنة مع حسابك وتظهر على جميع أجهزتك.</span>
            </>
          ) : (
            <>
              <CloudOff className="w-4 h-4" />
              <span>أنت في وضع الزائر — بياناتك محفوظة محلياً في هذا المتصفح فقط. لتفعيل المزامنة عبر الأجهزة، اضغط زر «حسابي» في الأعلى وتسجّل الدخول.</span>
            </>
          )}
        </div>

        <div className="flex justify-center">
          <div className="inline-flex rounded-xl bg-slate-100 border border-slate-200 p-1">
            <button
              onClick={() => setTab('favorites')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                tab === 'favorites' ? 'bg-white shadow-sm text-rose-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className={`w-4 h-4 ${tab === 'favorites' ? 'fill-rose-600' : ''}`} />
              المفضلة ({favorites.length})
            </button>
            <button
              onClick={() => setTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                tab === 'history' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              سجل النسخ ({history.length})
            </button>
          </div>
        </div>

        {/* Export / Share actions */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {tab === 'favorites' && favPrompts.length > 0 && (
            <>
              <button
                onClick={() => downloadFile('prompthub-favorites.json', JSON.stringify(favPrompts, null, 2), 'application/json')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-blue-300 hover:text-blue-600 cursor-pointer"
              >
                <FileJson className="w-3.5 h-3.5" />
                تصدير المفضلة JSON
              </button>
              <button
                onClick={() => downloadFile('prompthub-favorites.txt', favPrompts.map(p => `${p.title}\n${p.description || ''}\n${p.promptText}\n${'='.repeat(40)}\n`).join('\n'), 'text/plain')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-blue-300 hover:text-blue-600 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                تصدير كنص TXT
              </button>
            </>
          )}
          {tab === 'history' && history.length > 0 && (
            <button
              onClick={() => downloadFile('prompthub-copy-history.txt', history.map(h => `• ${h.title} — نُسخ ${h.copies} مرة (${new Date(h.copiedAt).toLocaleDateString('ar-EG')})`).join('\n'), 'text/plain')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:border-blue-300 hover:text-blue-600 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              تصدير السجل TXT
            </button>
          )}
        </div>

        {tab === 'favorites' && (
          <div className="space-y-4">
            {favorites.length === 0 ? (
              <EmptyState
                icon={<Heart className="w-8 h-8 text-slate-300" />}
                title="لا توجد برومبتات محفوظة بعد"
                description="اضغط زر القلب على أي برومبت لحفظه هنا."
              />
            ) : favPrompts.length === 0 && loading ? (
              <div className="text-center py-12 text-slate-400 text-sm">جاري التحميل...</div>
            ) : (
              favPrompts.map(p => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 hover:shadow-md transition-all">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{p.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="flex items-center gap-1 text-[11px] text-amber-700"><Star className="w-3 h-3 fill-amber-500 text-amber-500" />{(p.ratingAverage||4.8).toFixed(1)}</span>
                      <span className="text-[11px] text-slate-400">{p.copies} نسخة</span>
                    </div>
                  </div>
                  <Link href={`/p/${p.id}`} className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-1 whitespace-nowrap">
                    فتح
                    <ChevronRight className="w-3 h-3 rotate-180" />
                  </Link>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-4">
            {history.length === 0 ? (
              <EmptyState
                icon={<Clock className="w-8 h-8 text-slate-300" />}
                title="لا يوجد سجل نسخ بعد"
                description="عندما تنسخ أي برومبت سيظهر هنا تلقائياً."
              />
            ) : (
              <>
                <div className="flex justify-end">
                  <button
                    onClick={() => { clearCopyHistory(); setHistory([]); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    مسح السجل
                  </button>
                </div>
                {history.map(item => (
                  <div key={item.promptId} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between gap-4 hover:shadow-md transition-all">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          نُسخ {item.copies} مرة • {new Date(item.copiedAt).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                    </div>
                    <Link href={`/p/${item.promptId}`} className="text-xs text-blue-600 font-bold hover:underline whitespace-nowrap">
                      فتح
                    </Link>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </main>

      <Footer categories={[]} />
    </div>
  );
}

function EmptyState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center py-16 space-y-3 bg-white rounded-2xl border border-slate-200">
      <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
        {icon}
      </div>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto">{description}</p>
    </div>
  );
}
