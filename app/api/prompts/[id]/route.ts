import { NextRequest, NextResponse } from 'next/server';
import { getPromptById, updatePrompt, deletePrompt, incrementPromptStat, getDatabaseAsync, getDatabase, persistToCloudFirestore } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getDatabaseAsync();
    const { id } = await params;
    const prompt = getPromptById(id);
    if (!prompt) {
      return NextResponse.json({ success: false, error: "البرومبت غير موجود" }, { status: 404 });
    }

    // Auto increment views
    incrementPromptStat(prompt.id, 'views', 1);

    return NextResponse.json({ success: true, prompt });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const updated = updatePrompt(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: "لم يتم العثور على البرومبت لتحديثه" }, { status: 404 });
    }

    await persistToCloudFirestore(getDatabase());

    return NextResponse.json({ success: true, prompt: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = deletePrompt(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "لم يتم العثور على البرومبت لحذفه" }, { status: 404 });
    }

    await persistToCloudFirestore(getDatabase());

    return NextResponse.json({ success: true, message: "تم حذف البرومبت بنجاح" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const action = body.action as 'copy' | 'like' | 'view';

    if (action === 'copy') {
      const updated = incrementPromptStat(id, 'copies', 1);
      return NextResponse.json({ success: true, copies: updated?.copies });
    } else if (action === 'like') {
      const updated = incrementPromptStat(id, 'likes', 1);
      return NextResponse.json({ success: true, likes: updated?.likes });
    } else if (action === 'view') {
      const updated = incrementPromptStat(id, 'views', 1);
      return NextResponse.json({ success: true, views: updated?.views });
    }

    return NextResponse.json({ success: false, error: "إجراء غير صالح" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
