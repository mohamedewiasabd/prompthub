'use client';

import React from 'react';
import { Sparkles, RefreshCw, Command, Target } from 'lucide-react';
import { Category } from '@/types';

interface AdminAiGeneratorTabProps {
  categories: Category[];
  aiGenType: 'category' | 'batch-prompts' | 'custom-idea' | 'shortcuts';
  setAiGenType: (val: 'category' | 'batch-prompts' | 'custom-idea' | 'shortcuts') => void;
  aiCategoryCount: number;
  setAiCategoryCount: (val: number) => void;
  aiSelectedCategorySlug: string;
  setAiSelectedCategorySlug: (val: string) => void;
  aiPromptCount: number;
  setAiPromptCount: (val: number) => void;
  aiAdminIdea: string;
  setAiAdminIdea: (val: string) => void;
  aiCustomNotes: string;
  setAiCustomNotes: (val: string) => void;
  aiShortcutCount: number;
  setAiShortcutCount: (val: number) => void;
  aiShortcutIdea?: string;
  setAiShortcutIdea?: (val: string) => void;
  aiShortcutCategory?: string;
  setAiShortcutCategory?: (val: string) => void;
  aiShortcutKeyword?: string;
  setAiShortcutKeyword?: (val: string) => void;
  aiGenerating: boolean;
  aiResultLog: string;
  onGeneratePrompts: () => void;
  onGenerateCategories: () => void;
  onGenerateShortcuts: () => void;
}

