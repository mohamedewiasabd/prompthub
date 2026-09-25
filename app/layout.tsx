import type { Metadata, Viewport } from 'next';
import React, { Suspense } from 'react';
import './globals.css';
import { AdSenseScript } from '@/components/AdSenseScript';
import { PixelTracker } from '@/components/PixelTracker';
import { UserProvider } from '@/lib/use-user';
import { I18nProvider } from '@/lib/i18n';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { getDatabase } from '@/lib/db';

export const metadata: Metadata = {
  title: 'مكتبة البرومبتات الذكية | PromptHub',
  description: 'منصة مجانية 100% لعرض واكتشاف أفضل أوامر الذكاء الاصطناعي (Prompts) مع شروحات تفصيلية وروابط مباشرة وتوليد ذكي مدعوم بنماذج Gemini ومحسنة لمحركات البحث وروبوتات الذكاء الاصطناعي.',
  keywords: [
    'برومبتات', 'أوامر الذكاء الاصطناعي', 'ChatGPT Prompts', 'Midjourney Prompts', 'Claude Prompts',
    'هندسة البرومبت', 'Prompt Engineering', 'DeepSeek Prompts', 'ذكاء اصطناعي عربي', 'أوامر مجانية'
  ],
  authors: [{ name: 'PromptHub' }],
  metadataBase: new URL(process.env.APP_URL || 'https://live-stream-sport.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'مكتبة البرومبتات الذكية | PromptHub',
    description: 'منصة مجانية 100% لعرض واكتشاف أفضل أوامر الذكاء الاصطناعي (Prompts) مع شروحات تفصيلية وروابط مباشرة وتوليد ذكي مدعوم بنماذج Gemini ومحسنة لمحركات البحث وروبوتات الذكاء الاصطناعي.',
    type: 'website',
    locale: 'ar_SA',
    siteName: 'PromptHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مكتبة البرومبتات الذكية | PromptHub',
    description: 'منصة مجانية 100% لعرض واكتشاف أفضل أوامر الذكاء الاصطناعي (Prompts) مع شروحات تفصيلية وروابط مباشرة وتوليد ذكي مدعوم بنماذج Gemini ومحسنة لمحركات البحث وروبوتات الذكاء الاصطناعي.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = getDatabase();
  const pixelSettings = db.pixelSettings || null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'مكتبة البرومبتات الذكية | PromptHub',
    url: process.env.APP_URL || 'https://live-stream-sport.com',
    description: 'المرجع الأول لأوامر وبرومبتات الذكاء الاصطناعي المجانية 100%',
    inLanguage: 'ar',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.APP_URL || 'https://live-stream-sport.com'}?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white antialiased" suppressHydrationWarning>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          id="schema-org-website-jsonld"
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AdSenseScript />
        <Suspense fallback={null}>
          <PixelTracker pixelSettings={pixelSettings} />
        </Suspense>
        <I18nProvider>
          <UserProvider>{children}</UserProvider>
          <MobileBottomNav />
        </I18nProvider>
      </body>
    </html>
  );
}
