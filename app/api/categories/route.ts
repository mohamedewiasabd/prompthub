import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories, addCategory, getDatabaseAsync, getDatabase, persistToCloudFirestore } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await getDatabaseAsync();
    const categories = getAllCategories();
    return NextResponse.json({ success: true, categories });
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
    if (!body.name || !body.nameEn) {
      return NextResponse.json({ success: false, error: "اسم القسم بالعربية والإنجليزية مطلوب" }, { status: 400 });
    }

    const newCategory = addCategory({
      name: body.name,
      nameEn: body.nameEn,
      slug: body.slug || body.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: body.description || "",
      icon: body.icon || "Sparkles",
      color: body.color || "from-blue-500 to-indigo-600"
    });

    // Ensure immediate cloud save
    await persistToCloudFirestore(getDatabase());

    return NextResponse.json({ success: true, category: newCategory });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
