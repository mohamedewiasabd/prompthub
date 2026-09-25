'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUser } from '@/lib/use-user';
import { UserCircle2, LogOut, Loader2, X, Mail, Lock, Bookmark, Cloud } from 'lucide-react';

export function AccountMenu() {
  const { user, loading, login, register, logout } = useUser();
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const err = mode === 'login'
      ? await login(email, password)
      : await register(email, password);
    setBusy(false);
    if (err) {
      setError(err);
    } else {
      setOpenModal(false);
      setEmail('');
      setPassword('');
    }
  };

  if (loading) {
    return (
      <button className="p-2 rounded-lg text-slate-400" aria-label="جاري التحميل" tabIndex={-1}>
        <Loader2 className="w-5 h-5 animate-spin" />
      </button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/my"
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 transition-colors"
          title="مكتبتي"
        >
          <Cloud className="w-3.5 h-3.5 text-emerald-600" />
          {user.email}
        </Link>
        <button
          onClick={() => logout()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 text-xs font-semibold transition-colors cursor-pointer"
          title="تسجيل الخروج"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">خروج</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
      >
        <UserCircle2 className="w-4 h-4" />
        <span className="hidden sm:inline">حسابي</span>
      </button>

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setOpenModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5" dir="rtl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {mode === 'login' ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب جديد'}
              </h2>
              <button onClick={() => setOpenModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer" aria-label="إغلاق">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-blue-500" />
              احفظ مفضلتك وسجل نسخك في حسابك وتزامن تلقائياً عبر جميع أجهزتك.
            </p>

            <form onSubmit={submit} className="space-y-3">
              <label className="block">
                <span className="text-xs font-semibold text-slate-600">البريد الإلكتروني</span>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-blue-400">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-2.5 text-sm w-full outline-none bg-transparent"
                    placeholder="you@example.com"
                    required
                    dir="ltr"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-slate-600">كلمة المرور</span>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-blue-400">
                  <Lock className="w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="py-2.5 text-sm w-full outline-none bg-transparent"
                    placeholder="••••••••"
                    required
                    minLength={6}
                    dir="ltr"
                  />
                </div>
              </label>

              {error && (
                <div className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === 'login' ? 'دخول' : 'إنشاء الحساب'}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500">
              {mode === 'login' ? (
                <>
                  ليس لديك حساب؟{' '}
                  <button onClick={() => { setMode('register'); setError(null); }} className="text-blue-600 font-semibold hover:underline cursor-pointer">
                    إنشاء حساب
                  </button>
                </>
              ) : (
                <>
                  لديك حساب بالفعل؟{' '}
                  <button onClick={() => { setMode('login'); setError(null); }} className="text-blue-600 font-semibold hover:underline cursor-pointer">
                    تسجيل الدخول
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
