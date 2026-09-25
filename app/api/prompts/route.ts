import { NextRequest, NextResponse } from 'next/server';
import { getAllPrompts, addPrompt, getDatabaseAsync, getDatabase, persistToCloudFirestore } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await getDatabaseAsync();

    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('categorySlug') || undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const search = searchParams.get('search') || undefined;
    const model = searchParams.get('model') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;
    const featuredParam = searchParams.get('featured');
    const featured = featuredParam !== null ? featuredParam === 'true' : undefined;
    const sort = searchParams.get('sort') || 'latest'; // latest, copies, views, likes, rating, trending

    let prompts = getAllPrompts({
      categorySlug,
      categoryId,
      search,
      model,
      tag,
      difficulty,
      featured
    });

    // Sorting
    if (sort === 'copies') {
      prompts.sort((a, b) => b.copies - a.copies);
    } else if (sort === 'views') {
      prompts.sort((a, b) => b.views - a.views);
    } else if (sort === 'likes') {
      prompts.sort((a, b) => b.likes - a.likes);
    } else if (sort === 'rating') {
      prompts.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0) || (b.ratingCount || 0) - (a.ratingCount || 0));
    } else if (sort === 'trending') {
      // Trending algorithm: score = (views * 0.4) + (copies * 2) + (likes * 3) + ((ratingAverage || 4.5) * 20)
      const score = (p: typeof prompts[0]) => (p.views * 0.4) + (p.copies * 2) + (p.likes * 3) + ((p.ratingAverage || 4.5) * 20);
      prompts.sort((a, b) => score(b) - score(a));
    } else {
      prompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return NextResponse.json({ success: true, count: prompts.length, prompts });
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
    if (!body.title || !body.promptText || !body.categoryId) {
      return NextResponse.json({
        success: false,
        error: "عنوان البرومبت، النص، وتحديد القسم حقول إجبارية"
      }, { status: 400 });
    }

    const newPrompt = addPrompt({
      categoryId: body.categoryId,
      categorySlug: body.categorySlug || "",
      title: body.title,
      titleEn: body.titleEn || "",
      slug: body.slug || "",
      description: body.description || "",
      promptText: body.promptText,
      models: Array.isArray(body.models) && body.models.length > 0 ? body.models : ["ChatGPT (GPT-4o)", "Claude 3.7"],
      targetLanguage: body.targetLanguage || "ar",
      framework: body.framework || "Role-Task-Format",
      tags: Array.isArray(body.tags) ? body.tags : [],
      variables: Array.isArray(body.variables) ? body.variables : [],
      exampleInputs: body.exampleInputs || {},
      sampleOutput: body.sampleOutput || "",
      tips: Array.isArray(body.tips) ? body.tips : [],
      difficulty: body.difficulty || "متوسط",
      featured: Boolean(body.featured)
    });

    // Ensure immediate cloud save before returning response
    await persistToCloudFirestore(getDatabase());

    return NextResponse.json({ success: true, prompt: newPrompt });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
