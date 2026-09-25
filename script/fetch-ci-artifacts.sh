#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
#  جلب نواتج CI (Android / Desktop / iOS) من GitHub Actions للالتزام الحالي
#  الاستخدام:  bash script/fetch-ci-artifacts.sh [SHA]
#  ينتهي بصفر بعد تحميل كل النواتج في release/{android,desktop,ipa}
# ═══════════════════════════════════════════════════════════════════════
set -uo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"
REPO="mohamedewiasabd/prompthub"

TOKEN="$(sed -nE 's_https://[^/@]*:([^/@]+)@github\.com.*_\1_p' ~/.git-credentials 2>/dev/null | head -1)"
[ -z "$TOKEN" ] && { echo "⚠ لا يوجد توكن GitHub في ~/.git-credentials"; exit 1; }

SHA="${1:-$(git rev-parse HEAD)}"
API="https://api.github.com/repos/$REPO"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

log(){ printf '\n\033[1;36m▶ %s\033[0m\n' "$*"; }
ok(){ printf '\033[1;32m✓ %s\033[0m\n' "$*"; }

log "انتظار إتمام خطوط العمل للالتزام $SHA (مهلة 25 دقيقة)…"
deadline=$(( $(date +%s) + 1500 ))
while :; do
  pending=0
  while read -r id st; do
    [ -z "$id" ] && continue
    [ "$st" = "completed" ] || pending=$((pending + 1))
  done < <(curl -s -H "Authorization: Bearer $TOKEN" "$API/actions/runs?head_sha=$SHA&per_page=20" | jq -r '.workflow_runs[] | [.id,.status] | @tsv')
  if [ "$pending" -eq 0 ]; then break; fi
  if [ "$(date +%s)" -ge "$deadline" ]; then
    echo "⚠ انتهت المهلة — أعد التشغيل لاحقاً: npm run fetch:ci"
    exit 1
  fi
  sleep 20
done

for run_id in $(curl -s -H "Authorization: Bearer $TOKEN" "$API/actions/runs?head_sha=$SHA&per_page=20" | jq -r '.workflow_runs[].id'); do
  while read -r art_id art_name; do
    [ -z "$art_id" ] && continue
    curl -sL -H "Authorization: Bearer $TOKEN" "$API/actions/artifacts/$art_id/zip" -o "$TMP/a.zip" || continue
    unzip -oq "$TMP/a.zip" -d "$TMP/$art_name" 2>/dev/null || true
    rm -f "$TMP/a.zip"
  done < <(curl -s -H "Authorization: Bearer $TOKEN" "$API/actions/runs/$run_id/artifacts" | jq -r '.artifacts[] | "\(.id) \(.name)"')
done

# Android
if [ -d "$TMP/prompthub-android" ]; then
  mkdir -p "$ROOT/release/android"
  find "$TMP/prompthub-android" -type f \( -name '*.apk' -o -name '*.aab' \) -exec cp {} "$ROOT/release/android/" \; 2>/dev/null || true
  ok "Android → release/android: $(find "$ROOT/release/android" -name '*.apk' -o -name '*.aab' | wc -l) ملف"
fi

# Desktop
for d in "$TMP"/prompthub-desktop-*; do
  [ -d "$d" ] || continue
  case "$(basename "$d")" in
    *ubuntu-22.04*) src="$ROOT/release/desktop/linux"   ;;
    *windows*)      src="$ROOT/release/desktop/windows" ;;
    *macos*)        src="$ROOT/release/desktop/macos"   ;;
    *)              continue ;;
  esac
  mkdir -p "$src"
  find "$d" -type f \( -name '*.dmg' -o -name '*.exe' -o -name '*.msi' -o -name '*.deb' -o -name '*.AppImage' -o -name '*.rpm' \) -exec cp {} "$src/" \; 2>/dev/null || true
done
[ -d "$ROOT/release/desktop" ] && ok "Desktop → release/desktop/{linux,windows,macos}"

# iOS
for d in "$TMP"/prompthub-ios-*; do
  [ -d "$d" ] || continue
  mkdir -p "$ROOT/release/ipa"
  find "$d" -type f -name '*.ipa' -exec cp {} "$ROOT/release/ipa/" \; 2>/dev/null || true
  if find "$d" -type d -name '*.app' | grep -q .; then
    mkdir -p "$ROOT/release/ios"
    find "$d" -type d -name '*.app' -exec cp -R {} "$ROOT/release/ios/" \; 2>/dev/null || true
  fi
done
find "$ROOT/release/ipa" -name '*.ipa' 2>/dev/null | grep -q . && ok "iOS → release/ipa"

log "MD5 للنواتج:"
if [ -d "$ROOT/release" ]; then
  find "$ROOT/release" -type f | sort | while read -r f; do
    printf '  %s  %s\n' "$(md5sum "$f" | cut -d' ' -f1)" "${f#$ROOT/}"
  done
fi