'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Category } from '@/types';
import { IconRenderer } from '@/components/IconRenderer';

interface AdminCategoriesTabProps {
  categories: Category[];
  isCategoryFormOpen: boolean;
  setIsCategoryFormOpen: (open: boolean) => void;
  editingCategorySlug: string | null;
  categoryForm: {
    name: string;
    nameEn: string;
    slug: string;
    description: string;
    icon: string;
  };
  setCategoryForm: React.Dispatch<React.SetStateAction<{
    name: string;
    nameEn: string;
    slug: string;
    description: string;
    icon: string;
  }>>;
  onOpenNewCategory: () => void;
  onEditCategory: (cat: Category) => void;
  onDeleteCategory: (slug: string) => void;
  onSaveCategory: (e: React.FormEvent) => void;
  onShowToast: (type: 'success' | 'error' | 'info', title: string, description?: string) => void;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  isCategoryFormOpen,
  setIsCategoryFormOpen,
  editingCategorySlug,
  categoryForm,
  setCategoryForm,
  onOpenNewCategory,
  onEditCategory,
  onDeleteCategory,
  onSaveCategory,
  onShowToast
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">إدارة الأقسام والروابط القابلة للمشاركة</h2>
          <p className="text-xs text-slate-500">لكل قسم رابط دائم ومستقل يمكن نسخه ومشاركته للجمهور</p>
        </div>

        <button
          onClick={onOpenNewCategory}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قسم جديد</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const origin = typeof window !== 'undefined' ? window.location.origin : '';
          const catUrl = `${origin}/category/${cat.slug}`;

          return (
            <div
              key={cat.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <IconRenderer name={cat.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{cat.name}</h3>
                      <p className="text-[11px] text-slate-500 font-sans font-medium">{cat.nameEn}</p>
                    </div>
                  </div>

                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-bold">
                    {cat.promptCount || 0} برومبت
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-700 flex items-center justify-between">
                  <span className="truncate max-w-[200px]">/category/{cat.slug}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(catUrl);
                      onShowToast('success', 'تم نسخ رابط القسم!');
                    }}
                    className="text-blue-600 hover:text-blue-700 text-[10px] font-bold cursor-pointer"
                  >
                    نسخ الرابط
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/category/${cat.slug}`}
                  target="_blank"
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
                >
                  <span>فتح صفحة القسم</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEditCategory(cat)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="تعديل"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(cat.slug)}
                    className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: CATEGORY MANUAL FORM */}
      {isCategoryFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 space-y-4 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingCategorySlug ? 'تعديل القسم' : 'إضافة قسم جديد'}
              </h3>
              <button
                onClick={() => setIsCategoryFormOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onSaveCategory} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">اسم القسم بالعربية:</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">اسم القسم بالإنجليزية:</label>
                <input
                  type="text"
                  required
                  value={categoryForm.nameEn}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs text-slate-900 font-sans font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">الرابط المباشر (Slug):</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="اتركه فارغاً للتوليد التلقائي"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs text-slate-900 font-mono font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">الأيقونة (Lucide Icon):</label>
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  placeholder="مثال: Megaphone, Code, Sparkles, Image, Briefcase"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs text-slate-900 font-sans font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">وصف القسم (للسيو والزوار):</label>
                <textarea
                  rows={2}
                  required
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                >
                  حفظ القسم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
