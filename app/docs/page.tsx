import React from 'react';
import type { Metadata } from 'next';
import {
  Braces,
  Command,
  FileText,
  KeyRound,
  Layers,
  SpellCheck2,
  Database,
  Globe,
  Lock,
  Copy,
  Terminal
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'وثائق واجهة برمجة التطبيقات (API) | برومبتاتي',
  description:
    'الوثائق الكاملة لواجهة API في برومبتاتي: توليد الأوامر والبرومبتات والمقالات والتصنيفات والترجمة من برامجك الخارجية باستخدام مفتاح API.',
  keywords: ['API', 'واجهة برمجة تطبيقات', 'توليد محتوى', 'برومبت', 'أوامر', 'مفاتيح API'],
  openGraph: {
    title: 'وثائق واجهة برمجة التطبيقات (API) | برومبتاتي',
    description:
      'توليد الأوامر والبرومبتات والمقالات والتصنيفات والترجمة من برامجك الخارجية باستخدام مفتاح API.',
    type: 'website'
  }
};

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/admin/generate-shortcuts',
    icon: Command,
    name: 'توليد أوامر اختصار (Slash Commands)',
    auth: true,
    desc: 'توليد أوامر اختصار جديدة اختيارياً وفق توجيهاتك (أفكار / قسم / كلمة دليلية).',
    body: {
      count: 5,
      adminIdea: 'أفكارك الاختيارية',
      category: 'التسويق',
      keyword: 'السيو',
      model: 'gemini-3.8-flash',
      autoSave: true
    },
    notes: ['count: عدد الأوامر (1–20)', 'autoSave: الحفظ المباشر مع فتح الصفحة', 'model اختياري']
  },
  {
    method: 'POST',
    path: '/api/admin/generate-prompts',
    icon: Braces,
    name: 'توليد برومبتات ذكية',
    auth: true,
    desc: 'توليد برومبتات لأي قسم مع أفكارك أو ملاحظات إضافية.',
    body: {
      categorySlug: 'marketing',
      count: 5,
      adminIdea: 'أفكارك الاختيارية',
      customNotes: 'ملاحظاتك',
      autoSave: true
    },
    notes: ['categorySlug: معرّف القسم المطلوب', 'count: عدد البرومبتات', 'autoSave: الحفظ المباشر']
  },
  {
    method: 'POST',
    path: '/api/admin/generate-category',
    icon: Layers,
    name: 'توليد أقسام / تصنيفات',
    auth: true,
    desc: 'توليد تصنيفات جديدة كلياً حسب الملاحظات أو تلقائياً.',
    body: { count: 3, adminNote: 'ملاحظات اختيارية', autoSave: true },
    notes: ['count: عدد التصنيفات']
  },
  {
    method: 'POST',
    path: '/api/admin/generate-articles',
    icon: FileText,
    name: 'توليد مقالات المدونة',
    auth: true,
    desc: 'توليد مقالات كاملة وجاهزة (فقرات، قوائم، لوامع، قسم آي) مع حفظها في المدونة فوراً.',
    body: { count: 2, topic: 'نسخ كتابة تسويقية', category: 'التسويق', keyword: 'محتوى', autoSave: true },
    notes: ['count: عدد المقالات (1–6)', 'topic/category/keyword: توجيه اختياري', 'تُحفظ تلقائياً وتظهر في /blog وsitemap']
  },
  {
    method: 'POST',
    path: '/api/admin/translate-prompt',
    icon: SpellCheck2,
    name: 'ترجمة برومبت إلى الإنجليزية',
    auth: true,
    desc: 'ترجمة برومبت موجود إلى النص الإنجليزي لتُعرض على الزوار الداعمين للنسخ الإنجليزية.',
    body: { id: 'PROMPT_ID' },
    notes: ['id: معرّف البرومبت (يظهر في الرابط أو عناوين JSON)']
  },
  {
    method: 'GET',
    path: '/api/admin/api-key',
    icon: KeyRound,
    name: 'عرض / تجديد مفتاح API',
    auth: true,
    desc: 'قراءة المفتاح الحالي (GET) أو توليد مفتاح جديد يُلغي القديم (POST).',
    body: {},
    notes: ['POST يجدد المفتاح؛ يلزم استدعاؤه فقط من لوحة مشرف موثوقة']
  },
  {
    method: 'GET',
    path: '/api/admin/export',
    icon: Database,
    name: 'تصدير كامل البيانات',
    auth: true,
    desc: 'تنزيل نسخة JSON كاملة من المخزن (التصنيفات، البرومبتات، الأوامر، المقالات).',
    body: {},
    notes: ['يُرجع ملف JSON كامل الحالة']
  }
];

