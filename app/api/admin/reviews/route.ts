import { NextRequest, NextResponse } from 'next/server';
import { getAllReviews } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 });
    }

    const reviews = getAllReviews();
    return NextResponse.json({ success: true, count: reviews.length, reviews });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
