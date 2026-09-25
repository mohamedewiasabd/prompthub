import { NextRequest, NextResponse } from 'next/server';
import { trackAnalyticsEvent } from '@/lib/analytics';
import { incrementPromptStat } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorId, sessionId, eventType, path, title, targetId, targetName, referrer, deviceType, browser, os } = body;

    if (!eventType || !visitorId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const record = trackAnalyticsEvent({
      visitorId,
      sessionId: sessionId || 'default-session',
      eventType,
      path: path || '/',
      title,
      targetId,
      targetName,
      referrer,
      deviceType: deviceType || 'desktop',
      browser,
      os
    });

    // Automatically increment prompt stats in db if it was a prompt interaction
    if (targetId) {
      if (eventType === 'prompt_view') {
        incrementPromptStat(targetId, 'views', 1);
      } else if (eventType === 'prompt_copy') {
        incrementPromptStat(targetId, 'copies', 1);
      } else if (eventType === 'prompt_like') {
        incrementPromptStat(targetId, 'likes', 1);
      }
    }

    return NextResponse.json({ success: true, eventId: record.id });
  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 });
  }
}