function AuthBox() {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
      <div className="flex items-center gap-2 text-xs font-bold bg-white/20 rounded-full px-3 py-1.5 w-fit mb-4">
        <Lock className="w-3.5 h-3.5" />
        المصادقة (Authentication)
      </div>
      <h2 className="text-xl font-extrabold mb-3">الوصول عبر مفتاح API واحد</h2>
      <p className="text-blue-100 text-sm leading-relaxed mb-4">
        كل نقطة نهاية تتطلب المصادقة. أرسل مفتاحك في ترويسة <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono">Authorization: Bearer &lt;KEY&gt;</code> أو <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono">x-admin-token: &lt;KEY&gt;</code>.
        المفتاح متاح في لوحة التحكم ← تبويب «واجهة API الخارجية». عند توليد مفتاح جديد يُلغى القديم فوراً.
      </p>
      <pre className="bg-black/30 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">{`Authorization: Bearer ph_api_abc123...
# أو
x-admin-token: ph_api_abc123...`}</pre>
    </div>
  );
}

function CurlExample({ baseUrl, apiKey, ep }: { baseUrl: string; apiKey: string; ep: (typeof ENDPOINTS)[number] }) {
  const hasBody = Object.keys(ep.body).length > 0;
  return (
    <pre className="bg-slate-900 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed text-emerald-300">
{`curl -X ${ep.method} "${baseUrl}${ep.path}" \\
  -H "Authorization: Bearer ${apiKey}" \\
${hasBody ? `  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(ep.body)}'\n` : ''}`}
    </pre>
  );
}

export default function DocsPage() {
  const baseUrl = process.env.APP_URL || 'https://live-stream-sport.com';
  const apiKey = 'YOUR_API_KEY';

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Hero */}
        <section className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold bg-blue-50 text-blue-700 rounded-full px-3 py-1.5">
            <Globe className="w-3.5 h-3.5" />
            واجهة برمجة التطبيقات
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">توثيق API برومبتاتي</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            تولِّد اختصار المقارنات والبرومبتات والمقالات والتصنيفات، وتُترجم المحتوى، وتصدّر قاعدة البيانات — كل ذلك من برنامجك أو سكربتك أو أداة العمل الخارجية عبر طلبات HTTP بسيطة بمفتاح API.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-mono bg-white border border-slate-200 rounded-full px-4 py-2 w-fit mx-auto">
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            {baseUrl}
          </div>
        </section>

        {/* Auth */}
        <AuthBox />

        {/* Endpoints */}
        <section id="endpoints" className="space-y-4">
          <div className="flex items-center gap-2">
            <Copy className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-extrabold text-slate-900">نقاط النهاية (Endpoints)</h2>
          </div>
          <div className="grid gap-5">
            {ENDPOINTS.map(ep => (
              <div key={ep.path} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3 flex-wrap bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <ep.icon className="w-4.5 h-4.5 w-5 h-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${ep.method === 'POST' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {ep.method}
                        </span>
                        <code className="text-sm font-mono font-bold text-slate-800">{ep.path}</code>
                        {ep.auth && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700">يتطلب مفتاح API</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{ep.name}</p>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <p className="text-sm text-slate-600 leading-relaxed">{ep.desc}</p>
                  {ep.notes.length > 0 && (
                    <ul className="list-disc pr-5 text-xs text-slate-500 space-y-1">
                      {ep.notes.map(n => <li key={n}>{n}</li>)}
                    </ul>
                  )}
                  <CurlExample baseUrl={baseUrl} apiKey={apiKey} ep={ep} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-extrabold text-slate-900">ملاحظات عامة</h2>
          <ul className="space-y-2 text-sm text-slate-600 leading-relaxed list-disc pr-5">
            <li>جميع الردود تُرجع JSON؛ اقرأ حقل <code className="font-mono text-xs">success</code> ثم البيانات.</li>
            <li>عند <code className="font-mono text-xs">autoSave: true</code> تُحفظ النتائج في قاعدة البيانات وتظهر في الموقع مباشرة.</li>
            <li>طلب بدون مفتاح صحيح يُرجع <code className="font-mono text-xs">401 Unauthorized</code>.</li>
            <li>المقالات المولّدة تُضاف تلقائياً إلى /blog وخريطة الموقع sitemap.xml.</li>
            <li>هذه الواجهة خاصة ومخصصة لاستخدامك أنت وبرامجك — لا تشارك المفتاح علناً.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}