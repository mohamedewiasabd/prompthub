import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { isAuthenticated, getAdminApiKey } from '@/lib/auth';
import { getDatabase, getDatabaseAsync, saveDatabase, persistToCloudFirestore } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك" }, { status: 401 });
    }
    await getDatabaseAsync();
    return NextResponse.json({ success: true, apiKey: getAdminApiKey() });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك" }, { status: 401 });
    }
    await getDatabaseAsync();
    const db = getDatabase();
    const newKey = randomBytes(32).toString('hex');
    db.adminSettings.apiKey = newKey;
    db.adminSettings.lastUpdated = new Date().toISOString();
    saveDatabase(db);
    await persistToCloudFirestore(db);
    return NextResponse.json({ success: true, apiKey: newKey, message: "تم توليد مفتاح API جديد. احتفظ به في مكان آمن." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}