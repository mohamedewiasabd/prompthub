'use client';

import { PixelSettings } from '@/types';

// Global declarations for window pixel functions
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
    ttq?: {
      load: (id: string) => void;
      page: () => void;
      track: (eventName: string, params?: Record<string, unknown>) => void;
    };
    snaptr?: (...args: unknown[]) => void;
    twq?: (...args: unknown[]) => void;
    pintrk?: (...args: unknown[]) => void;
    _linkedin_partner_id?: string;
  }
}

// Generate or retrieve persistent visitor ID
export function getVisitorId(): string {
  if (typeof window === 'undefined') return 'server';
  let vid = localStorage.getItem('ph_visitor_id');
  if (!vid) {
    vid = `v-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('ph_visitor_id', vid);
  }
  return vid;
}

// Generate or retrieve session ID (expires on browser close)
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let sid = sessionStorage.getItem('ph_session_id');
  if (!sid) {
    sid = `s-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('ph_session_id', sid);
  }
  return sid;
}

// Detect client device type
export function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk/i.test(ua)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|windows phone/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// Detect simple browser name
export function getBrowserName(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Browser';
}

// Send internal analytics event to server
export function trackInternal(
  eventType: 'page_view' | 'prompt_view' | 'prompt_copy' | 'prompt_share' | 'prompt_like' | 'prompt_review' | 'search' | 'category_view' | 'model_click',
  details: {
    path?: string;
    title?: string;
    targetId?: string;
    targetName?: string;
  } = {}
) {
  if (typeof window === 'undefined') return;

  const payload = {
    visitorId: getVisitorId(),
    sessionId: getSessionId(),
    eventType,
    path: details.path || window.location.pathname,
    title: details.title || document.title,
    targetId: details.targetId,
    targetName: details.targetName,
    referrer: document.referrer || undefined,
    deviceType: getDeviceType(),
    browser: getBrowserName(),
    os: navigator.platform || 'Web',
  };

  try {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  } catch {
    // Ignore network error silently
  }
}

// Dispatch event across ALL active third-party pixels & internal analytics
export function trackPixelEvent(
  eventName: 'PageView' | 'ViewContent' | 'Search' | 'CopyPrompt' | 'SharePrompt' | 'RatingReview' | 'CategoryView',
  data: {
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    search_string?: string;
    value?: number;
    currency?: string;
    [key: string]: unknown;
  } = {}
) {
  if (typeof window === 'undefined') return;

  // 1. Google Analytics 4 (GA4) / gtag
  if (window.gtag) {
    try {
      if (eventName === 'PageView') {
        window.gtag('event', 'page_view', {
          page_title: document.title,
          page_location: window.location.href,
          page_path: window.location.pathname
        });
      } else if (eventName === 'ViewContent') {
        window.gtag('event', 'view_item', {
          item_id: data.content_ids?.[0],
          item_name: data.content_name,
          item_category: data.content_category
        });
      } else if (eventName === 'CopyPrompt') {
        window.gtag('event', 'copy_prompt', {
          item_id: data.content_ids?.[0],
          item_name: data.content_name,
          category: data.content_category
        });
      } else if (eventName === 'Search') {
        window.gtag('event', 'search', {
          search_term: data.search_string
        });
      } else {
        window.gtag('event', eventName.toLowerCase(), data);
      }
    } catch (e) {
      console.debug('GA4 dispatch error:', e);
    }
  }

  // 2. Meta (Facebook) Pixel
  if (window.fbq) {
    try {
      if (eventName === 'PageView') {
        window.fbq('track', 'PageView');
      } else if (eventName === 'ViewContent') {
        window.fbq('track', 'ViewContent', {
          content_name: data.content_name,
          content_category: data.content_category,
          content_ids: data.content_ids,
          content_type: 'product'
        });
      } else if (eventName === 'CopyPrompt') {
        window.fbq('trackCustom', 'CopyPrompt', {
          prompt_title: data.content_name,
          prompt_category: data.content_category,
          prompt_id: data.content_ids?.[0]
        });
      } else if (eventName === 'Search') {
        window.fbq('track', 'Search', {
          search_string: data.search_string
        });
      } else {
        window.fbq('trackCustom', eventName, data);
      }
    } catch (e) {
      console.debug('Meta pixel dispatch error:', e);
    }
  }

  // 3. TikTok Pixel
  if (window.ttq && typeof window.ttq.track === 'function') {
    try {
      if (eventName === 'PageView') {
        window.ttq.page();
      } else if (eventName === 'ViewContent') {
        window.ttq.track('ViewContent', {
          content_name: data.content_name,
          content_category: data.content_category,
          content_id: data.content_ids?.[0]
        });
      } else if (eventName === 'Search') {
        window.ttq.track('Search', {
          query: data.search_string
        });
      } else {
        window.ttq.track('ClickButton', {
          button_name: eventName,
          ...data
        });
      }
    } catch (e) {
      console.debug('TikTok pixel dispatch error:', e);
    }
  }

  // 4. Snapchat Pixel
  if (window.snaptr) {
    try {
      if (eventName === 'PageView') {
        window.snaptr('track', 'PAGE_VIEW');
      } else if (eventName === 'ViewContent') {
        window.snaptr('track', 'VIEW_CONTENT', {
          item_category: data.content_category,
          item_ids: data.content_ids
        });
      } else if (eventName === 'Search') {
        window.snaptr('track', 'SEARCH', {
          search_string: data.search_string
        });
      } else {
        window.snaptr('track', 'CUSTOM_EVENT', { event_name: eventName, ...data });
      }
    } catch (e) {
      console.debug('Snapchat pixel dispatch error:', e);
    }
  }

  // 5. Twitter (X) Pixel
  if (window.twq) {
    try {
      if (eventName === 'PageView') {
        window.twq('track', 'PageView');
      } else {
        window.twq('track', eventName, data);
      }
    } catch (e) {
      console.debug('Twitter pixel dispatch error:', e);
    }
  }

  // 6. Pinterest Tag
  if (window.pintrk) {
    try {
      if (eventName === 'PageView') {
        window.pintrk('track', 'pagevisit');
      } else if (eventName === 'ViewContent') {
        window.pintrk('track', 'viewcontent', {
          lead_type: data.content_category
        });
      } else if (eventName === 'Search') {
        window.pintrk('track', 'search', {
          search_query: data.search_string
        });
      }
    } catch (e) {
      console.debug('Pinterest pixel dispatch error:', e);
    }
  }
}
