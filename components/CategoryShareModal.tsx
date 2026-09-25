'use client';

import React, { useState } from 'react';
import { Category } from '@/types';
import { X, Copy, Check, Share2, MessageCircle, Send, Twitter, Link2 } from 'lucide-react';
import { IconRenderer } from './IconRenderer';

interface CategoryShareModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryShareModal({
  category,
  isOpen,
  onClose
}: CategoryShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !category) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const categoryUrl = `${origin}/category/${category.slug}`;
  const shareText = `تصفح أفضل برومبتات وأوامر الذكاء الاصطناعي المجانية لقسم "${category.name}" على برومبتاتي:\n${categoryUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(categoryUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(categoryUrl)}&text=${encodeURIComponent(category.name)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div onClick={() => onClose()} className="absolute inset-0" />
      <div
        className="relative w-full max-w-md p-6 bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl shadow-2xl text-slate-900 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1 sm:hidden"><span className="w-10 h-1.5 rounded-full bg-slate-200" /></div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <IconRenderer name={category.icon} className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">{category.name}</h3>
              <p className="text-xs text-slate-500">مشاركة رابط القسم المباشر</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Copy Link Input Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">الرابط المباشر للقسم:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={categoryUrl}
              className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>تم!</span>
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

        {/* Quick Share Channels */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 block">مشاركة سريعة عبر:</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={shareToWhatsApp}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب</span>
            </button>

            <button
              onClick={shareToTwitter}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Twitter className="w-4 h-4" />
              <span>X (تويتر)</span>
            </button>

            <button
              onClick={shareToTelegram}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>تيليجرام</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
