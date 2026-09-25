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

## التثبيت على لينكس

### 1) مستودع APT الرسمي (Debian/Ubuntu)

```bash
sudo install -Dm644 <(curl -L https://mohamedewiasabd.github.io/prompthub/pubkey.asc) /etc/apt/keyrings/prompthub.asc
echo "deb [signed-by=/etc/apt/keyrings/prompthub.asc] https://mohamedewiasabd.github.io/prompthub stable main" | sudo tee /etc/apt/sources.list.d/prompthub.list
sudo apt update && sudo apt install prompthub
```

يُبنى المستودع تلقائياً بعد كل إصدار GitHub (سير عمل `apt-repo.yml` → فرع `apt-repo` على Pages).

### 2) Flatpak

```bash
flatpak install --user ./prompthub.flatpak
# أو من Flathub بعد القبول:
flatpak install io.github.mohamedewiasabd.prompthub
```

حزمة `prompthub.flatpak` تُبنى في كل إصدار GitHub (سير عمل `flatpak.yml`) — حمّلها من صفحة Releases أو من الأثر `prompthub-flatpak-x86_64`.

### 3) Arch (AUR) / Fedora (COPR) / openSUSE (OBS)

ملفات التعبئة جاهزة في `packaging/`: `aur/` (PKGBUILD)، `copr/` (spec)، `obs/` (spec + `_service`). يُقدَّم الرفع فور إنشاء الحسابات المعنية (لا يُنشئ الحسابات شخصياً). راجع `packaging/` لكل قناة.

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