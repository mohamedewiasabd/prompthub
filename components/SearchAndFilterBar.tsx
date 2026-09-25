'use client';

import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, ChevronDown, ChevronUp, Sparkles, Filter, RotateCcw, Star, Flame, Clock, Share2, Star as StarIcon } from 'lucide-react';
import { Category } from '@/types';

interface SearchAndFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  selectedDifficulty: string;
  onDifficultyChange: (diff: string) => void;
  selectedCategorySlug?: string;
  onCategoryChange?: (slug: string) => void;
  categories?: Category[];
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalResults: number;
  selectedTag?: string;
  onTagChange?: (tag: string) => void;
  featuredOnly?: boolean;
  onFeaturedChange?: (val: boolean) => void;
  onShareSearch?: () => void;
}

const POPULAR_MODELS = [
  { id: 'all', label: 'كل النماذج' },
  { id: 'ChatGPT', label: 'ChatGPT' },
  { id: 'Claude', label: 'Claude 3.7' },
  { id: 'Gemini', label: 'Gemini 2.0' },
  { id: 'DeepSeek', label: 'DeepSeek R1' },
  { id: 'Midjourney', label: 'Midjourney' },
  { id: 'FLUX', label: 'FLUX.1' },
  { id: 'Cursor', label: 'Cursor / Code' },
];

export function SearchAndFilterBar({
  searchQuery,
  onSearchChange,
  selectedModel,
  onModelChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedCategorySlug = 'all',
  onCategoryChange,
  categories = [],
  sortBy,
  onSortChange,
  totalResults,
  selectedTag = 'all',
  onTagChange,
  featuredOnly = false,
  onFeaturedChange,
  onShareSearch
}: SearchAndFilterBarProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedModel !== 'all' ||
    selectedDifficulty !== 'all' ||
    (selectedCategorySlug !== 'all' && selectedCategorySlug !== '') ||
    selectedTag !== 'all' ||
    featuredOnly ||
    sortBy !== 'latest';

  const handleResetFilters = () => {
    onSearchChange('');
    onModelChange('all');
    onDifficultyChange('all');
    if (onCategoryChange) onCategoryChange('all');
    if (onTagChange) onTagChange('all');
    if (onFeaturedChange) onFeaturedChange(false);
    onSortChange('latest');
  };

  return (
    <div className="w-full space-y-3 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs text-slate-800" dir="rtl">
      
      {/* Primary Row: Search Input + Advanced Filter Toggle + Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        
        {/* Main Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث بالكلمات المفتاحية، المهمة، أو المجال (مثال: تسويق، برمجة، Midjourney، سيو، وكلاء الذكاء)..."
            className="w-full pr-10 pl-10 py-3 sm:py-2.5 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-[16px] text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-normal"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
              title="مسح البحث"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full sm:w-auto pr-9 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer font-medium"
            >
              <option value="trending">🔥 الأكثر شعبية والتفاعل</option>
              <option value="rating">⭐ الأعلى تقييماً</option>
              <option value="latest">✨ الأحدث إضافة</option>
              <option value="copies">📋 الأكثر نسخاً</option>
              <option value="views">👁️ الأكثر مشاهدة</option>
              <option value="likes">❤️ الأكثر إعجاباً</option>
            </select>
          </div>

          {/* Advanced Search Toggle Button */}
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
              isAdvancedOpen || hasActiveFilters
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>بحث متقدم</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            )}
            {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Quick Model Badges Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500 ml-1">النموذج:</span>
          {POPULAR_MODELS.slice(0, 6).map((m) => {
            const active = selectedModel === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onModelChange(m.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Results Counter & Reset */}
        <div className="flex items-center gap-2 mr-auto sm:mr-0">
          {onShareSearch && (
            <button
              onClick={onShareSearch}
              className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700 font-semibold cursor-pointer hover:underline"
              title="نسخ رابط نتائج البحث الحالية لمشاركتها"
            >
              <Share2 className="w-3 h-3" />
              <span>مشاركة النتائج</span>
            </button>
          )}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-700 font-semibold cursor-pointer hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة ضبط</span>
            </button>
          )}
          <span className="text-xs text-slate-700 font-bold bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            {totalResults} برومبت
          </span>
        </div>
      </div>

      {/* Advanced Filter Expansion Drawer */}
      {isAdvancedOpen && (
        <div className="pt-4 mt-3 border-t border-slate-200 space-y-4 bg-slate-50/80 -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 p-4 sm:p-6 rounded-b-2xl animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>خيارات التصفية والبحث المتقدم</span>
            </h4>
            <span className="text-[11px] text-slate-500">خصص بحثك بدقة للوصول للبرومبت المطلوب</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Filter by Category */}
            {onCategoryChange && categories.length > 0 && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  القسم / المجال:
                </label>
                <select
                  value={selectedCategorySlug}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">جميع الأقسام ({categories.reduce((acc, c) => acc + (c.promptCount || 0), 0)})</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name} {c.promptCount ? `(${c.promptCount})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Filter by Difficulty */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                مستوى التعقيد:
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'مبتدئ', label: 'مبتدئ' },
                  { id: 'متوسط', label: 'متوسط' },
                  { id: 'متقدم', label: 'متقدم' }
                ].map((diff) => {
                  const active = selectedDifficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => onDifficultyChange(diff.id)}
                      className={`py-1.5 text-center text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        active
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {diff.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter by AI Model (Full List) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                أداة الذكاء الاصطناعي:
              </label>
              <select
                value={selectedModel}
                onChange={(e) => onModelChange(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {POPULAR_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Tag */}
            {onTagChange && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  وسم (كلمة مفتاحية):
                </label>
                <input
                  type="text"
                  value={selectedTag === 'all' ? '' : selectedTag}
                  onChange={(e) => onTagChange(e.target.value.trim() || 'all')}
                  placeholder="مثال: سيو، كود، تصوير، تسويق"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* Featured Only Filter */}
            {onFeaturedChange && (
              <div className="space-y-1.5 flex items-end">
                <button
                  type="button"
                  onClick={() => onFeaturedChange(!featuredOnly)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-colors cursor-pointer ${
                    featuredOnly
                      ? 'bg-amber-50 border-amber-300 text-amber-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <StarIcon className={`w-3.5 h-3.5 ${featuredOnly ? 'fill-amber-500 text-amber-500' : ''}`} />
                  {featuredOnly ? 'عرض المميّزة فقط' : 'إظهار المميّزة'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
