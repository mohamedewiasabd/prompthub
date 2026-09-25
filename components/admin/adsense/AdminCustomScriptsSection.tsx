'use client';

import React from 'react';
import { PixelSettings } from '@/types';
import { Code2, Save } from 'lucide-react';

interface AdminCustomScriptsSectionProps {
  pixels: PixelSettings;
  setPixels: React.Dispatch<React.SetStateAction<PixelSettings>>;
  saving: boolean;
  onSave: () => void;
}

export const AdminCustomScriptsSection: React.FC<AdminCustomScriptsSectionProps> = ({
  pixels,
  setPixels,
  saving,
  onSave
}) => {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-600" />
          <span>إدخال أكواد مخصصة في الـ Head & Body</span>
        </h3>
        <p className="text-xs text-slate-500">
          يمكنك هنا إضافة أكواد تتبع إضافية مثل Microsoft Clarity، أو Hotjar، أو Google Tag Manager (GTM)، أو أي سكريبت تحليلي مخصص.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            كود مخصص في الـ &lt;head&gt; (Header Scripts):
          </label>
          <textarea
            rows={5}
            value={pixels.customHeadScript || ''}
            onChange={(e) => setPixels({ ...pixels, customHeadScript: e.target.value })}
            placeholder="<!-- Example: Microsoft Clarity or Google Tag Manager -->&#10;<script type='text/javascript'>...</script>"
            className="w-full p-4 bg-slate-900 text-emerald-300 font-mono text-xs rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dir-ltr text-left"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            كود مخصص قبل إغلاق الـ &lt;/body&gt; (Body Scripts):
          </label>
          <textarea
            rows={4}
            value={pixels.customBodyScript || ''}
            onChange={(e) => setPixels({ ...pixels, customBodyScript: e.target.value })}
            placeholder="<!-- Example: Live Chat widget script -->&#10;<script>...</script>"
            className="w-full p-4 bg-slate-900 text-blue-300 font-mono text-xs rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dir-ltr text-left"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>حفظ الأكواد المخصصة</span>
        </button>
      </div>
    </div>
  );
};
