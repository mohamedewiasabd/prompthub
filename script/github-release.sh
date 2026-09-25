#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
#  نشر نواتج البناء إلى GitHub Releases من مجلد release/ المحلي
#  الاستخدام:  bash script/github-release.sh v1.0.0
#  يرفع: apk/aab + deb/rpm/AppImage + dmg/exe/msi + zip.ipa/ios غير موقعة
# ═══════════════════════════════════════════════════════════════════════
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
TAG="${1:?أعطِ الوسم مثل v1.0.0}"

REPO="mohamedewiasabd/prompthub"
TOKEN="$(sed -nE 's_https://[^/@]*:([^/@]+)@github\.com.*_\1_p' ~/.git-credentials 2>/dev/null | head -1)"
[ -n "$TOKEN" ] || { echo "لا توكن GitHub في ~/.git-credentials" >&2; exit 1; }
API="https://api.github.com/repos/$REPO"

# ═══ إعداد ملفات الإصدار ═══
STAGE="$(mktemp -d)"; trap 'rm -rf "$STAGE"' EXIT
VERSION="${TAG#v}"
find release/android -maxdepth 1 \( -name '*.apk' -o -name '*.aab' \) -exec cp {} "$STAGE/" \;
find release/desktop -type f \( -name '*.deb' -o -name '*.rpm' -o -name '*.AppImage' -o -name '*.dmg' -o -name '*.exe' -o -name '*.msi' \) -exec cp {} "$STAGE/" \;
if [ -d release/ios ]; then
  ( cd release/ios && zip -qr "$STAGE/prompthub_${VERSION}_ios_unsigned.zip" App.app )
fi
if [ -d release/ipa ]; then
  find release/ipa -name '*.ipa' -exec cp {} "$STAGE/" \;
fi

[ "$(ls -A "$STAGE")" ] || { echo "لا توجد نواتج في release/" >&2; exit 1; }
echo "═══ ملفات الإصدار $TAG ═══"
ls -lh "$STAGE" | awk '{printf "  %8s  %s\n",$5,$9}'

# ═══ إنشاء (أو إعادة استخدام) الإصدار ═══
BODY="PromptHub v$VERSION — مكتبة البرومبتات الذكية

الإصدار الرسمي للويب والهواتف وسطح المكتب:
- Web: https://live-stream-sport.com
- Android: APK + AAB
- iOS: unsigned .app/.ipa (يتطلب أسرار Apple للتوقيع)
- Desktop: Windows (exe/msi)، Linux (deb/rpm/AppImage)‏، macOS (dmg)‏"
jq -n --arg tag "$TAG" --arg body "$BODY" '{tag_name:$tag,name:$tag,body:$body,draft:false,prerelease:false}' > "$STAGE/release.json"
RELEASE_ID=""
HTTP=$(curl -s -o "$STAGE/create.out" -w '%{http_code}' -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" -X POST "$API/releases" \
  --data-binary @"$STAGE/release.json")
RELEASE_ID=$(python3 -c "import json;d=json.load(open('$STAGE/create.out'));print(d.get('id',''))")
if [ -z "$RELEASE_ID" ]; then
  # ربما وُجد سابقاً → جلب من الوسم
  RELEASE_ID=$(curl -s -H "Authorization: Bearer $TOKEN" "$API/releases/tags/$TAG" | python3 -c "import sys,json;print(json.load(sys.stdin).get('id',''))")
fi
[ -n "$RELEASE_ID" ] || { echo "فشل إنشاء الإصدار:"; cat "$STAGE/create.out"; exit 1; }
echo "✓ الإصدار id=$RELEASE_ID"

# ═══ رفع كل الأصول ═══
for f in "$STAGE"/*; do
  [ -f "$f" ] || continue
  case "$f" in *.json) continue ;; esac
  name="$(basename "$f")"
  echo "  ↑ رفع $name …"
  curl -s -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/octet-stream" \
    -X POST "$API/releases/$RELEASE_ID/assets?name=$name" \
    --data-binary @"$f" -o /dev/null
done
echo "✓ رُفع كل الأصول إلى $REPO/releases/tag/$TAG"