'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackInternal, trackPixelEvent } from '@/lib/pixel';
import { PixelSettings } from '@/types';

export function PixelTracker({ pixelSettings }: { pixelSettings?: PixelSettings | null }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Load and inject pixel SDK scripts once based on configuration
  useEffect(() => {
    if (!pixelSettings) return;

    // 1. Google Analytics 4 (GA4)
    if (pixelSettings.ga4Enabled && pixelSettings.ga4MeasurementId) {
      const gaId = pixelSettings.ga4MeasurementId.trim();
      if (!document.getElementById('ga4-script')) {
        const script1 = document.createElement('script');
        script1.id = 'ga4-script';
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.id = 'ga4-init';
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: false });
        `;
        document.head.appendChild(script2);
      }
    }

    // 2. Meta (Facebook) Pixel
    if (pixelSettings.metaPixelEnabled && pixelSettings.metaPixelId) {
      const fbId = pixelSettings.metaPixelId.trim();
      if (!document.getElementById('fb-pixel-script')) {
        const script = document.createElement('script');
        script.id = 'fb-pixel-script';
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${fbId}');
        `;
        document.head.appendChild(script);
      }
    }

    // 3. TikTok Pixel
    if (pixelSettings.tiktokPixelEnabled && pixelSettings.tiktokPixelId) {
      const ttId = pixelSettings.tiktokPixelId.trim();
      if (!document.getElementById('tt-pixel-script')) {
        const script = document.createElement('script');
        script.id = 'tt-pixel-script';
        script.innerHTML = `
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${ttId}');
          }(window, document, 'ttq');
        `;
        document.head.appendChild(script);
      }
    }

    // 4. Snapchat Pixel
    if (pixelSettings.snapchatPixelEnabled && pixelSettings.snapchatPixelId) {
      const snapId = pixelSettings.snapchatPixelId.trim();
      if (!document.getElementById('snap-pixel-script')) {
        const script = document.createElement('script');
        script.id = 'snap-pixel-script';
        script.innerHTML = `
          (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
          {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
          a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
          r.src=n;var u=t.getElementsByTagName(s)[0];
          u.parentNode.insertBefore(r,u);})(window,document,
          'https://sc-static.net/scevent.min.js');
          snaptr('init', '${snapId}');
        `;
        document.head.appendChild(script);
      }
    }

    // 5. Twitter (X) Pixel
    if (pixelSettings.twitterPixelEnabled && pixelSettings.twitterPixelId) {
      const twId = pixelSettings.twitterPixelId.trim();
      if (!document.getElementById('tw-pixel-script')) {
        const script = document.createElement('script');
        script.id = 'tw-pixel-script';
        script.innerHTML = `
          !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
          },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
          a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('config','${twId}');
        `;
        document.head.appendChild(script);
      }
    }

    // 6. Pinterest Tag
    if (pixelSettings.pinterestTagEnabled && pixelSettings.pinterestTagId) {
      const pinId = pixelSettings.pinterestTagId.trim();
      if (!document.getElementById('pin-pixel-script')) {
        const script = document.createElement('script');
        script.id = 'pin-pixel-script';
        script.innerHTML = `
          !function(e){if(!window.pintrk){window.pintrk = function () {
          window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
          n=window.pintrk;n.queue=[],n.version="3.0";var
          t=document.createElement("script");t.async=!0,t.src=e;var
          r=document.getElementsByTagName("script")[0];
          r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
          pintrk('load', '${pinId}');
        `;
        document.head.appendChild(script);
      }
    }

    // 7. Custom Head Scripts (e.g. Clarity, Hotjar, or custom scripts)
    if (pixelSettings.customHeadScript && !document.getElementById('custom-head-script')) {
      try {
        const container = document.createElement('div');
        container.id = 'custom-head-script';
        container.innerHTML = pixelSettings.customHeadScript;
        document.head.appendChild(container);
      } catch (err) {
        console.warn('Could not inject custom head script:', err);
      }
    }
  }, [pixelSettings]);

  // Fire page view on route changes
  useEffect(() => {
    const url = `${pathname}${searchParams ? '?' + searchParams.toString() : ''}`;
    
    // Internal tracker
    trackInternal('page_view', {
      path: url,
      title: typeof document !== 'undefined' ? document.title : ''
    });

    // Multi-pixel dispatch
    trackPixelEvent('PageView', {
      page_path: url,
      page_title: typeof document !== 'undefined' ? document.title : ''
    });
  }, [pathname, searchParams]);

  return null;
}
