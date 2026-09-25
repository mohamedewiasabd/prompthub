'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { IconRenderer } from './IconRenderer';
import { Sparkles, Share2 } from 'lucide-react';

interface CategoryPillsProps {
  categories: Category[];
  activeSlug?: string;
  onSelectCategory?: (slug: string) => void;
  onShareCategory?: (cat: Category) => void;
}

export function CategoryPills({
  categories,
  activeSlug = 'all',
  onSelectCategory,
  onShareCategory
}: CategoryPillsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scroll-x-mobile scroll-smooth-x no-scrollbar">
        
        {/* All / الكل */}
        <button
          onClick={() => onSelectCategory ? onSelectCategory('all') : undefined}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border shrink-0 cursor-pointer pressable ${
            activeSlug === 'all'
              ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 shadow-2xs'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>جميع الأقسام</span>
        </button>

        {/* Categories loop */}
        {categories.map((cat) => {
          const isActive = activeSlug === cat.slug;
          return (
            <div key={cat.id} className="relative group/pill shrink-0 flex items-center">
              <button
                onClick={() => onSelectCategory ? onSelectCategory(cat.slug) : undefined}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap border cursor-pointer pressable ${
                  isActive
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 shadow-2xs'
                }`}
              >
                <IconRenderer name={cat.icon} className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                <span>{cat.name}</span>
                {cat.promptCount !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {cat.promptCount}
                  </span>
                )}
              </button>

              {/* Share icon button */}
              {onShareCategory && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onShareCategory(cat);
                  }}
                  title={`مشاركة رابط قسم ${cat.name}`}
                  className="mr-1 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
