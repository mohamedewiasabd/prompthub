#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
#  بناء مستودع APT (Debian/Ubuntu) مُوقَّع لمكتبة البرومبتات
#  الاستخدام:
#    bash packaging/apt/build-apt-repo.sh \
#      --deb <prompthub_1.0.0_amd64.deb> --version 1.0.0 \
#      --out <Directory> [--gpg-fpr <FINGERPRINT>] [--pass-file <file>]
#  يتطلب: apt-ftparchive (apt-utils)، dpkg-scanpackages (dpkg-dev)‏، gpg
# ═══════════════════════════════════════════════════════════════════════
set -euo pipefail

DEB=""; VERSION=""; OUT=""; FPR=""; PASSFILE=""
while [ $# -gt 0 ]; do
  case "$1" in
    --deb) DEB="$2"; shift 2 ;;
    --version) VERSION="$2"; shift 2 ;;
    --out) OUT="$2"; shift 2 ;;
    --gpg-fpr) FPR="$2"; shift 2 ;;
    --pass-file) PASSFILE="$2"; shift 2 ;;
    *) echo "معامل مجهول: $1" >&2; exit 2 ;;
  esac
done

: "${DEB:?--deb مطلوب}" "${VERSION:?--version مطلوب}" "${OUT:?--out مطلوب}"
[ -f "$DEB" ] || { echo "لا يوجد ملف deb: $DEB" >&2; exit 1; }

ARCH="amd64"
RELEASE="stable"
DIST_DIR="$OUT/dists/$RELEASE/main/binary-$ARCH"
POOL_DIR="$OUT/pool/main/p/prompthub"

rm -rf "$OUT"
mkdir -p "$DIST_DIR" "$POOL_DIR"

cp "$DEB" "$POOL_DIR/$(basename "$DEB")"

dpkg-scanpackages -m "$OUT/pool" | gzip -9c > "$DIST_DIR/Packages.gz"
dpkg-scanpackages -m "$OUT/pool" > "$DIST_DIR/Packages"
apt-ftparchive \
  -o "APT::FTPArchive::Release::Origin=PromptHub" \
  -o "APT::FTPArchive::Release::Label=PromptHub" \
  -o "APT::FTPArchive::Release::Suite=$RELEASE" \
  -o "APT::FTPArchive::Release::Codename=$RELEASE" \
  -o "APT::FTPArchive::Release::Architectures=$ARCH" \
  -o "APT::FTPArchive::Release::Components=main" \
  -o "APT::FTPArchive::Release::Description=مكتبة البرومبتات الذكية — مستودع APT" \
  release "$OUT/dists/$RELEASE" > "$OUT/dists/$RELEASE/Release"

if [ -n "$FPR" ]; then
  [ -n "$PASSFILE" ] || { echo "الموقع --pass-file مطلوب مع --gpg-fpr" >&2; exit 2; }
  PASSPHRASE="$(cat "$PASSFILE")"
  gpg --batch --yes --pinentry-mode loopback --passphrase "$PASSPHRASE" \
    -abs -u "$FPR" -o "$OUT/dists/$RELEASE/Release.gpg" "$OUT/dists/$RELEASE/Release"
  gpg --batch --yes --pinentry-mode loopback --passphrase "$PASSPHRASE" \
    --clearsign -u "$FPR" -o "$OUT/dists/$RELEASE/InRelease" "$OUT/dists/$RELEASE/Release"
  gpg --armor --export "$FPR" > "$OUT/pubkey.asc" 2>/dev/null || cp packaging/apt/pubkey.asc "$OUT/pubkey.asc"
fi

# تحقق سريع من البنية
[ -s "$OUT/dists/$RELEASE/Release" ] || { echo "Release غير مبنية" >&2; exit 1; }
echo "✓ مستودع APT جاهز في $OUT"
du -sh "$OUT"