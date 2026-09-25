import { NextRequest, NextResponse } from 'next/server';
import { deletePromptReview } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = deletePromptReview(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "لم يتم العثور على التعليق أو تم حذفه مسبقاً" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "تم حذف التعليق والتقييم بنجاح" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
