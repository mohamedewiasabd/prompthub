import React from 'react';
import Script from 'next/script';
import { getDatabase } from '@/lib/db';

export function AdSenseScript() {
  const db = getDatabase();
  const adSense = db.adSenseSettings;

  if (!adSense || !adSense.enabled || !adSense.publisherId || adSense.publisherId.includes('00000000')) {
    return null;
  }

  const scriptSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSense.publisherId}`;

  return (
    <Script
      id="google-adsense-script"
      src={scriptSrc}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  );
}
