'use client';

import React from 'react';
import Link from 'next/link';
import { Bot, ExternalLink, LogOut } from 'lucide-react';
import { Category, Prompt } from '@/types';

interface AdminHeaderProps {
  adminUsername: string;
  categories: Category[];
  prompts: Prompt[];
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminUsername,
  categories,
  prompts,
  onLogout
}) => {
  const totalCopies = prompts.reduce((acc, p) => acc + (p.copies || 0), 0);
  const totalViews = prompts.reduce((acc, p) => acc + (p.views || 0), 0);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-slate-900">لوحة الإدارة والذكاء الاصطناعي</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  متصل ({adminUsername})
                </span>
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:block">
                مكتبة البرومبتات الذكية | الحفظ السحابي التلقائي
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">معاينة الموقع للزوار</span>
            </Link>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">إجمالي الأقسام</span>
          <div className="text-2xl font-bold text-slate-900">{categories.length}</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">إجمالي البرومبتات</span>
          <div className="text-2xl font-bold text-blue-600">{prompts.length}</div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">إجمالي مرات النسخ</span>
          <div className="text-2xl font-bold text-emerald-600">
            {totalCopies}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500">إجمالي المشاهدات</span>
          <div className="text-2xl font-bold text-purple-600">
            {totalViews}
          </div>
        </div>
      </div>
    </>
  );
};
