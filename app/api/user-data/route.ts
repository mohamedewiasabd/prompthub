import { NextRequest, NextResponse } from 'next/server';
import { verifyUserToken, getUserById, getUserData, saveUserData, UserData } from '@/lib/user-accounts';

export const dynamic = 'force-dynamic';

function getUserId(req: NextRequest): string | null {
  const token = req.cookies.get('ph_user_token')?.value
    || (req.headers.get('authorization') || '').replace('Bearer ', '');
  return verifyUserToken(token);
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'غير مسجّل' }, { status: 401 });
  }
  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ success: false, error: 'حساب غير موجود' }, { status: 404 });
  }
  const data = await getUserData(userId);
  return NextResponse.json({
    success: true,
    user: { id: user.id, email: user.email },
    data: data || { favorites: [], history: [], updatedAt: '' }
  });
}

export async function PUT(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'غير مسجّل' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const cloud = await getUserData(userId);

    const incomingFavs: string[] = Array.isArray(body.favorites) ? body.favorites : [];
    const incomingHistory: any[] = Array.isArray(body.history) ? body.history : [];

    // Merge to avoid data loss: favorites = union; history = merged by promptId keeping max copies + latest
    const favorites = Array.from(new Set([...(cloud?.favorites || []), ...incomingFavs]));

    const historyMap = new Map<string, any>();
    [...(cloud?.history || []), ...incomingHistory].forEach((h) => {
      if (!h || !h.promptId) return;
      const existing = historyMap.get(h.promptId);
      if (!existing) {
        historyMap.set(h.promptId, h);
      } else {
        historyMap.set(h.promptId, {
          ...existing,
          ...h,
          copies: Math.max(existing.copies || 0, h.copies || 0),
          copiedAt: new Date(Math.max(new Date(existing.copiedAt || 0).getTime(), new Date(h.copiedAt || 0).getTime())).toISOString()
        });
      }
    });
    const history = Array.from(historyMap.values())
      .sort((a, b) => new Date(b.copiedAt || 0).getTime() - new Date(a.copiedAt || 0).getTime());

    const merged: UserData = { favorites, history, updatedAt: new Date().toISOString() };
    const ok = await saveUserData(userId, merged);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'فشل الحفظ' }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: merged });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
