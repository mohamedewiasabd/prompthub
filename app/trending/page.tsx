import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getAllPrompts, getAllCategories } from '@/lib/db';
import { TrendingUp, Copy, Eye, Star, ArrowLeft, Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'الأكثر رواجاً | PromptHub',
  description: 'أشهر البرومبتات في PromptHub حسب عدد النسخ والمشاهدات والتقييمات — برومبتات ذكاء اصطناعي مجانية جاهزة للاستخدام.'
};

const medalColors = ['text-amber-500', 'text-slate-400', 'text-amber-700'];

function rankScore(p: any) {
  return (p.views * 0.4) + (p.copies * 2) + (p.likes * 3) + ((p.ratingAverage || 4.5) * 20);
}

export default async function TrendingPage() {
  const categories = getAllCategories();
  const prompts = getAllPrompts();

  const byCopies = [...prompts].sort((a, b) => b.copies - a.copies).slice(0, 10);
  const byViews = [...prompts].sort((a, b) => b.views - a.views).slice(0, 10);
  const byRating = [...prompts]
    .filter((p) => (p.ratingCount || 0) >= 1)
    .sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0) || (b.ratingCount || 0) - (a.ratingCount || 0))
    .slice(0, 10);
  const trending = [...prompts].sort((a, b) => rankScore(b) - rankScore(a)).slice(0, 10);

  const totalCopies = prompts.reduce((s, p) => s + p.copies, 0);
  const totalViews = prompts.reduce((s, p) => s + p.views, 0);
  const totalLikes = prompts.reduce((s, p) => s + p.likes, 0);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://live-stream-sport.com';
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'الأكثر رواجاً على PromptHub',
    itemListElement: trending.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.title,
      url: `${baseUrl}/p/${p.id}`
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900" dir="rtl">
      <Header categories={categories} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
            <TrendingUp className="w-4 h-4" />
            لوحة الإحصائيات العامة
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">إحصائيات وترتيب البرومبتات</h1>
          <p className="text-slate-600 text-sm">أشهر البرومبتات في PromptHub حسب النسخ والمشاهدات والتقييم.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={<Copy className="w-5 h-5 text-blue-600" />} label="إجمالي النسخ" value={totalCopies.toLocaleString('ar-EG')} />
          <StatCard icon={<Eye className="w-5 h-5 text-emerald-600" />} label="إجمالي المشاهدات" value={totalViews.toLocaleString('ar-EG')} />
          <StatCard icon={<Star className="w-5 h-5 text-amber-500" />} label="إجمالي الإعجابات" value={totalLikes.toLocaleString('ar-EG')} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RankingBox title="الأكثر نسخاً" icon={<Copy className="w-4 h-4 text-blue-600" />} items={byCopies} metric={(p, i) => `${p.copies.toLocaleString('ar-EG')} نسخة`} medal={true} />
          <RankingBox title="الأكثر مشاهدة" icon={<Eye className="w-4 h-4 text-emerald-600" />} items={byViews} metric={(p, i) => `${p.views.toLocaleString('ar-EG')} مشاهدة`} medal={true} />
          <RankingBox title="الأعلى تقييماً" icon={<Star className="w-4 h-4 text-amber-500" />} items={byRating} metric={(p, i) => `⭐ ${(p.ratingAverage || 0).toFixed(1)} (${p.ratingCount})`} medal={false} />
          <RankingBox title="الرائج الآن" icon={<Trophy className="w-4 h-4 text-rose-600" />} items={trending} metric={(p, i) => `نقاط: ${Math.round(rankScore(p)).toLocaleString('ar-EG')}`} medal={true} />
        </div>
      </main>

      <Footer categories={[]} />
    </div>
    </>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-xl font-extrabold text-slate-900">{value}</div>
        <div className="text-xs text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function RankingBox({ title, icon, items, metric, medal }: {
  title: string;
  icon: React.ReactNode;
  items: any[];
  metric: (p: any, i: number) => string;
  medal: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        {icon}
        <h2 className="font-bold text-slate-900">{title}</h2>
      </div>
      <div className="divide-y divide-slate-100">
        {items.length === 0 && <div className="px-5 py-8 text-center text-sm text-slate-400">لا توجد بيانات بعد</div>}
        {items.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
            <div className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-extrabold ${medal && i < 3 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/p/${p.id}`} className="font-semibold text-sm text-slate-800 hover:text-blue-600 line-clamp-1">
                {p.title}
              </Link>
              <div className="text-[11px] text-slate-400 mt-0.5">{metric(p, i)}</div>
            </div>
            <Link href={`/p/${p.id}`} className="shrink-0 w-7 h-7 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-500 flex items-center justify-center transition-colors" aria-label="فتح البرومبت">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
