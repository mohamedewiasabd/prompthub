import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { translatePromptToEnglish } from '@/lib/gemini';
import { getPromptById, updatePrompt, getDatabaseAsync, getDatabase, persistToCloudFirestore } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بالوصول للوحة التحكم" }, { status: 401 });
    }

    await getDatabaseAsync();
    const currentDb = getDatabase();
    if (!currentDb) {
      return NextResponse.json({ success: false, error: "فشل تهيئة قاعدة البيانات" }, { status: 500 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "يجب تحديد معرف البرومبت" }, { status: 400 });
    }

    const prompt = getPromptById(id);
    if (!prompt) {
      return NextResponse.json({ success: false, error: "البرومبت غير موجود" }, { status: 404 });
    }

    const translated = await translatePromptToEnglish({
      title: prompt.title,
      titleEn: prompt.titleEn,
      description: prompt.description,
      promptText: prompt.promptText,
      variables: prompt.variables
    });

    const updated = updatePrompt(id, {
      descriptionEn: translated.descriptionEn,
      promptTextEn: translated.promptTextEn
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: "لم يتم العثور على البرومبت لتحديثه" }, { status: 404 });
    }

    await persistToCloudFirestore(getDatabase());

    return NextResponse.json({
      success: true,
      message: "تم توليد النسخة الإنجليزية للبرومبت بنجاح",
      prompt: updated
    });
  } catch (err: any) {
    console.error("Translate prompt error:", err);
    return NextResponse.json({ success: false, error: err.message || "فشل توليد النسخة الإنجليزية" }, { status: 500 });
  }
}