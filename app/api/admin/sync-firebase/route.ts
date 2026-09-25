import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, getDatabaseAsync, persistToCloudFirestore, hydrateFromCloudFirestore } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import { db as firestoreDb } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STORE_DOC_ID = 'prompthub-master-store';

export async function GET(req: NextRequest) {
  try {
    if (!isAuthenticated(req)) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 });
    }

    // Attempt to read from cloud Firestore
    const docRef = doc(firestoreDb, 'system', STORE_DOC_ID);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const cloudData = snap.data();
      return NextResponse.json({
        success: true,
        exists: true,
        lastSynced: cloudData.lastSynced || cloudData.adminSettings?.lastUpdated,
        cloudCategoriesCount: cloudData.categories?.length || 0,
        cloudPromptsCount: cloudData.promptsCount ?? cloudData.prompts?.length ?? 0,
        cloudReviewsCount: cloudData.reviews?.length || 0
      });
    }

    return NextResponse.json({
      success: true,
      exists: false,
      message: "لا توجد نسخة مخزنة سحابياً بعد، يمكنك الرفع الآن."
    });
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
    const action = body.action as 'push' | 'pull';

    if (action === 'push') {
      // Wait for cloud hydration so we push the FULL merged store (not a cold
      // instance's partial disk snapshot) and can report accurate counts.
      await getDatabaseAsync();
      const localDb = getDatabase();
      const success = await persistToCloudFirestore(localDb);

      if (!success) {
        return NextResponse.json({ success: false, error: "تعذر الرفع إلى Firestore Cloud" }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "تم رفع ومزامنة كافة البيانات والأقسام والبرومبتات إلى سحابة Firebase بنجاح!",
        lastSynced: new Date().toISOString(),
        categoriesCount: localDb.categories.length,
        promptsCount: localDb.prompts.length
      });
    } else if (action === 'pull') {
      const hydrated = await hydrateFromCloudFirestore();
      const currentDb = getDatabase();

      return NextResponse.json({
        success: true,
        message: hydrated 
          ? "تم استرداد ومزامنة البيانات بأمان مع سحابة Firebase مع الحفاظ على البيانات المولدة!"
          : "تمت مراجعة البيانات السحابية والمحلية بنجاح!",
        categoriesCount: currentDb.categories.length,
        promptsCount: currentDb.prompts.length
      });
    }

    return NextResponse.json({ success: false, error: "إجراء غير معروف" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
