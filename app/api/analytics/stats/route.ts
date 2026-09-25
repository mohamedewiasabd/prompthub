import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/analytics';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('ph_admin_token')?.value;
    const token = (authHeader && authHeader.startsWith('Bearer '))
      ? authHeader.substring(7)
      : cookieToken;

    // Verify admin privileges
    if (!token || !verifyAuthToken(token)) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بالوصول للإحصائيات' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const range = (searchParams.get('range') || '7days') as 'today' | '7days' | '30days' | 'all';

    const summary = getAnalyticsSummary(range);

    return NextResponse.json({
      success: true,
      timeRange: range,
      summary
    });
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