export const AdminAiGeneratorTab: React.FC<AdminAiGeneratorTabProps> = ({
  categories,
  aiGenType,
  setAiGenType,
  aiCategoryCount,
  setAiCategoryCount,
  aiSelectedCategorySlug,
  setAiSelectedCategorySlug,
  aiPromptCount,
  setAiPromptCount,
  aiAdminIdea,
  setAiAdminIdea,
  aiCustomNotes,
  setAiCustomNotes,
  aiShortcutCount,
  setAiShortcutCount,
  aiShortcutIdea = '',
  setAiShortcutIdea,
  aiShortcutCategory = '',
  setAiShortcutCategory,
  aiShortcutKeyword = '',
  setAiShortcutKeyword,
  aiGenerating,
  aiResultLog,
  onGeneratePrompts,
  onGenerateCategories,
  onGenerateShortcuts
}) => {
  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>مولّد البرومبتات والأقسام والأوامر الذكي بالذكاء الاصطناعي</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              يعتمد على نموذج Google Gemini لتوليد برومبتات احترافية مطابقة لأحدث معايير هندسة الأوامر وحفظها سحابياً مباشرة.
            </p>
          </div>

          {/* Sub-modes switch */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setAiGenType('batch-prompts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                aiGenType === 'batch-prompts' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              توليد برومبتات لقسم
            </button>
            <button
              onClick={() => setAiGenType('custom-idea')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                aiGenType === 'custom-idea' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              توليد من فكرة مخصصة
            </button>
            <button
              onClick={() => setAiGenType('category')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                aiGenType === 'category' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              توليد أقسام جديدة
            </button>
            <button
              onClick={() => setAiGenType('shortcuts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                aiGenType === 'shortcuts' ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <Command className="w-3 h-3" />
                توليد أوامر اختصار
              </span>
            </button>
          </div>
        </div>

        {/* MODE 1: GENERATE PROMPTS FOR CATEGORY */}
        {aiGenType === 'batch-prompts' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-slate-700">اختر القسم المراد التوليد له:</label>
                <select
                  value={aiSelectedCategorySlug}
                  onChange={(e) => setAiSelectedCategorySlug(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name} ({c.nameEn}) - حالياً: {c.promptCount || 0} برومبت
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">عدد البرومبتات المراد توليدها:</label>
                <select
                  value={aiPromptCount}
                  onChange={(e) => setAiPromptCount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value={1}>1 برومبت عالي التأثير</option>
                  <option value={3}>3 برومبتات متنوعة</option>
                  <option value={5}>5 برومبتات متكاملة</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">ملاحظات أو توجيهات اختيارية للنموذج:</label>
              <input
                type="text"
                value={aiCustomNotes}
                onChange={(e) => setAiCustomNotes(e.target.value)}
                placeholder="مثال: ركز على أحدث تقنيات 2026 وأدوات الذكاء الاصطناعي مع أمثلة عملية..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <button
              onClick={onGeneratePrompts}
              disabled={aiGenerating}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {aiGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري التوليد بالذكاء الاصطناعي...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>توليد وحفظ {aiPromptCount} برومبتات ذكية فوراً</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* MODE 2: CUSTOM IDEA */}
        {aiGenType === 'custom-idea' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">القسم المستهدف:</label>
                <select
                  value={aiSelectedCategorySlug}
                  onChange={(e) => setAiSelectedCategorySlug(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">عدد النسخ المنشأة:</label>
                <select
                  value={aiPromptCount}
                  onChange={(e) => setAiPromptCount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value={1}>1 برومبت رئيسي مفصل</option>
                  <option value={2}>2 تنويعات مختلفة على الفكرة</option>
                  <option value={3}>3 تنويعات متدرجة الصعوبة</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                اكتب فكرة البرومبت أو هدفك (Admin Prompt Brief):
              </label>
              <textarea
                rows={3}
                value={aiAdminIdea}
                onChange={(e) => setAiAdminIdea(e.target.value)}
                placeholder="مثال: أريد برومبت يساعد مسؤولي الموارد البشرية على عمل مقابلات عمل افتراضية وتقييم إجابات المرشحين بالدرجات والملاحظات..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 leading-relaxed font-medium"
              />
            </div>

            <button
              onClick={onGeneratePrompts}
              disabled={aiGenerating || !aiAdminIdea.trim()}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {aiGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري صياغة البرومبت من فكرتك...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>صياغة وهندسة البرومبت من فكرتي ونشره</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* MODE 3: GENERATE NEW CATEGORIES */}
        {aiGenType === 'category' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">عدد الأقسام الجديدة المراد اقتراحها وتوليدها:</label>
              <select
                value={aiCategoryCount}
                onChange={(e) => setAiCategoryCount(Number(e.target.value))}
                className="w-full sm:w-64 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value={2}>2 أقسام جديدة</option>
                <option value={3}>3 أقسام جديدة ذات طلب عالٍ</option>
                <option value={5}>5 أقسام جديدة شاملة</option>
              </select>
            </div>

            <p className="text-xs text-slate-500">
              سيقوم Gemini بتحليل الأقسام الحالية وتوليد أقسام جديدة غير متكررة مع تسميات عربية وإنجليزية ووصف سيو متقدم وأيقونات متوافقة.
            </p>

            <button
              onClick={onGenerateCategories}
              disabled={aiGenerating}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {aiGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري استكشاف وتوليد الأقسام...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>توليد وحفظ {aiCategoryCount} أقسام جديدة بالذكاء الاصطناعي</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* MODE 4: GENERATE SLASH COMMANDS / SHORTCUTS */}
        {aiGenType === 'shortcuts' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">عدد أوامر الاختصار (slash commands) المراد توليدها:</label>
              <select
                value={aiShortcutCount}
                onChange={(e) => setAiShortcutCount(Number(e.target.value))}
                className="w-full sm:w-64 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-violet-500 font-medium"
              >
                <option value={3}>3 أوامر جديد</option>
                <option value={5}>5 أوامر متنوعة (موصى به)</option>
                <option value={8}>8 أوامر شاملة</option>
                <option value={10}>10 أوامر متقدمة</option>
              </select>
            </div>

            <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-violet-700">
                <Target className="w-4 h-4" />
                توجيه التوليد (اختياري — املأ ما تشاء للتركيز على اتجاه معين)
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">أفكار محددة تريد أوامر تخدمها</label>
                <input
                  type="text"
                  value={aiShortcutIdea}
                  onChange={(e) => setAiShortcutIdea?.(e.target.value)}
                  placeholder="مثال: أمر لكتابة إيميلات المتابعة، أمر لتحليل تقارير المبيعات السريعة..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600">اسم القسم / التصنيف المستهدف</label>
                  <input
                    type="text"
                    value={aiShortcutCategory}
                    onChange={(e) => setAiShortcutCategory?.(e.target.value)}
                    placeholder="مثال: التسويق، البرمجة، الإنتاجية..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-slate-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600">كلمة دليلية / مجال محوري</label>
                  <input
                    type="text"
                    value={aiShortcutKeyword}
                    onChange={(e) => setAiShortcutKeyword?.(e.target.value)}
                    placeholder="مثال: محصولات المحتوى، السيو، الأتمتة..."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              سيقوم Gemini بتحليل الأوامر الحالية وتوليد أوامر اختصار جديدة غير متكررة (مثل <code className="font-mono">/together</code> و
              <code className="font-mono">/satellite</code>) مع وصف عربي وتصنيف وأيقونات متوافقة، وتُحفظ مباشرة في قسم أوامر الاختصار.
            </p>

            <button
              onClick={onGenerateShortcuts}
              disabled={aiGenerating}
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-violet-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {aiGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري توليد أوامر الاختصار بالذكاء الاصطناعي...</span>
                </>
              ) : (
                <>
                  <Command className="w-4 h-4" />
                  <span>توليد وحفظ {aiShortcutCount} أوامر اختصار ذكية</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Log output screen */}
        {aiResultLog && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-blue-300 whitespace-pre-wrap leading-relaxed">
            {aiResultLog}
          </div>
        )}
      </div>
    </div>
  );
};
