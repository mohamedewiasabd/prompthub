# OBS (openSUSE Build Service) spec — PromptHub (مكتبة البرومبتات الذكية)
# رفع إلى https://build.opensuse.org (يتطلب حساب OBS + osc)

Name:           prompthub
Version:        1.0.0
Release:        0
Summary:        Arabic AI prompts library with Gemini generation (مكتبة البرومبتات الذكية)
License:        All Rights Reserved
Group:          Applications/Internet
Url:            https://github.com/mohamedewiasabd/prompthub

%define tauri_rpmbuild false
BuildRequires:  rust
BuildRequires:  cargo
BuildRequires:  pkgconfig(webkit2gtk-4.1)
BuildRequires:  pkgconfig(gtk+-3.0)
BuildRequires:  pkgconfig(openssl)
BuildRequires:  pkgconfig(librsvg-2.0)
Requires:       webkit2gtk4.1
Requires:       gtk3

%description
مكتبة البرومبتات الذكية | PromptHub — منصة عربية مجانية لعرض واكتشاف
أوامر وبرومبتات الذكاء الاصطناعي مع توليد ذكي عبر Gemini.
Free Arabic platform to browse, discover and generate AI prompts,
powered by Google Gemini. (WebView wrapper loading the live site)

%prep
%setup -q

%build
cargo build --release --manifest-path src-tauri/Cargo.toml

%install
install -Dm755 src-tauri/target/release/prompthub %{buildroot}%{_bindir}/prompthub
install -Dm644 packaging/linux/io.github.mohamedewiasabd.prompthub.desktop \
  %{buildroot}%{_datadir}/applications/io.github.mohamedewiasabd.prompthub.desktop
install -Dm644 packaging/linux/io.github.mohamedewiasabd.prompthub.metainfo.xml \
  %{buildroot}%{_datadir}/metainfo/io.github.mohamedewiasabd.prompthub.metainfo.xml
install -Dm644 src-tauri/icons/32x32.png \
  %{buildroot}%{_datadir}/icons/hicolor/32x32/apps/io.github.mohamedewiasabd.prompthub.png
install -Dm644 src-tauri/icons/128x128.png \
  %{buildroot}%{_datadir}/icons/hicolor/128x128/apps/io.github.mohamedewiasabd.prompthub.png

%files
%{_bindir}/prompthub
%{_datadir}/applications/io.github.mohamedewiasabd.prompthub.desktop
%{_datadir}/metainfo/io.github.mohamedewiasabd.prompthub.metainfo.xml
%{_datadir}/icons/hicolor/32x32/apps/io.github.mohamedewiasabd.prompthub.png
%{_datadir}/icons/hicolor/128x128/apps/io.github.mohamedewiasabd.prompthub.png

%changelog
* Fri Sep 25 2026 PromptHub <mohamedewiasabd@gmail.com> - 1.0.0
- الإصدار الأول لـ OBS