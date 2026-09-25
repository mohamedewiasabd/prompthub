import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prompthub.app',
  appName: 'PromptHub',
  webDir: 'web',
  server: {
    // الحِمل الفعلي: نسخة الويب المنشورة (Next.js له API routes على الخادم فيستحيل
    // تصديره إحصائياً — التطبيق الأصلي قشرة webview محمّلة على الموقع الحي).
    url: 'https://live-stream-sport.com',
    cleartext: false,
  },
  android: {
    backgroundColor: '#0f172a',
  },
  ios: {
    backgroundColor: '#0f172a',
  },
  plugins: {
    CapacitorApp: {},
  },
};

export default config;