# مكتبة البرومبتات الذكية | PromptHub — تعليمات العمل الإلزامية (AGENTS.md)

> هذا الملف إلزامي. **كل تعديل** على أي ملف في هذا المشروع يجب أن يمرّ ببروتوكول الإصدارات الكامل في البند ٥ دون استثناء، ولا يجوز إنهاء الجلسة قبل إتمام الخطوات والرفع إلى GitHub.

## ١) هوية المشروع

- تطبيق «مكتبة البرومبتات الذكية | PromptHub» — منصة عربية مجانية لعرض واكتشاف أوامر/برومبتات الذكاء الاصطناعي مع توليد ذكي عبر Gemini.
- التقنيات: **Next.js 15 (App Router) + React 19 + Tailwind 4 + Firebase (Firestore) + Vercel**.
- المستودع (عام): `https://github.com/mohamedewiasabd/prompthub` — الفرع `main`.
- الموقع الحي: `https://live-stream-sport.com` (Vercel — مشروع `prompthub` مربوط عبر `.vercel/project.json`).
- المصدر الوحيد لرقم الإصدار: `package.json` (`version`)، وتوازنه سكربت الإصدار في: `src-tauri/tauri.conf.json`، `android/app/build.gradle` (versionName/versionCode)، و`ios/App/App.xcodeproj/project.pbxproj` (MARKETING_VERSION/CURRENT_PROJECT_VERSION).
- **بنية التخزين السحابي (حرجة — لا تُرجعها أبداً):** مستند Firestore الرئيسي `system/prompthub-master-store` صغير (أقسام/اختصارات/إعدادات/عدّادات فقط)، بينما البرومبتات موزّعة على **8 شاردات** `system/prompthub-prompts-shard-0..7` بتجزئة ثابتة حسب `id`، والنص الإنجليزي في `system/prompthub-en`. **سبب هذه البنية:** حدود Firestore الصارمة 1 ميجابايت للمستند — حين تجاوزتها وثيقة موحّدة رفضت الكتابة فأحدثت «اختفاء» البرومبتات المولّدة. أي تعديل يدمج البرومبتات في مستند واحد أو يعرّف مسارات الشاردات = خطأ ممنوع (انظر `lib/firestore-sync.ts`).

## ٢) مصفوفة المنصات والحالة الفعلية

| المنصة | الحالة | المخرجات الثابتة / المصدر |
| --- | --- | --- |
| Web | متاحة ✅ | `https://live-stream-sport.com` (رفع: `npm run web:deploy`) |
| Android (APK + AAB) | بُنيت عبر CI ✅ | `release/android/prompthub-release.apk` + `prompthub-release.aab` + `prompthub-debug.apk` (سطر `android.yml`) |
| iOS (iPhone/iPad) | بُنيت عبر CI ✅ (غير مُوقَّعة دون أسرار Apple) | `release/ipa/*.ipa` أو `release/ios/*.app` (سطر `ios.yml`) |
| Windows سطح المكتب | بُنيت عبر CI ✅ (exe + msi) | `release/desktop/windows/` (سطر `desktop.yml`) |
| Linux سطح المكتب | بُنيت عبر CI ✅ (deb + AppImage) | `release/desktop/linux/` (سطر `desktop.yml` أو محلياً) |
| توزيع لينكس (APT) | منشور عبر GitHub Pages ✅ | مستودع Debian/Ubuntu على `https://mohamedewiasabd.github.io/prompthub` (سطر `apt-repo.yml`) |
| توزيع لينكس (Flatpak) | بُنيت عبر CI ✅ | حزمة `prompthub.flatpak` في Releases (سطر `flatpak.yml`) |
| توزيع لينكس (AUR/COPR/OBS) | ملفات جاهزة ⏳ تنتظر حسابات المستخدم | `packaging/aur` + `packaging/copr` + `packaging/obs` |
| macOS سطح المكتب | بُنيت عبر CI ✅ (dmg intel/aarch64) | `release/desktop/macos/` (سطر `desktop.yml`) |

