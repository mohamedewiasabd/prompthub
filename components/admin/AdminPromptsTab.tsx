'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Prompt, Category, DifficultyLevel } from '@/types';

interface AdminPromptsTabProps {
  prompts: Prompt[];
  categories: Category[];
  isPromptFormOpen: boolean;
  setIsPromptFormOpen: (open: boolean) => void;
  editingPromptId: string | null;
  promptForm: {
    title: string;
    titleEn: string;
    categoryId: string;
    categorySlug: string;
    description: string;
    promptText: string;
    models: string;
    framework: string;
    tags: string;
    sampleOutput: string;
    tips: string;
    difficulty: DifficultyLevel;
    featured: boolean;
  };
  setPromptForm: React.Dispatch<React.SetStateAction<{
    title: string;
    titleEn: string;
    categoryId: string;
    categorySlug: string;
    description: string;
    promptText: string;
    models: string;
    framework: string;
    tags: string;
    sampleOutput: string;
    tips: string;
    difficulty: DifficultyLevel;
    featured: boolean;
  }>>;
  onOpenNewPrompt: () => void;
  onEditPrompt: (p: Prompt) => void;
  onDeletePrompt: (id: string) => void;
  onSavePrompt: (e: React.FormEvent) => void;
}

export const AdminPromptsTab: React.FC<AdminPromptsTabProps> = ({
  prompts,
  categories,
  isPromptFormOpen,
  setIsPromptFormOpen,
  editingPromptId,
  promptForm,
  setPromptForm,
  onOpenNewPrompt,
  onEditPrompt,
  onDeletePrompt,
  onSavePrompt
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">إدارة وتعديل البرومبتات</h2>
          <p className="text-xs text-slate-500">
            قائمة بجميع البرومبتات المتاحة مع إمكانية التعديل والحذف والإضافة اليدوية
          </p>
        </div>

        <button
          onClick={onOpenNewPrompt}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة برومبت يدوياً</span>
        </button>
      </div>

      {/* Prompts Table */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">عنوان البرومبت</th>
                <th className="p-4">القسم</th>
                <th className="p-4">المستوى</th>
                <th className="p-4">النماذج</th>
                <th className="p-4">النسخ / المشاهدات</th>
                <th className="p-4 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prompts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-bold text-slate-900 max-w-xs truncate">
                    <Link href={`/p/${p.id}`} target="_blank" className="hover:text-blue-600 transition-colors">
                      {p.title}
                    </Link>
                    {p.titleEn && <div className="text-[10px] text-slate-400 font-sans font-normal">{p.titleEn}</div>}
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{p.categorySlug}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.difficulty === 'مبتدئ'
                          ? 'bg-green-100 text-green-700'
                          : p.difficulty === 'متقدم'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 max-w-[150px] truncate">
                    {p.models.join(', ')}
                  </td>
                  <td className="p-4 text-slate-500 font-medium">
                    {p.copies} نسخ / {p.views} مشاهدة
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onEditPrompt(p)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                        title="تعديل"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeletePrompt(p.id)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: PROMPT MANUAL FORM */}
      {isPromptFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div
            className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
              <h3 className="font-bold text-base text-slate-900">
                {editingPromptId ? 'تعديل البرومبت' : 'إضافة برومبت جديد يدوياً'}
              </h3>
              <button
                onClick={() => setIsPromptFormOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onSavePrompt} className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">عنوان البرومبت (بالعربية):</label>
                  <input
                    type="text"
                    required
                    value={promptForm.title}
                    onChange={(e) => setPromptForm({ ...promptForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">العنوان بالإنجليزية (Title En):</label>
                  <input
                    type="text"
                    value={promptForm.titleEn}
                    onChange={(e) => setPromptForm({ ...promptForm, titleEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs text-slate-900 font-sans font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">القسم:</label>
                  <select
                    value={promptForm.categoryId}
                    onChange={(e) => {
                      const cat = categories.find((c) => c.id === e.target.value);
                      setPromptForm({
                        ...promptForm,
                        categoryId: e.target.value,
                        categorySlug: cat?.slug || ''
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs text-slate-900 font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">مستوى الصعوبة:</label>
                  <select
                    value={promptForm.difficulty}
                    onChange={(e) => setPromptForm({ ...promptForm, difficulty: e.target.value as DifficultyLevel })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs text-slate-900 font-medium"
                  >
                    <option value="مبتدئ">مبتدئ</option>
                    <option value="متوسط">متوسط</option>
                    <option value="متقدم">متقدم</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">الوصف والشرح:</label>
                <textarea
                  rows={2}
                  required
                  value={promptForm.description}
                  onChange={(e) => setPromptForm({ ...promptForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  نص البرومبت (استخدم [المتغير] بين أقواس مربعة لتحديد المتغيرات):
                </label>
                <textarea
                  rows={5}
                  required
                  value={promptForm.promptText}
                  onChange={(e) => setPromptForm({ ...promptForm, promptText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-blue-300 dir-ltr text-left"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">النماذج المناسبة (مفصولة بفاصلة):</label>
                  <input
                    type="text"
                    value={promptForm.models}
                    onChange={(e) => setPromptForm({ ...promptForm, models: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">الوسوم Tags (مفصولة بفاصلة):</label>
                  <input
                    type="text"
                    value={promptForm.tags}
                    onChange={(e) => setPromptForm({ ...promptForm, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">نصائح الاستخدام (كل نصيحة في سطر):</label>
                <textarea
                  rows={2}
                  value={promptForm.tips}
                  onChange={(e) => setPromptForm({ ...promptForm, tips: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
                <button
                  type="button"
                  onClick={() => setIsPromptFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  حفظ ونشر البرومبت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
