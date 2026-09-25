import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { generateAIPrompts } from '@/lib/gemini';
import { getCategoryBySlug, getAllPrompts, addPrompt, getDatabaseAsync, getDatabase, persistToCloudFirestore } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بالوصول للوحة التحكم" }, { status: 401 });
    }

    // Ensure database is fully hydrated before generating & saving
    await getDatabaseAsync();
    const currentDb = getDatabase();
    if (!currentDb) {
      return NextResponse.json({ success: false, error: "فشل تهيئة قاعدة البيانات" }, { status: 500 });
    }

    const body = await req.json();
    const { categorySlug, count = 3, adminIdea, customNotes, autoSave = true } = body;

    if (!categorySlug) {
      return NextResponse.json({ success: false, error: "يجب اختيار القسم المراد التوليد له" }, { status: 400 });
    }

    const category = getCategoryBySlug(categorySlug);
    if (!category) {
      return NextResponse.json({ success: false, error: "القسم المحدد غير موجود" }, { status: 404 });
    }

    // Retrieve all existing prompts in this category to prevent any duplicates
    const existingPrompts = getAllPrompts({ categorySlug: category.slug }).map(p => ({
      id: p.id,
      title: p.title,
      titleEn: p.titleEn,
      slug: p.slug,
      description: p.description,
      framework: p.framework
    }));

    const generated = await generateAIPrompts({
      categoryName: category.name,
      categorySlug: category.slug,
      categoryDescription: category.description,
      count: Math.min(Math.max(Number(count) || 1, 1), 6),
      adminIdea,
      customNotes,
      existingPrompts
    });

    if (!generated || generated.length === 0) {
      return NextResponse.json({ success: false, error: "لم يتم توليد أي برومبتات، يرجى إعادة المحاولة" }, { status: 500 });
    }

    let savedPrompts: any[] = [];
    if (autoSave) {
      for (const p of generated) {
        const saved = addPrompt({
          categoryId: category.id,
          categorySlug: category.slug,
          title: p.title,
          titleEn: p.titleEn,
          slug: p.slug,
          description: p.description,
          promptText: p.promptText,
          models: p.models,
          targetLanguage: p.targetLanguage,
          framework: p.framework,
          tags: p.tags,
          variables: p.variables,
          sampleOutput: p.sampleOutput,
          tips: p.tips,
          difficulty: p.difficulty,
          featured: true
        });
        savedPrompts.push(saved);
      }

      // Immediately sync with Firestore so data is durable before response returns
      await persistToCloudFirestore(getDatabase());
    }

    return NextResponse.json({
      success: true,
      generated,
      savedPrompts: autoSave ? savedPrompts : undefined,
      existingPromptsCount: existingPrompts.length,
      message: `تم توليد وإضافة ${generated.length} برومبتات ذكية جديدة ومبتكرة لقسم "${category.name}" بنجاح!`
    });
  } catch (err: any) {
    console.error("Generate prompts error:", err);
    return NextResponse.json({ success: false, error: err.message || "فشل توليد البرومبتات" }, { status: 500 });
  }
}
