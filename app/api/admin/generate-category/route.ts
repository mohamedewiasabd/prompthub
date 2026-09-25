import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { generateAICategories } from '@/lib/gemini';
import { getAllCategories, addCategory, getDatabaseAsync, getDatabase, persistToCloudFirestore } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بالوصول للوحة التحكم" }, { status: 401 });
    }

    // Ensure database is hydrated from cloud
    await getDatabaseAsync();

    const body = await req.json().catch(() => ({}));
    const count = Number(body.count) || 3;
    const autoSave = body.autoSave !== false; // default true

    const currentCategories = getAllCategories();
    const existingCategories = currentCategories.map(c => ({ name: c.name, nameEn: c.nameEn, slug: c.slug }));

    const generated = await generateAICategories(count, existingCategories);

    if (!generated || generated.length === 0) {
      return NextResponse.json({ success: false, error: "لم نتمكن من توليد أقسام، يرجى المحاولة مرة أخرى" }, { status: 500 });
    }

    let savedCategories: any[] = [];
    if (autoSave) {
      for (const cat of generated) {
        const saved = addCategory({
          name: cat.name,
          nameEn: cat.nameEn,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon || "Sparkles",
          color: "from-blue-600 to-indigo-700"
        });
        savedCategories.push(saved);
      }

      // Immediately sync with Cloud Firestore
      await persistToCloudFirestore(getDatabase());
    }

    return NextResponse.json({
      success: true,
      generated,
      savedCategories: autoSave ? savedCategories : undefined,
      message: `تم توليد ${generated.length} أقسام جديدة بنجاح بالذكاء الاصطناعي!`
    });
  } catch (err: any) {
    console.error("Generate category error:", err);
    return NextResponse.json({ success: false, error: err.message || "فشل توليد الأقسام" }, { status: 500 });
  }
}
