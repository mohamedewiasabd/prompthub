'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Prompt } from '@/types';
import { Copy, Check, Heart, Eye, Sliders, Share2, Sparkles, ExternalLink, Star, MessageSquare, Bookmark } from 'lucide-react';
import { useFavorites } from '@/lib/use-user-data';

interface PromptCardProps {
  prompt: Prompt;
  onOpenDetails: (prompt: Prompt) => void;
  onOpenCustomize: (prompt: Prompt) => void;
  onCopyPrompt: (prompt: Prompt) => void;
  onLikePrompt: (prompt: Prompt) => void;
  onSharePrompt: (prompt: Prompt) => void;
}

export function PromptCard({
  prompt,
  onOpenDetails,
  onOpenCustomize,
  onCopyPrompt,
  onLikePrompt,
  onSharePrompt
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const { isFav, toggle } = useFavorites();
  const saved = isFav(prompt.id);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(prompt.id);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyPrompt(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      setLiked(true);
      onLikePrompt(prompt);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSharePrompt(prompt);
  };

  // Format highlighted text for prompt preview
  const previewText = prompt.promptText.length > 180
    ? prompt.promptText.slice(0, 180) + '...'
    : prompt.promptText;

  const rating = prompt.ratingAverage || 4.8;
  const ratingCount = prompt.ratingCount || 10;

  return (
    <div
      onClick={() => onOpenDetails(prompt)}
      className="group relative flex flex-col justify-between p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all shadow-xs cursor-pointer"
      dir="rtl"
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          
          {/* Models Badges */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
            {prompt.models.slice(0, 2).map((m, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap"
              >
                {m}
              </span>
            ))}
            {prompt.models.length > 2 && (
              <span className="text-[10px] text-slate-400 px-1 font-medium">
                +{prompt.models.length - 2}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Rating Star Badge */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-[10px] text-amber-600 font-normal">({ratingCount})</span>
            </div>

            {/* Difficulty badge */}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              prompt.difficulty === 'مبتدئ'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : prompt.difficulty === 'متقدم'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            }`}>
              {prompt.difficulty}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1.5 leading-snug">
          {prompt.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {prompt.description}
        </p>

        {/* Prompt Code Preview Box */}
        <div className="relative p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-blue-200 leading-relaxed overflow-hidden mb-4 dir-ltr text-left">
          <div className="line-clamp-3">
            {previewText}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          {prompt.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] text-slate-600 hover:text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md font-medium"
            >
              #{tag}
            </span>
          ))}
          {prompt.variables && prompt.variables.length > 0 && (
            <span className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
              <Sliders className="w-3 h-3 text-indigo-600" />
              {prompt.variables.length} متغيرات
            </span>
          )}
        </div>
      </div>

      {/* Bottom Actions & Stats */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        
        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 hover:text-rose-600 transition-colors cursor-pointer ${
              liked ? 'text-rose-600 font-bold' : ''
            }`}
            title="إعجاب بالبرومبت"
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-rose-600' : ''}`} />
            <span>{prompt.likes + (liked ? 1 : 0)}</span>
          </button>

          <span className="flex items-center gap-1" title="مرات النسخ والاستخدام">
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>{prompt.copies}</span>
          </span>

          <span className="flex items-center gap-1 text-[11px]" title="مرات المشاهدة">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{prompt.views}</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Favorite / Save */}
          <button
            onClick={handleFav}
            className={`p-2 rounded-lg transition-colors cursor-pointer pressable ${
              saved
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-rose-600'
            }`}
            title={saved ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-rose-600' : ''}`} />
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer pressable"
            title="مشاركة رابط البرومبت"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* Customize Variables button */}
          {prompt.variables && prompt.variables.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenCustomize(prompt);
              }}
              className="px-2.5 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer pressable"
              title="تخصيص المتغيرات والنسخ"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">تخصيص</span>
            </button>
          )}

          {/* Fast Direct Copy button */}
          <button
            onClick={handleCopy}
            className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer pressable ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
