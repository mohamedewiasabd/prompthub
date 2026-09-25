'use client';

import React, { useState } from 'react';
import { KeyRound, Copy, Check, RefreshCw, ExternalLink, Eye, EyeOff, Play, Braces, FileText, SpellCheck2, Layers, Command } from 'lucide-react';

interface AdminApiTabProps {
  apiKey: string;
  loading?: boolean;
  onRegenerate: () => void;
}

const ENDPOINTS = [
  {
    method: 'POST',
    path: '/api/admin/generate-shortcuts',
    icon: Command,
    desc: 'توليد أوامر اختصار (slash commands) مع توجيه اختياري (أفكار/قسم/كلمة دليلية)',
    body: '{"count":5, "adminIdea":"أفكارك", "category":"التسويق", "keyword":"السيو", "autoSave":true}'
  },
  {
    method: 'POST',
    path: '/api/admin/generate-prompts',
    icon: Braces,
    desc: 'توليد برومبتات ذكية لقسم محدد مع أفكار أو ملاحظات إضافية',
    body: '{"categorySlug":"marketing", "count":5, "adminIdea":"أفكارك", "customNotes":"ملاحظات", "autoSave":true}'
  },
  {
    method: 'POST',
    path: '/api/admin/generate-category',
    icon: Layers,
    desc: 'توليد أقسام/تصنيفات جديدة',
    body: '{"count":3, "autoSave":true}'
  },
  {
    method: 'POST',
    path: '/api/admin/generate-articles',
    icon: FileText,
    desc: 'توليد مقالات للمدونة (حسب موضوع أو تصنيف أو كلمة دليلية) وحفظها فوراً',
    body: '{"count":2, "topic":"نسخ كتابة تسويقية", "category":"التسويق", "keyword":"محتوى", "autoSave":true}'
  },
  {
    method: 'POST',
    path: '/api/admin/translate-prompt',
    icon: SpellCheck2,
    desc: 'ترجمة برومبت إلى الإنجليزية (بمعرّف البرومبت)',
    body: '{"id":"PROMPT_ID"}'
  }
];

export function AdminApiTab({ apiKey, loading, onRegenerate }: AdminApiTabProps) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState<'key' | 'url' | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://live-stream-sport.com';

  const copy = async (text: string, which: 'key' | 'url') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1800);
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 text-xs font-bold bg-white/20 rounded-full px-3 py-1.5 w-fit mb-3">
          <KeyRound className="w-3.5 h-3.5" />
          واجهة برمجة تطبيقات خارجية (External API)
        </div>
        <h2 className="text-xl font-extrabold mb-1">توليد المحتوى من برامجك الخارجية</h2>
        <p className="text-blue-100 text-sm leading-relaxed max-w-3xl">
          استخدم مفتاح API أدناه لتنفيذ توليد الأوامر والبرومبتات والمقالات من أي برنامج أو سكريبت أو أداة أخرى من صنعك — دون فتح لوحة التحكم. أرسل المفتاح في ترويسة <code className="bg-white/20 px-1.5 py-0.5 rounded font-mono">Authorization: Bearer &lt;KEY&gt;</code> مع أي طلب.
        </p>
      </div>

      {/* Base URL */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="text-xs font-bold text-slate-700 mb-2">رابط الموقع الأساسي (Base URL)</div>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 font-mono truncate">{baseUrl}</code>
          <button
            onClick={() => copy(baseUrl, 'url')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {copied === 'url' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            نسخ
          </button>
        </div>
      </div>

      {/* API Key */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-slate-700">مفتاح API الخاص بك</div>
          <button
            onClick={onRegenerate}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            توليد مفتاح جديد
          </button>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-slate-900 text-emerald-300 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono truncate">
            {showKey ? (apiKey || '...') : '••••••••••••' + (apiKey ? apiKey.slice(-6) : '')}
          </code>
          <button
            onClick={() => setShowKey(!showKey)}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title={showKey ? 'إخفاء' : 'إظهار'}
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={() => apiKey && copy(apiKey, 'key')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            {copied === 'key' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            نسخ المفتاح
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          شارك هذا المفتاح مع برامجك فقط. عند توليد مفتاح جديد يُلغى المفتاح القديم فوراً. لا تضعه في أي كود مفتوح المصدر.
        </p>
      </div>

      {/* Example request */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Play className="w-3.5 h-3.5 text-emerald-500" />
          مثال عملي (curl)
        </div>
        <pre className="bg-slate-900 text-emerald-300 text-xs rounded-xl p-4 overflow-x-auto leading-relaxed font-mono">{`curl -X POST "${baseUrl}/api/admin/generate-shortcuts" \\
  -H "Authorization: Bearer ${apiKey ? apiKey.slice(0, 8) + '••••••••' : 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{"count":3,"category":"التسويق","keyword":"محتوى"}'`}</pre>
      </div>

      {/* Endpoints list */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 text-sm font-bold text-slate-900">
          <FileText className="w-4 h-4 text-blue-600" />
          جداول نقاط النهاية (Endpoints)
        </div>
        <div className="divide-y divide-slate-100">
          {ENDPOINTS.map(ep => (
            <div key={ep.path} className="px-5 py-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-extrabold px-2 py-1 rounded ${ep.method === 'POST' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>
                  {ep.method}
                </span>
                <code className="text-xs font-mono font-bold text-slate-800">{ep.path}</code>
              </div>
              <p className="text-xs text-slate-500">{ep.desc}</p>
              <pre className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-[11px] font-mono text-slate-500 overflow-x-auto">{ep.body}</pre>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <a
          href="/docs"
          className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          الوثائق الكاملة لواجهة API
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}