- **طبيعة النواتج الأصلية:** هذا التطبيق Next.js له Routes API على الخادم (Firestore + توليد Gemini) فيستحيل تصديره إحصائياً داخل مشروع أصلي. لذا **الأندرويد/اiOS/سطح المكتب قشور webview تحمّل الموقع الحي** (`web/index.html` يعيد التوجيه، و`capacitor.config.ts` يستخدم `server.url`، و`tauri.conf.json` يشير لـ `../web`). الأصل يضمن بقاء كل خصائص الخادم (التوليد/المزامنة) تعمل دون تغيير.
- أسماء ملفات النواتج تتبع ما يضعه السطر العمل — تُجلب تلقائياً إلى `release/` عبر `npm run fetch:ci`.

## ٣) متطلبات البناء والتشغيل

1. **Node 22** (النظام فيه Node 18 أصلاً):
   `export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"`
2. **Rust stable** للبناء المحلي لسطح المكتب (Tauri): `export PATH="$HOME/.cargo/bin:$PATH"`. البناء المحلي للـ Linux يتطلب أولاً:
   `sudo apt install libwebkit2gtk-4.1-dev build-essential libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev`
   وإن تعذّر محلياً، البناء عبر CI (`desktop.yml`) — اذكر ذلك بدل اختلاق ملفات.
3. **الاعتماديات:** `npm install` فقط (هناك `.npmrc` بـ `legacy-peer-deps=true`)؛ لا تستخدم bun. أزيل `bun.lock` — `package-lock.json` هو السجل الوحيد.
4. **الفحص بعد أي تعديل:** `npm run lint` (eslint) — ويفضَّل دائماً أيضاً `npm run build` (next build) عند المساس بكود الويب.
5. **Vercel CLI:** محلياً في `devDependencies` (`npx vercel`) — حسابه مربوط: `wafaamohamedra-3492` (التحقق: `npx vercel whoami`).
6. **GitHub token** (لجلب نواتج CI فقط): مقروء من `~/.git-credentials` — **لا يُرسَل/يُعرَض أبداً**.
7. **iOS الموقَّع** يتطلب أسرار Apple في إعدادات المستودع (Settings → Secrets): `APPLE_CERT_P12`، `APPLE_CERT_PASSWORD`، `APPLE_PROFILE_MOBILEPROVISION`، `APPLE_TEAM_ID`. بدونها يُبني سطر `ios.yml` ملف `.app` غير مُوقَّع فقط.
8. **سطر عمل iOS** يحقن خطوة "Patch plugins Swift API" للإصدارات القديمة من مكونات Capacitor (علم `NonescapableTypes`) — لا تُلغِها.

## ٤) أسرار البيئة في الإنتاج (Vercel)
- `.env` المحلي يحتوي `GEMINI_API_KEY` (مسوّد وبدون رفع). على Vercel تُضبط المتغيرات في إعدادات المشروع (لوحة Vercel → Settings → Environment Variables). إن عُدِّلت المتغيرات في Vercel يُعاد النشر لتفعيلها.

## ٥) البروتوكول الإلزامي بعد كل تعديل (بالترتيب)

> **الأمر الواحد الإلزامي:** `npm run release` (= `bash script/release-all.sh`) يَنفّذ الخطوات ٠→٦ كلها بنفس الترتيب أدناه. مفاتيح التشغيل: `PROMPTHUB_SKIP_BUMP=1` (بلا تصعيد)، `PROMPTHUB_VERSION_BUMP=patch|minor|major`، `PROMPTHUB_FETCH_ONLY=1` (جلب نواتج CI فقط)، `PROMPTHUB_FETCH_CI=1` (دفع من دون انتظار/جلب)، `PROMPTHUB_NO_WEB=1` (تخطي رفع الويب).

