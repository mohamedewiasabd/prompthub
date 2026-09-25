#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
#  البروتوكول الإلزامي الكامل لـ PromptHub — أمر واحد:
#    1) تصعيد الإصدار  2) الفحص (lint)  3) رفع نسخة الويب (Vercel)
#    4) التزام + دفع GitHub  5) انتظار CI (Android/iOS/Desktop) وجلب النواتج
#  التشغيل:  ./script/release-all.sh   أو   npm run release
#  ─────────────────────────────────────────────────────────────────────
#  إصدارات المفاتيح:
#    PROMPTHUB_SKIP_BUMP=1     → نشر بلا تصعيد (لا يمس رقم الإصدار)
#    PROMPTHUB_VERSION_BUMP=minor|patch|major → نوع التصعيد (الافتراضي minor)
#    PROMPTHUB_FETCH_ONLY=1    → جلب نواتج CI فقط ثم خروج
#    PROMPTHUB_FETCH_CI=0      → دفع + رفع ويب من دون انتظار/جلب نواتج CI
#    PROMPTHUB_NO_WEB=1        → تخطي رفع نسخة الويب إلى Vercel
# ═══════════════════════════════════════════════════════════════════════
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$(pwd)"
export PATH="$HOME/.nvm/versions/node/v22.22.0/bin:$PATH"

GRADLE="android/app/build.gradle"
PBX="ios/App/App.xcodeproj/project.pbxproj"
TAURI="src-tauri/tauri.conf.json"

log(){ printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }
ok(){ printf '\033[1;32m✓ %s\033[0m\n' "$*"; }

# ── الخطوة 0: تصعيد الإصدار (إجباري وتلقائي، يمكن إيقافه) ──────────────
VERSION="$(node -p "require('./package.json').version")"
VMAJOR="${VERSION%%.*}"; VMID="${VERSION#*.}"; VMINOR="${VMID%%.*}"; VPATCH="${VERSION##*.}"
VCODE="$(sed -nE 's/^[[:space:]]*versionCode[[:space:]]+([0-9]+).*/\1/p' "$GRADLE" | head -1 | tr -d '[:space:]')"
VCODE="${VCODE:-1}"

skip_bump=0
[ "${PROMPTHUB_SKIP_BUMP:-0}" = "1" ] && skip_bump=1
[ "${PROMPTHUB_FETCH_ONLY:-0}" = "1" ] && skip_bump=1

if [ "$skip_bump" = "0" ]; then
  BUMP="${PROMPTHUB_VERSION_BUMP:-minor}"
  case "$BUMP" in
    patch) VPATCH=$((VPATCH + 1)) ;;
    major) VMAJOR=$((VMAJOR + 1)); VMINOR=0; VPATCH=0 ;;
    *)     VMINOR=$((VMINOR + 1)); VPATCH=0 ;;
  esac
  NEW="$VMAJOR.$VMINOR.$VPATCH"
  VCODE=$((VCODE + 1))
  log "الخطوة 0 — تصعيد الإصدار تلقائياً (إجباري) $VERSION → $NEW (versionCode $VCODE)"
  node -e "const p=require('./package.json');p.version='$NEW';require('fs').writeFileSync('./package.json',JSON.stringify(p,null,2)+'\n')"
  sed -i -E 's/"version"[[:space:]]*:[[:space:]]*"[^"]*"/"version": "'"$NEW"'"/' "$TAURI"
  sed -i -E "s/(^[[:space:]]*versionCode[[:space:]]+)[0-9]+/\1${VCODE}/" "$GRADLE"
  sed -i -E 's/(^[[:space:]]*versionName[[:space:]]+)"[^"]*"/\1"'"$NEW"'"/' "$GRADLE"
  if [ -f "$PBX" ]; then
    sed -i -E "s/MARKETING_VERSION = [^;]+;/MARKETING_VERSION = $NEW;/g" "$PBX"
    sed -i -E "s/CURRENT_PROJECT_VERSION = [0-9]+;/CURRENT_PROJECT_VERSION = $VCODE;/g" "$PBX"
  fi
  VERSION="$NEW"
  ok "مزامنة: package.json + tauri.conf.json + android gradle + ios pbxproj → $NEW"
else
  log "الخطوة 0 — تصعيد الإصدار متخطَّى — نسخة ثابتة $VERSION"
fi

if [ "${PROMPTHUB_FETCH_ONLY:-0}" = "1" ]; then
  bash script/fetch-ci-artifacts.sh "$@"
  exit 0
fi

# ── الخطوة 1: الفحص ───────────────────────────────────────────────────
log "الخطوة 1 — الفحص (eslint)"
npm run lint
ok "الفحص سليم"

# ── الخطوة 2: رفع نسخة الويب إلى Vercel ───────────────────────────────
if [ "${PROMPTHUB_NO_WEB:-0}" = "0" ]; then
  log "الخطوة 2 — رفع نسخة الويب إلى Vercel (production)"
  npx vercel deploy --prod --yes
  ok "تم رفع الموقع — https://live-stream-sport.com"
else
  log "الخطوة 2 — تخطي رفع نسخة الويب (PROMPTHUB_NO_WEB=1)"
fi

# ── الخطوة 3: الالتزام والدفع ─────────────────────────────────────────
log "الخطوة 3 — الالتزام والدفع إلى GitHub"
git add -A
if git diff --cached --name-only | grep -Eiq '\.env($|\.)|keystore|local\.properties|\.data/|release/'; then
  echo "✗ خطأ: تم رصد ملفات سرية/نواتج داخل التزام — أزل ثم أعد المحاولة"
  exit 1
fi
git commit -m "إصدار $VERSION — توثيق رفع نسخة الويب + نواتج Android/iOS/Desktop عبر CI" || true
git push origin main
ok "تم الدفع إلى https://github.com/mohamedewiasabd/prompthub"

# ── الخطوة 4: انتظار CI وجلب النواتج ──────────────────────────────────
if [ "${PROMPTHUB_FETCH_CI:-0}" != "1" ]; then
  log "الخطوة 4 — انتظار خطوط العمل وجلب النواتج (Android/Desktop/iOS)"
  bash script/fetch-ci-artifacts.sh
  ok "تم جلب نواتج CI إلى release/{android,desktop,ipa}"
fi

log "اكتملت كل الخطوات — تقرير النواتج أعلاه."