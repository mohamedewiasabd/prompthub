import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { generateAIShortcuts } from '@/lib/gemini';
import { getAllShortcuts, addShortcut, getDatabaseAsync, getDatabase, persistToCloudFirestore } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بالوصول للوحة التحكم" }, { status: 401 });
    }

    await getDatabaseAsync();

    const body = await req.json().catch(() => ({}));
    const count = Math.min(Math.max(Number(body.count) || 5, 1), 10);
    const autoSave = body.autoSave !== false;
    const adminIdea = String(body.adminIdea || '').trim();
    const category = String(body.category || '').trim();
    const keyword = String(body.keyword || '').trim();

    const currentShortcuts = getAllShortcuts();
    const existing = currentShortcuts.map(s => ({ command: s.command, name: s.name }));

    const generated = await generateAIShortcuts(count, existing, {
      adminIdea: adminIdea || undefined,
      category: category || undefined,
      keyword: keyword || undefined
    });

    if (!generated || generated.length === 0) {
      return NextResponse.json({ success: false, error: "لم نتمكن من توليد أوامر جديدة، يرجى المحاولة مرة أخرى" }, { status: 500 });
    }

    let savedShortcuts: any[] = [];
    if (autoSave) {
      for (const sc of generated) {
        const saved = addShortcut({
          command: sc.command,
          name: sc.name,
          nameEn: sc.nameEn,
          description: sc.description,
          category: sc.category || "عام",
          example: sc.example,
          icon: sc.icon || "Command"
        });
        savedShortcuts.push(saved);
      }
      await persistToCloudFirestore(getDatabase());
    }

    return NextResponse.json({
      success: true,
      generated,
      savedShortcuts: autoSave ? savedShortcuts : undefined,
      message: `تم توليد ${generated.length} أوامر/اختصارات جديدة بنجاح بالذكاء الاصطناعي!`
    });
  } catch (err: any) {
    console.error("Generate shortcuts error:", err);
    return NextResponse.json({ success: false, error: err.message || "فشل توليد الأوامر" }, { status: 500 });
  }
}
