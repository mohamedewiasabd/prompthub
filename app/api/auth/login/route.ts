import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/user-accounts';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || '');
    const password = String(body.password || '');

    const result = await loginUser(email, password);
    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      token: result.token,
      user: { id: result.user.id, email: result.user.email }
    });
    response.cookies.set('ph_user_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/'
    });
    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
