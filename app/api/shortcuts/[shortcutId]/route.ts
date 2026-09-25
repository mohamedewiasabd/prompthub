import { NextRequest, NextResponse } from 'next/server';
import { getShortcutById, incrementShortcutCopies, getDatabase, getDatabaseAsync, persistToCloudFirestore } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shortcutId: string }> }
) {
  try {
    await getDatabaseAsync();
    const { shortcutId } = await params;
    const shortcut = getShortcutById(shortcutId);
    if (!shortcut) {
      return NextResponse.json({ success: false, error: "الأمر غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ success: true, shortcut });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ shortcutId: string }> }
) {
  try {
    const { shortcutId } = await params;
    const updated = incrementShortcutCopies(shortcutId);
    if (updated === null) {
      return NextResponse.json({ success: false, error: "الأمر غير موجود" }, { status: 404 });
    }
    await persistToCloudFirestore(getDatabase()).catch(() => {});
    return NextResponse.json({ success: true, copies: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
