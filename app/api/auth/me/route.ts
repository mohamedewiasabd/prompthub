import { NextRequest, NextResponse } from 'next/server';
import { verifyUserToken, getUserById, getUserData } from '@/lib/user-accounts';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('ph_user_token')?.value
    || (req.headers.get('authorization') || '').replace('Bearer ', '');
  const userId = verifyUserToken(token);
  if (!userId) {
    return NextResponse.json({ success: false, authenticated: false });
  }
  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ success: false, authenticated: false });
  }
  const data = await getUserData(userId);
  return NextResponse.json({
    success: true,
    authenticated: true,
    user: { id: user.id, email: user.email },
    data
  });
}
