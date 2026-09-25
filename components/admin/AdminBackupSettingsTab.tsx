'use client';

import React from 'react';
import { Database, RefreshCw, CheckCircle2, Upload, Download, Key } from 'lucide-react';

interface CloudSyncInfo {
  exists?: boolean;
  lastSynced?: string;
  cloudCategoriesCount?: number;
  cloudPromptsCount?: number;
  message?: string;
}

interface AdminBackupSettingsTabProps {
  cloudSyncInfo: CloudSyncInfo | null;
  cloudSyncLoading: boolean;
  onCheckCloudSyncInfo: () => void;
  onCloudPush: () => void;
  onCloudPull: () => void;
  onExportBackup: () => void;
  onImportBackup: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newUsernameInput: string;
  setNewUsernameInput: (val: string) => void;
  newPasswordInput: string;
  setNewPasswordInput: (val: string) => void;
  onUpdateCredentials: (e: React.FormEvent) => void;
}

export const AdminBackupSettingsTab: React.FC<AdminBackupSettingsTabProps> = ({
  cloudSyncInfo,
  cloudSyncLoading,
  onCheckCloudSyncInfo,
  onCloudPush,
  onCloudPull,
  onExportBackup,
  onImportBackup,
  newUsernameInput,
  setNewUsernameInput,
  newPasswordInput,
  setNewPasswordInput,
  onUpdateCredentials
}) => {
  return (
    <div className="space-y-6">
      {/* Firebase Cloud Sync Card */}
      <div className="p-6 rounded-3xl bg-linear-to-br from-amber-500/10 via-orange-500/5 to-white border border-amber-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                الحفظ والمزامنة السحابية (Firebase Firestore)
              </h3>
              <p className="text-xs text-slate-500">
                مشروع: <span className="font-mono font-bold text-amber-700">prompthub-a6f52</span> | الحفظ السحابي الدائم لجميع الأقسام والبرومبتات والتقييمات
              </p>
            </div>
          </div>

          <button
            onClick={onCheckCloudSyncInfo}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>فحص الحالة السحابية</span>
          </button>
        </div>

        {cloudSyncInfo && (
          <div className="p-3.5 rounded-2xl bg-white/80 border border-amber-200/60 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-3 font-medium">
            <div>
              {cloudSyncInfo.exists ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  البيانات متصلة ومحفوظة سحابياً
                  {cloudSyncInfo.lastSynced && (
                    <span className="text-slate-500 font-normal">
                      (آخر مزامنة: {new Date(cloudSyncInfo.lastSynced).toLocaleString('ar-EG')})
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-amber-800">
                  {cloudSyncInfo.message || 'لا توجد نسخة سحابية بعد'}
                </span>
              )}
            </div>
            {cloudSyncInfo.cloudPromptsCount !== undefined && (
              <div className="flex items-center gap-3 text-slate-600">
                <span>الأقسام بالسحابة: <b>{cloudSyncInfo.cloudCategoriesCount}</b></span>
                <span>•</span>
                <span>البرومبتات بالسحابة: <b>{cloudSyncInfo.cloudPromptsCount}</b></span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={onCloudPush}
            disabled={cloudSyncLoading}
            className="py-3 px-4 rounded-2xl bg-linear-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {cloudSyncLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>رفع وحفظ كافة البيانات إلى Firebase سحابياً</span>
              </>
            )}
          </button>

          <button
            onClick={onCloudPull}
            disabled={cloudSyncLoading}
            className="py-3 px-4 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>استرداد البيانات من سحابة Firebase</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backup & Restore */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>النسخ الاحتياطي المحلي واستعادة JSON</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            يمكنك تحميل نسخة كاملة من جميع الأقسام والبرومبتات بصيغة JSON، أو استعادة نسخة احتياطية سابقة في أي وقت.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={onExportBackup}
              className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-200 cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>تنزيل نسخة احتياطية (JSON Backup)</span>
            </button>

            <div>
              <label className="w-full py-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer">
                <Upload className="w-4 h-4 text-blue-600" />
                <span>استيراد واستعادة من ملف JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportBackup}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Change Credentials */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" />
            <span>تغيير بيانات دخول المشرف</span>
          </h3>
          <p className="text-xs text-slate-500">
            يمكنك تحديث اسم المستخدم أو كلمة المرور الخاصة بلوحة الإدارة السرية.
          </p>

          <form onSubmit={onUpdateCredentials} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">اسم مستخدم جديد (اختياري):</label>
              <input
                type="text"
                value={newUsernameInput}
                onChange={(e) => setNewUsernameInput(e.target.value)}
                placeholder="اتركه فارغاً للإبقاء على الحالي"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-900 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">كلمة مرور جديدة (اختياري):</label>
              <input
                type="password"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="اتركه فارغاً للإبقاء على الحالية"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 rounded-xl text-xs text-slate-900 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              حفظ البيانات الجديدة
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
