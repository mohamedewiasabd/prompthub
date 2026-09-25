<div align="center">

# مكتبة البرومبتات الذكية | PromptHub

منصة عربية مجانية لعرض واكتشاف أوامر/برومبتات الذكاء الاصطناعي مع توليد ذكي عبر Gemini.

**الموقع الحي:** https://live-stream-sport.com

</div>

## التقنيات

- **Next.js 15 (App Router)** + **React 19** + **Tailwind CSS 4**
- **Firebase Firestore** (تخزين سحابي: وثيقة رئيسية صغيرة + 8 شاردات للبرومبتات)
- **Gemini** (توليد البرومبتات) — عبر API routes على الخادم
- **Vercel** (استضافة الويب)

## المنصات

| المنصة | البناء | النواتج |
| --- | --- | --- |
| Web | Vercel (`npm run web:deploy`) | https://live-stream-sport.com |
| Android | GitHub Actions (`android.yml`) | APK + AAB في `release/android/` |
| iOS | GitHub Actions (`ios.yml`) | `.ipa` أو `.app` غير موقَّع في `release/ipa/` و `release/ios/` |
| Windows / Linux / macOS | GitHub Actions Tauri (`desktop.yml`) | `release/desktop/{windows,linux,macos}/` |

التطبيقات الأصلية (Android/iOS/Desktop) قشور WebView تحمّل النسخة المنشورة من الموقع، لأن التطبيق يعتمد على Routes API على الخادم (التوليد والمزامنة السحابية).

## التشغيل محلياً

```bash
npm install
npm run dev        # http://localhost:3000
```

> متطلبات: **Node 22**. ضع `GEMINI_API_KEY` في `.env` (لا يُرفع).

## الإصدار والنشر

البروتوكول الإلزامي بخطواته ٠→٦ (تصعيد الإصدار → الفحص → رفع الويب → الدفع → جلب نواتج CI → التحقق → التقرير):

```bash
npm run release
```

- رفع نسخة الويب فقط: `npm run web:deploy`
- جلب نواتج CI إلى `release/`: `npm run fetch:ci`
- انظر `AGENTS.md` للتفاصيل والحدود الحمراء.

## الترخيص

جميع الحقوق محفوظة — PromptHub.