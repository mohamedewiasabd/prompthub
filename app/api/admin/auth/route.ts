import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, createToken, isAuthenticated, updateAdminCredentials } from '@/lib/auth';
import { getDatabase } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "اسم المستخدم وكلمة المرور مطلوبة" }, { status: 400 });
    }

    const isValid = verifyAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: "بيانات تسجيل الدخول غير صحيحة" }, { status: 401 });
    }

    const token = createToken(username);
    const response = NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: { username }
    });

    // Set cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });
    response.cookies.set('ph_admin_token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const isAuthed = isAuthenticated(req);
    const db = getDatabase();
    return NextResponse.json({
      success: true,
      authenticated: isAuthed,
      adminUsername: isAuthed ? (db.adminSettings?.adminUsername || 'admin') : undefined,
      secretPath: db.adminSettings?.secretAdminPath || '/secret-admin-portal'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "تم تسجيل الخروج" });
  response.cookies.delete('admin_token');
  response.cookies.delete('ph_admin_token');
  return response;
}

export async function PATCH(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 });
    }

    const body = await req.json();
    const { newUsername, newPassword } = body;

    if (!newUsername && !newPassword) {
      return NextResponse.json({ success: false, error: "لم يتم تقديم بيانات جديدة للتحديث" }, { status: 400 });
    }

    const updated = updateAdminCredentials(newUsername, newPassword);
    if (!updated) {
      return NextResponse.json({ success: false, error: "فشل حفظ البيانات الجديدة" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "تم تحديث بيانات المدير بنجاح" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
