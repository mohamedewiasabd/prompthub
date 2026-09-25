import { NextRequest, NextResponse } from 'next/server';
import { getCategoryBySlug, updateCategory, deleteCategory, getAllPrompts, getDatabaseAsync, getDatabase, persistToCloudFirestore } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await getDatabaseAsync();
    const { slug } = await params;
    const category = getCategoryBySlug(slug);
    if (!category) {
      return NextResponse.json({ success: false, error: "القسم غير موجود" }, { status: 404 });
    }

    const prompts = getAllPrompts({ categorySlug: slug });
    return NextResponse.json({ success: true, category, prompts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 });
    }

    const { slug } = await params;
    const body = await req.json();
    const updated = updateCategory(slug, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: "لم يتم العثور على القسم لتحديثه" }, { status: 404 });
    }

    await persistToCloudFirestore(getDatabase());

    return NextResponse.json({ success: true, category: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 });
    }

    const { slug } = await params;
    const deleted = deleteCategory(slug);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "لم يتم العثور على القسم لحذفه" }, { status: 404 });
    }

    await persistToCloudFirestore(getDatabase());

    return NextResponse.json({ success: true, message: "تم حذف القسم بنجاح" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
