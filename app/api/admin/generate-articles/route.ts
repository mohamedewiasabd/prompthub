import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { generateAIArticles, GeneratedBlogPost } from '@/lib/gemini';
import { getDatabase, getDatabaseAsync, persistToCloudFirestore } from '@/lib/db';
import { getBlogPostTitles } from '@/lib/seed-blog';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بالوصول للوحة التحكم" }, { status: 401 });
    }

    await getDatabaseAsync();

    const body = await req.json().catch(() => ({}));
    const count = Math.min(Math.max(Number(body.count) || 1, 1), 6);
    const autoSave = body.autoSave !== false;
    const topic = String(body.topic || '').trim();
    const category = String(body.category || '').trim();
    const keyword = String(body.keyword || '').trim();

    const db = getDatabase();
    const existingTitles = getBlogPostTitles(db);

    const generated = await generateAIArticles(count, {
      topic: topic || undefined,
      category: category || undefined,
      keyword: keyword || undefined,
      existingTitles
    });

    if (!generated || generated.length === 0) {
      return NextResponse.json({ success: false, error: "لم نتمكن من توليد مقالات، يرجى المحاولة مرة أخرى" }, { status: 500 });
    }

    let savedArticles: GeneratedBlogPost[] = [];
    if (autoSave) {
      const current = getDatabase();
      if (!Array.isArray(current.blogPosts)) current.blogPosts = [];
      const slugSet = new Set(current.blogPosts.map(p => p.slug));
      for (const article of generated) {
        if (!slugSet.has(article.slug)) {
          current.blogPosts.push(article);
          slugSet.add(article.slug);
          savedArticles.push(article);
        }
      }
      await persistToCloudFirestore(current);
    }

    return NextResponse.json({
      success: true,
      generated,
      savedArticles: autoSave ? savedArticles : undefined,
      blogUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://live-stream-sport.com',
      message: `تم توليد ${generated.length} ${generated.length === 1 ? 'مقالة' : 'مقالات'} جديدة بالذكاء الاصطناعي!`
    });
  } catch (err: any) {
    console.error("Generate articles error:", err);
    return NextResponse.json({ success: false, error: err.message || "فشل توليد المقالات" }, { status: 500 });
  }
}