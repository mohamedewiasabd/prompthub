'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Category, Prompt, DifficultyLevel } from '@/types';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import { AdminAdSenseAndPixels } from '@/components/admin/AdminAdSenseAndPixels';
import { AdminVisitorAnalytics } from '@/components/admin/AdminVisitorAnalytics';
import { AdminLoginView } from '@/components/admin/AdminLoginView';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminAiGeneratorTab } from '@/components/admin/AdminAiGeneratorTab';
import { AdminPromptsTab } from '@/components/admin/AdminPromptsTab';
import { AdminCategoriesTab } from '@/components/admin/AdminCategoriesTab';
import { AdminSeoDiagnosticsTab } from '@/components/admin/AdminSeoDiagnosticsTab';
import { AdminBackupSettingsTab } from '@/components/admin/AdminBackupSettingsTab';
import {
  Sparkles,
  FileText,
  Layers,
  DollarSign,
  Activity,
  Bot,
  Database,
  KeyRound
} from 'lucide-react';
import { AdminApiTab } from '@/components/admin/AdminApiTab';

export default function SecretAdminPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUsername, setAdminUsername] = useState('');

  // Login form states
  const [loginUser, setLoginUser] = useState('');

  // Login form states
  const [loginPass, setLoginPass] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard active tab
  const [dashboardTab, setDashboardTab] = useState<
    'ai-generator' | 'prompts-crud' | 'categories-crud' | 'adsense-pixel' | 'visitor-analytics' | 'seo-diagnostics' | 'backup-settings' | 'api'
  >('ai-generator');

  // External API state
  const [apiKey, setApiKey] = useState('');
  const [apiKeyLoading, setApiKeyLoading] = useState(false);

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [, setDataLoading] = useState(false);

  // AI Generator state
  const [aiGenType, setAiGenType] = useState<'category' | 'batch-prompts' | 'custom-idea' | 'shortcuts'>('batch-prompts');
  const [aiCategoryCount, setAiCategoryCount] = useState<number>(3);
  const [aiSelectedCategorySlug, setAiSelectedCategorySlug] = useState<string>('');
  const [aiPromptCount, setAiPromptCount] = useState<number>(3);
  const [aiAdminIdea, setAiAdminIdea] = useState<string>('');
  const [aiCustomNotes, setAiCustomNotes] = useState<string>('');
  const [aiShortcutCount, setAiShortcutCount] = useState<number>(5);
  const [aiShortcutIdea, setAiShortcutIdea] = useState<string>('');
  const [aiShortcutCategory, setAiShortcutCategory] = useState<string>('');
  const [aiShortcutKeyword, setAiShortcutKeyword] = useState<string>('');
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiResultLog, setAiResultLog] = useState<string>('');

  // Manual Form Modals/Drawers
  const [isPromptFormOpen, setIsPromptFormOpen] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [promptForm, setPromptForm] = useState<{
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
  }>({
    title: '',
    titleEn: '',
    categoryId: '',
    categorySlug: '',
    description: '',
    promptText: '',
    models: 'ChatGPT (GPT-4o), Claude 3.7, Gemini 2.0',
    framework: 'Role-Task-Format',
    tags: 'ذكاء اصطناعي, برومبت',
    sampleOutput: '',
    tips: 'كن محدداً في المدخلات',
    difficulty: 'متوسط',
    featured: false
  });

  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingCategorySlug, setEditingCategorySlug] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    nameEn: '',
    slug: '',
    description: '',
    icon: 'Sparkles'
  });

  // Settings form
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');

  // Firebase Cloud Sync state
  const [cloudSyncLoading, setCloudSyncLoading] = useState(false);
  const [cloudSyncInfo, setCloudSyncInfo] = useState<{
    exists?: boolean;
    lastSynced?: string;
    cloudCategoriesCount?: number;
    cloudPromptsCount?: number;
    message?: string;
  } | null>(null);

  // Toast messages
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getStoredToken = () => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('ph_admin_token') || sessionStorage.getItem('ph_admin_token') || '';
  };

  const adminFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = getStoredToken();
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
      headers.set('x-admin-token', token);
    }
    return fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });
  }, []);

  const checkCloudSyncInfo = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin/sync-firebase');
      const data = await res.json();
      if (data.success) {
        setCloudSyncInfo(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [adminFetch]);

  const loadApiKey = useCallback(async () => {
    try {
      const token = getStoredToken();
      const res = await fetch('/api/admin/api-key', {
        headers: token ? { Authorization: `Bearer ${token}`, 'x-admin-token': token } : {},
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success && data.apiKey) setApiKey(data.apiKey);
    } catch {}
  }, []);

  const loadAllData = useCallback(async () => {
    try {
      setDataLoading(true);
      const [catsRes, promptsRes] = await Promise.all([
        fetch('/api/categories', { cache: 'no-store' }),
        fetch('/api/prompts', { cache: 'no-store' })
      ]);

      const catsData = await catsRes.json();
      const promptsData = await promptsRes.json();

      if (catsData.success) {
        setCategories(catsData.categories || []);
        if (catsData.categories?.length > 0 && !aiSelectedCategorySlug) {
          setAiSelectedCategorySlug(catsData.categories[0].slug);
        }
      }
      if (promptsData.success) {
        setPrompts(promptsData.prompts || []);
      }
      loadApiKey();
      checkCloudSyncInfo();
    } catch (err) {
      console.error(err);
      addToast('error', 'فشل تحميل بيانات لوحة الإدارة');
    } finally {
      setDataLoading(false);
    }
  }, [aiSelectedCategorySlug, checkCloudSyncInfo, loadApiKey]);

  const handleRegenerateApiKey = async () => {
    setApiKeyLoading(true);
    try {
      const token = getStoredToken();
      const res = await fetch('/api/admin/api-key', {
        method: 'POST',
        headers: token
          ? { Authorization: `Bearer ${token}`, 'x-admin-token': token, 'Content-Type': 'application/json' }
          : { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success && data.apiKey) {
        setApiKey(data.apiKey);
        addToast('success', 'تم توليد مفتاح API جديد وأُلغي القديم');
      } else {
        addToast('error', data.error || 'فشل توليد مفتاح جديد');
      }
    } catch {
      addToast('error', 'فشل توليد مفتاح جديد');
    } finally {
      setApiKeyLoading(false);
    }
  };

  // Check auth on mount
  useEffect(() => {
    let isMounted = true;
    async function initAuth() {
      try {
        const token = getStoredToken();
        const res = await fetch('/api/admin/auth', {
          headers: token ? { Authorization: `Bearer ${token}`, 'x-admin-token': token } : {},
          credentials: 'include'
        });
        const data = await res.json();
        if (!isMounted) return;
        if (data.authenticated) {
          setIsAuthenticated(true);
          setAdminUsername(data.adminUsername || 'admin');
          loadAllData();
        } else {
          if (token && !data.authenticated) {
            localStorage.removeItem('ph_admin_token');
            sessionStorage.removeItem('ph_admin_token');
          }
          setIsAuthenticated(false);
        }
      } catch {
        if (isMounted) setIsAuthenticated(false);
      }
    }
    initAuth();
    return () => {
      isMounted = false;
    };
  }, [loadAllData]);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: loginUser, password: loginPass })
      });
      const data = await res.json();

      if (data.success) {
        if (data.token) {
          localStorage.setItem('ph_admin_token', data.token);
          sessionStorage.setItem('ph_admin_token', data.token);
        }
        setIsAuthenticated(true);
        setAdminUsername(loginUser);
        addToast('success', 'مرحباً بك في لوحة تحكم الإدارة!');
        loadAllData();
      } else {
        setLoginError(data.error || 'بيانات الدخول غير صحيحة');
      }
    } catch {
      setLoginError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('ph_admin_token');
      sessionStorage.removeItem('ph_admin_token');
      await fetch('/api/admin/auth', { method: 'DELETE', credentials: 'include' });
      setIsAuthenticated(false);
      addToast('info', 'تم تسجيل الخروج بنجاح');
    } catch (err) {
      console.error(err);
    }
  };

  // AI GENERATION: CATEGORIES
  const handleAIGenerateCategories = async () => {
    setAiGenerating(true);
    setAiResultLog('جاري الاتصال بنموذج Gemini وتوليد الأقسام الذكية...');
    try {
      const res = await adminFetch('/api/admin/generate-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: aiCategoryCount, autoSave: true })
      });
      const data = await res.json();

      if (data.success) {
        addToast('success', 'تم توليد الأقسام بنجاح!', `تمت إضافة ${data.generated?.length} أقسام`);
        setAiResultLog(
          `✅ نجاح: تم توليد وحفظ الأقسام التالية:\n` +
            data.generated.map((c: any) => `- ${c.name} (${c.nameEn}): ${c.description}`).join('\n')
        );
        loadAllData();
      } else {
        addToast('error', 'فشل التوليد', data.error);
        setAiResultLog(`❌ خطأ: ${data.error}`);
      }
    } catch (err: any) {
      addToast('error', 'خطأ في التوليد', err.message);
      setAiResultLog(`❌ خطأ: ${err.message}`);
    } finally {
      setAiGenerating(false);
    }
  };

  // AI GENERATION: PROMPTS
  const handleAIGeneratePrompts = async () => {
    if (!aiSelectedCategorySlug) {
      addToast('error', 'يرجى اختيار القسم أولاً');
      return;
    }

    setAiGenerating(true);
    setAiResultLog('جاري صياغة وهندسة البرومبتات الذكية بواسطة Gemini...');
    try {
      const res = await adminFetch('/api/admin/generate-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categorySlug: aiSelectedCategorySlug,
          count: aiPromptCount,
          adminIdea: aiAdminIdea.trim() || undefined,
          customNotes: aiCustomNotes.trim() || undefined,
          autoSave: true
        })
      });
      const data = await res.json();

      if (data.success) {
        addToast('success', 'تم توليد البرومبتات بنجاح!', `تم حفظ ${data.generated?.length} برومبتات`);
        setAiResultLog(
          `✅ نجاح: تم توليد وإضافة البرومبتات التالية لقسم [${aiSelectedCategorySlug}]:\n\n` +
            data.generated
              .map(
                (p: any, i: number) =>
                  `${i + 1}. ${p.title}\nالوصف: ${p.description}\nالنماذج: ${p.models.join(', ')}\n`
              )
              .join('\n')
        );
        setAiAdminIdea('');
        loadAllData();
      } else {
        addToast('error', 'فشل توليد البرومبتات', data.error);
        setAiResultLog(`❌ خطأ: ${data.error}`);
      }
    } catch (err: any) {
      addToast('error', 'خطأ في التوليد', err.message);
      setAiResultLog(`❌ خطأ: ${err.message}`);
    } finally {
      setAiGenerating(false);
    }
  };

  // AI GENERATION: SLASH COMMANDS / SHORTCUTS
  const handleAIGenerateShortcuts = async () => {
    setAiGenerating(true);
    setAiResultLog('جاري توليد أوامر الاختصار الذكية بواسطة Gemini...');
    try {
      const res = await adminFetch('/api/admin/generate-shortcuts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: aiShortcutCount,
          adminIdea: aiShortcutIdea.trim() || undefined,
          category: aiShortcutCategory.trim() || undefined,
          keyword: aiShortcutKeyword.trim() || undefined,
          autoSave: true
        })
      });
      const data = await res.json();

      if (data.success) {
        addToast('success', 'تم توليد أوامر الاختصار بنجاح!', `تم حفظ ${data.generated?.length} أوامر`);
        setAiResultLog(
          `✅ نجاح: تم توليد وحفظ أوامر الاختصار التالية:\n\n` +
            data.generated
              .map(
                (s: any, i: number) =>
                  `${i + 1}. ${s.slash ? s.slash : '/' + s.command} — ${s.name}\nالوصف: ${s.description}\nالتصنيف: ${s.category}\n`
              )
.join('\n')
        );
        setAiShortcutIdea('');
        setAiShortcutCategory('');
        setAiShortcutKeyword('');
        loadAllData();
      } else {
        addToast('error', 'فشل توليد الأوامر', data.error);
        setAiResultLog(`❌ خطأ: ${data.error}`);
      }
    } catch (err: any) {
      addToast('error', 'خطأ في التوليد', err.message);
      setAiResultLog(`❌ خطأ: ${err.message}`);
    } finally {
      setAiGenerating(false);
    }
  };

  // Prompt Manual CRUD
  const handleOpenNewPrompt = () => {
    setEditingPromptId(null);
    setPromptForm({
      title: '',
      titleEn: '',
      categoryId: categories[0]?.id || '',
      categorySlug: categories[0]?.slug || '',
      description: '',
      promptText: '',
      models: 'ChatGPT (GPT-4o), Claude 3.7, Gemini 2.0',
      framework: 'Role-Task-Format',
      tags: 'ذكاء اصطناعي, تسويق',
      sampleOutput: '',
      tips: 'اكتب مدخلاتك بدقة',
      difficulty: 'متوسط',
      featured: true
    });
    setIsPromptFormOpen(true);
  };

  const handleEditPrompt = (p: Prompt) => {
    setEditingPromptId(p.id);
    setPromptForm({
      title: p.title,
      titleEn: p.titleEn || '',
      categoryId: p.categoryId,
      categorySlug: p.categorySlug,
      description: p.description,
      promptText: p.promptText,
      models: p.models.join(', '),
      framework: p.framework || '',
      tags: p.tags.join(', '),
      sampleOutput: p.sampleOutput || '',
      tips: p.tips ? p.tips.join('\n') : '',
      difficulty: p.difficulty,
      featured: p.featured
    });
    setIsPromptFormOpen(true);
  };

  const handleSavePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedCat = categories.find((c) => c.id === promptForm.categoryId || c.slug === promptForm.categorySlug);
      const payload = {
        title: promptForm.title,
        titleEn: promptForm.titleEn,
        categoryId: selectedCat?.id || promptForm.categoryId,
        categorySlug: selectedCat?.slug || promptForm.categorySlug,
        description: promptForm.description,
        promptText: promptForm.promptText,
        models: promptForm.models.split(',').map((s) => s.trim()).filter(Boolean),
        framework: promptForm.framework,
        tags: promptForm.tags.split(',').map((s) => s.trim()).filter(Boolean),
        sampleOutput: promptForm.sampleOutput,
        tips: promptForm.tips.split('\n').map((s) => s.trim()).filter(Boolean),
        difficulty: promptForm.difficulty,
        featured: promptForm.featured
      };

      const url = editingPromptId ? `/api/prompts/${editingPromptId}` : '/api/prompts';
      const method = editingPromptId ? 'PUT' : 'POST';

      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        addToast('success', editingPromptId ? 'تم تحديث البرومبت بنجاح' : 'تمت إضافة البرومبت الجديد بنجاح');
        setIsPromptFormOpen(false);
        loadAllData();
      } else {
        addToast('error', 'فشل الحفظ', data.error);
      }
    } catch (err: any) {
      addToast('error', 'خطأ في الحفظ', err.message);
    }
  };

  const handleDeletePrompt = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا البرومبت؟')) return;
    try {
      const res = await adminFetch(`/api/prompts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addToast('info', 'تم حذف البرومبت بنجاح');
        loadAllData();
      } else {
        addToast('error', 'فشل الحذف', data.error);
      }
    } catch (err: any) {
      addToast('error', 'خطأ', err.message);
    }
  };

  // Category Manual CRUD
  const handleOpenNewCategory = () => {
    setEditingCategorySlug(null);
    setCategoryForm({
      name: '',
      nameEn: '',
      slug: '',
      description: '',
      icon: 'Sparkles'
    });
    setIsCategoryFormOpen(true);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategorySlug(cat.slug);
    setCategoryForm({
      name: cat.name,
      nameEn: cat.nameEn,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon
    });
    setIsCategoryFormOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategorySlug ? `/api/categories/${editingCategorySlug}` : '/api/categories';
      const method = editingCategorySlug ? 'PUT' : 'POST';

      const res = await adminFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });
      const data = await res.json();

      if (data.success) {
        addToast('success', editingCategorySlug ? 'تم تحديث القسم بنجاح' : 'تمت إضافة القسم الجديد بنجاح');
        setIsCategoryFormOpen(false);
        loadAllData();
      } else {
        addToast('error', 'فشل الحفظ', data.error);
      }
    } catch (err: any) {
      addToast('error', 'خطأ', err.message);
    }
  };

  const handleDeleteCategory = async (slug: string) => {
    if (!confirm(`هل أنت متأكد من حذف هذا القسم (${slug})؟`)) return;
    try {
      const res = await adminFetch(`/api/categories/${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addToast('info', 'تم حذف القسم بنجاح');
        loadAllData();
      } else {
        addToast('error', 'فشل الحذف', data.error);
      }
    } catch (err: any) {
      addToast('error', 'خطأ', err.message);
    }
  };

  // Export DB
  const handleExportBackup = () => {
    const token = getStoredToken();
    window.location.href = `/api/admin/export${token ? `?token=${encodeURIComponent(token)}` : ''}`;
    addToast('success', 'جاري تنزيل النسخة الاحتياطية JSON...');
  };

  // Firebase Cloud Push
  const handleCloudPush = async () => {
    setCloudSyncLoading(true);
    try {
      const res = await adminFetch('/api/admin/sync-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'push' })
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'تم الحفظ والمزامنة السحابية بنجاح!', data.message);
        checkCloudSyncInfo();
      } else {
        addToast('error', 'فشل الحفظ السحابي', data.error);
      }
    } catch (err: any) {
      addToast('error', 'خطأ أثناء المزامنة السحابية', err.message);
    } finally {
      setCloudSyncLoading(false);
    }
  };

  // Firebase Cloud Pull
  const handleCloudPull = async () => {
    if (!confirm('هل أنت متأكد من رغبتك في استرداد البيانات من سحابة Firebase؟ سيتم استبدال البيانات المحلية بالبيانات السحابية.')) {
      return;
    }

    setCloudSyncLoading(true);
    try {
      const res = await adminFetch('/api/admin/sync-firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pull' })
      });
      const data = await res.json();
      if (data.success) {
        addToast('success', 'تم استرداد البيانات من السحابة بنجاح!', data.message);
        loadAllData();
        checkCloudSyncInfo();
      } else {
        addToast('error', 'فشل استرداد البيانات السحابية', data.error);
      }
    } catch (err: any) {
      addToast('error', 'خطأ أثناء استرداد البيانات', err.message);
    } finally {
      setCloudSyncLoading(false);
    }
  };

  // Import DB
  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const res = await adminFetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
      });
      const data = await res.json();

      if (data.success) {
        addToast('success', 'تم استيراد النسخة الاحتياطية بنجاح!', data.message);
        loadAllData();
      } else {
        addToast('error', 'فشل الاستيراد', data.error);
      }
    } catch (err: any) {
      addToast('error', 'ملف غير صالح', err.message);
    }
  };

  // Update Admin Credentials
  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsernameInput && !newPasswordInput) {
      addToast('error', 'يرجى إدخال اسم مستخدم أو كلمة مرور جديدة');
      return;
    }

    try {
      const res = await adminFetch('/api/admin/auth', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newUsername: newUsernameInput || undefined,
          newPassword: newPasswordInput || undefined
        })
      });
      const data = await res.json();

      if (data.success) {
        addToast('success', 'تم تحديث بيانات الدخول بنجاح!');
        setNewUsernameInput('');
        setNewPasswordInput('');
      } else {
        addToast('error', 'فشل التحديث', data.error);
      }
    } catch (err: any) {
      addToast('error', 'خطأ', err.message);
    }
  };

  // IF LOADING AUTH
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // IF NOT AUTHENTICATED: SHOW SECURE LOGIN
  if (!isAuthenticated) {
    return (
      <>
        <AdminLoginView
          loginUser={loginUser}
          setLoginUser={setLoginUser}
          loginPass={loginPass}
          setLoginPass={setLoginPass}
          loginLoading={loginLoading}
          loginError={loginError}
          onLogin={handleLogin}
        />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <AdminHeader
        adminUsername={adminUsername}
        categories={categories}
        prompts={prompts}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          <button
            onClick={() => setDashboardTab('ai-generator')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              dashboardTab === 'ai-generator'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>لوحة التوليد بالذكاء الاصطناعي (Gemini)</span>
          </button>

          <button
            onClick={() => setDashboardTab('prompts-crud')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              dashboardTab === 'prompts-crud'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>إدارة وتعديل البرومبتات ({prompts.length})</span>
          </button>

          <button
            onClick={() => setDashboardTab('categories-crud')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              dashboardTab === 'categories-crud'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>إدارة الأقسام والروابط ({categories.length})</span>
          </button>

          <button
            onClick={() => setDashboardTab('adsense-pixel')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              dashboardTab === 'adsense-pixel'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>الإعلانات والبكسل والتتبع</span>
          </button>

          <button
            onClick={() => setDashboardTab('visitor-analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              dashboardTab === 'visitor-analytics'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 text-rose-500" />
            <span>إحصائيات الزيارات الدقيقة</span>
          </button>

          <button
            onClick={() => setDashboardTab('seo-diagnostics')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              dashboardTab === 'seo-diagnostics'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>حالة السيو ومحركات الـ LLM (GEO)</span>
          </button>

          <button
            onClick={() => setDashboardTab('backup-settings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              dashboardTab === 'backup-settings'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>النسخ الاحتياطي وحساب المشرف</span>
          </button>

          <button
            onClick={() => setDashboardTab('api')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              dashboardTab === 'api'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>واجهة API الخارجية</span>
          </button>
        </div>

        {/* TAB 1: AI GENERATOR */}
        {dashboardTab === 'ai-generator' && (
          <AdminAiGeneratorTab
            categories={categories}
            aiGenType={aiGenType}
            setAiGenType={setAiGenType}
            aiCategoryCount={aiCategoryCount}
            setAiCategoryCount={setAiCategoryCount}
            aiSelectedCategorySlug={aiSelectedCategorySlug}
            setAiSelectedCategorySlug={setAiSelectedCategorySlug}
            aiPromptCount={aiPromptCount}
            setAiPromptCount={setAiPromptCount}
            aiAdminIdea={aiAdminIdea}
            setAiAdminIdea={setAiAdminIdea}
            aiCustomNotes={aiCustomNotes}
            setAiCustomNotes={setAiCustomNotes}
            aiShortcutCount={aiShortcutCount}
            setAiShortcutCount={setAiShortcutCount}
            aiShortcutIdea={aiShortcutIdea}
            setAiShortcutIdea={setAiShortcutIdea}
            aiShortcutCategory={aiShortcutCategory}
            setAiShortcutCategory={setAiShortcutCategory}
            aiShortcutKeyword={aiShortcutKeyword}
            setAiShortcutKeyword={setAiShortcutKeyword}
            aiGenerating={aiGenerating}
            aiResultLog={aiResultLog}
            onGeneratePrompts={handleAIGeneratePrompts}
            onGenerateCategories={handleAIGenerateCategories}
            onGenerateShortcuts={handleAIGenerateShortcuts}
          />
        )}

        {/* TAB 2: PROMPTS CRUD */}
        {dashboardTab === 'prompts-crud' && (
          <AdminPromptsTab
            prompts={prompts}
            categories={categories}
            isPromptFormOpen={isPromptFormOpen}
            setIsPromptFormOpen={setIsPromptFormOpen}
            editingPromptId={editingPromptId}
            promptForm={promptForm}
            setPromptForm={setPromptForm}
            onOpenNewPrompt={handleOpenNewPrompt}
            onEditPrompt={handleEditPrompt}
            onDeletePrompt={handleDeletePrompt}
            onSavePrompt={handleSavePrompt}
          />
        )}

        {/* TAB 3: CATEGORIES CRUD */}
        {dashboardTab === 'categories-crud' && (
          <AdminCategoriesTab
            categories={categories}
            isCategoryFormOpen={isCategoryFormOpen}
            setIsCategoryFormOpen={setIsCategoryFormOpen}
            editingCategorySlug={editingCategorySlug}
            categoryForm={categoryForm}
            setCategoryForm={setCategoryForm}
            onOpenNewCategory={handleOpenNewCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onSaveCategory={handleSaveCategory}
            onShowToast={addToast}
          />
        )}

        {/* TAB 4: SEO DIAGNOSTICS */}
        {dashboardTab === 'seo-diagnostics' && <AdminSeoDiagnosticsTab />}

        {/* TAB 5: BACKUP & SETTINGS */}
        {dashboardTab === 'backup-settings' && (
          <AdminBackupSettingsTab
            cloudSyncInfo={cloudSyncInfo}
            cloudSyncLoading={cloudSyncLoading}
            onCheckCloudSyncInfo={checkCloudSyncInfo}
            onCloudPush={handleCloudPush}
            onCloudPull={handleCloudPull}
            onExportBackup={handleExportBackup}
            onImportBackup={handleImportBackup}
            newUsernameInput={newUsernameInput}
            setNewUsernameInput={setNewUsernameInput}
            newPasswordInput={newPasswordInput}
            setNewPasswordInput={setNewPasswordInput}
            onUpdateCredentials={handleUpdateCredentials}
          />
        )}

        {/* TAB 6: ADSENSE & PIXEL TRACKING */}
        {dashboardTab === 'adsense-pixel' && (
          <AdminAdSenseAndPixels onShowToast={addToast} />
        )}

        {/* TAB 7: VISITOR & CONVERSION ANALYTICS */}
        {dashboardTab === 'visitor-analytics' && (
          <AdminVisitorAnalytics onShowToast={addToast} />
        )}

        {/* TAB 8: EXTERNAL API */}
        {dashboardTab === 'api' && (
          <AdminApiTab
            apiKey={apiKey}
            loading={apiKeyLoading}
            onRegenerate={handleRegenerateApiKey}
          />
        )}
      </main>

      {/* TOAST CONTAINER */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
