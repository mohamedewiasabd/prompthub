import { NextRequest, NextResponse } from 'next/server';
import {
  getAllShortcuts,
  getShortcutCategories,
  addShortcut,
  updateShortcut,
  deleteShortcut,
  getDatabaseAsync,
  getDatabase,
  persistToCloudFirestore
} from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await getDatabaseAsync();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const shortcuts = getAllShortcuts(search, category);
    const categories = getShortcutCategories();
    return NextResponse.json({ success: true, shortcuts, categories });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.command || !body.name) {
      return NextResponse.json({ success: false, error: "اسم الأمر (command) والعنوان (name) مطلوبان" }, { status: 400 });
    }

    const newShortcut = addShortcut({
      command: body.command,
      name: body.name,
      nameEn: body.nameEn || body.name,
      description: body.description || "",
      category: body.category || "عام",
      example: body.example,
      icon: body.icon || "Command"
    });

    await persistToCloudFirestore(getDatabase());

    return NextResponse.json({ success: true, shortcut: newShortcut });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 });
    }

    const body = await req.json();
    const id = body.id;
    if (!id) {
      return NextResponse.json({ success: false, error: "معرف الأمر مطلوب" }, { status: 400 });
    }

    const updated = updateShortcut(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "لم يتم العثور على الأمر لتحديثه" }, { status: 404 });
    }

    await persistToCloudFirestore(getDatabase());

    return NextResponse.json({ success: true, shortcut: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id'); 
    if (!id) {
      return NextResponse.json({ success: false, error: "معرف الأمر مطلوب" }, { status: 400 });
    }

    const deleted = deleteShortcut(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "لم يتم العثور على الأمر لحذفه" }, { status: 404 });
    }

    await persistToCloudFirestore(getDatabase());

    return NextResponse.json({ success: true, message: "تم حذف الأمر بنجاح" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
