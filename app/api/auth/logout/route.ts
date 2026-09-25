import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.set('ph_user_token', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/'
  });
  return response;
}
