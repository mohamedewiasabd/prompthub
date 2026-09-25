import { NextRequest, NextResponse } from 'next/server';
import { getPromptReviews, addPromptReview, getPromptById } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prompt = getPromptById(id);
    if (!prompt) {
      return NextResponse.json({ success: false, error: "البرومبت غير موجود" }, { status: 404 });
    }

    const reviews = getPromptReviews(prompt.id);
    return NextResponse.json({
      success: true,
      promptId: prompt.id,
      ratingAverage: prompt.ratingAverage || 5.0,
      ratingCount: prompt.ratingCount || reviews.length,
      reviews
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prompt = getPromptById(id);
    if (!prompt) {
      return NextResponse.json({ success: false, error: "البرومبت غير موجود" }, { status: 404 });
    }

    const body = await req.json();
    const userName = (body.userName || '').trim() || 'مستخدم مميز';
    const rating = Number(body.rating) || 5;
    const comment = (body.comment || '').trim();

    if (!comment) {
      return NextResponse.json({
        success: false,
        error: "يرجى كتابة تعليق أو تجربة مع البرومبت"
      }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({
        success: false,
        error: "التقييم يجب أن يكون من 1 إلى 5 نجوم"
      }, { status: 400 });
    }

    const { review, prompt: updatedPrompt } = addPromptReview({
      promptId: prompt.id,
      userName,
      rating,
      comment
    });

    return NextResponse.json({
      success: true,
      message: "تم إضافة تقييمك وتعليقك بنجاح! شكراً لمشاركتك",
      review,
      prompt: updatedPrompt
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
