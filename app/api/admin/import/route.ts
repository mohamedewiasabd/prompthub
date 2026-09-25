import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { saveDatabase, persistToCloudFirestore } from '@/lib/db';
import { DatabaseStore } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بالوصول" }, { status: 401 });
    }

    const body = await req.json() as DatabaseStore;
    if (!body || !Array.isArray(body.categories) || !Array.isArray(body.prompts)) {
      return NextResponse.json({ success: false, error: "صيغة ملف النسخة الاحتياطية غير صالحة" }, { status: 400 });
    }

    saveDatabase(body);
    await persistToCloudFirestore(body);

    return NextResponse.json({
      success: true,
      message: `تم استعادة ${body.categories.length} أقسام و ${body.prompts.length} برومبتات بنجاح!`
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