### الخطوة 0 — تصعيد رقم الإصدار (إجباري وتلقائي)
`release-all.sh` يقرأ `version` من `package.json` ويرفع minor افتراضياً، ويزيد `versionCode` +1 في `android/app/build.gradle`، ويوازن `tauri.conf.json` + `ios/project.pbxproj` (MARKETING_VERSION + CURRENT_PROJECT_VERSION). دون تصعيد لن يكتشف المستخدمون/المتاجر تحديثاً. أسبق إيقاف التصعيد المشروعة: `PROMPTHUB_SKIP_BUMP=1` أو `PROMPTHUB_FETCH_ONLY=1`.

### الخطوة 1 — الفحص
```bash
npm run lint
```

### الخطوة 2 — رفع نسخة الموقع (Vercel) — إجباري
```bash
npx vercel deploy --prod --yes
```
- الرفع يبني عند Vercel (البناء بعيد، لا يحتاج بيئة محلية) ويربط النطاق `live-stream-sport.com` تلقائياً.
- بعد الرفع تحقق سريع: `curl -s https://live-stream-sport.com/api/prompts | head -c 200`.
- لتخطي الرفع في دورة واحدة: `PROMPTHUB_NO_WEB=1 npm run release`.

### الخطوة 3 — الالتزام والدفع (إلزامي)
```bash
git add -A
git diff --cached --name-only | grep -Eiq '\.env($|\.)|keystore|local\.properties|\.data/|release/'
# يجب ألا يُطبع أي مسار — سكربت release يكسر الإجراء إن ظهر
git commit -m "وصف واضح بالعربية للتعديل"
git push origin main
```

### الخطوة 4 — بناء ونواتج Android/iOS/Desktop عبر GitHub Actions (تلقائي)
بعد الدفع، تشغَّل تلقائياً: `android.yml` (APK+AAB)، `ios.yml` (unsigned .app أو .ipa موقّع)، `desktop.yml` (Windows/Linux/macOS). ثم `release-all.sh` / `npm run fetch:ci` ينتظر إتمامها (مهلة 25 دقيقة) وينزّل النواتج عبر GitHub API إلى `release/{android,desktop,ipa}` مع طباعة MD5.

### الخطوة 5 — التحقق من النواتج (إجباري قبل التسليم)
```bash
md5sum release/android/*.apk release/android/*.aab release/desktop/*/* release/ipa/*.ipa 2>/dev/null
```

### الخطوة 6 — تقرير للمستخدم (بالعربية)
قائمة بكل ملف ناتج: الاسم + الحجم + MD5، ورابط المستودع، وتأكيد إتمام رفع الويب.

## ٦) حدود حمراء (ممنوع نهائيًا)
- **أبدًا لا تُرفع:** `.env` وما خلفه، `.data/store.json` (يحتوي `adminSettings` بكلمة مرور المدير!—محجوب عبر `.data/`)، مفتاح توقيع أو `keystore.properties`/`local.properties`، `release/` (نواتج CI)، `.vercel/`، `.firebase/`.
- لا تُرجع بنية شاردات Firestore إلى مستند واحد، ولا تُسقط منطق الدمج الـ union في `lib/firestore-sync.ts` (يمنع فقدان/اختفاء البيانات بين مثيلات Vercel).
- لا تتجاوز خطوات البند ٥، ولا تنهي الجلسة قبل رفع الويب + الدفع.

## ٧) مواضع الملفات
- **تُرفع:** `app/`، `components/`، `lib/`، `types/`، `hooks/`، `public/`، `src-tauri/` (Tauri)، `android/` (عدا مخرجات البناء)، `ios/` (عدا `App/build`)، `capacitor.config.ts`، `web/`، `.github/workflows/` (android.yml + ios.yml + desktop.yml + flatpak.yml + apt-repo.yml)، `script/`، `firestore.rules`، `firebase.json`، `packaging/` (حِزَم لينكس: flatpak + aur + copr + obs + apt + linux).
- **لا تُرفع (محجوبة في `.gitignore`):** `node_modules/`، `.next/`، `.data/`، `.env*`، `.vercel/`، `.firebase/`، `release/`، `android/app/build/`، `ios/App/build/`، `src-tauri/target/`.