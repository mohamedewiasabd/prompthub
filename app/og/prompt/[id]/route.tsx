import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { getPromptById, getAllCategories } from '@/lib/db';
export const runtime = 'nodejs';
export const revalidate = 3600;

const BOLD_FONT_PATH = process.cwd() + '/public/fonts/tajawal-bold.ttf';
const REG_FONT_PATH = process.cwd() + '/public/fonts/tajawal-reg.ttf';

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 3) + '...' : text;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const prompt = getPromptById(id);
    const boldData = readFileSync(BOLD_FONT_PATH);
    const regData = readFileSync(REG_FONT_PATH);

    const title = prompt ? truncate(prompt.title, 45) : 'برومبت غير موجود';
    const desc = prompt
      ? truncate(prompt.description || 'برومبت ذكاء اصطناعي احترافي من مكتبة البرومبتات الذكية', 90)
      : '';

    const categoryName =
      prompt && prompt.categoryId
        ? (getAllCategories().find((c) => c.id === prompt.categoryId)?.name ?? '')
        : '';

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #7c3aed 100%)',
            color: 'white',
            fontFamily: 'Tajawal',
            padding: '56px 64px',
            direction: 'rtl'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg,#3b82f6,#a855f7)',
                fontSize: 30
              }}
            >
              ⚡
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 30, fontWeight: 800 }}>PromptHub</div>
              <div style={{ fontSize: 20, opacity: 0.8 }}>مكتبة البرومبتات الذكية</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {categoryName ? (
              <div
                style={{
                  fontSize: 20,
                  alignSelf: 'flex-start',
                  padding: '8px 20px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.15)',
                  marginBottom: 20
                }}
              >
                {categoryName}
              </div>
            ) : null}
            <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
              {title}
            </div>
            {desc ? (
              <div style={{ fontSize: 26, opacity: 0.92, lineHeight: 1.5 }}>{desc}</div>
            ) : null}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 22,
              opacity: 0.85
            }}
          >
            <span>live-stream-sport.com</span>
            <span>{prompt ? 'مجاني — نسخ ولصق مباشرة' : ''}</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Tajawal',
            data: regData,
            weight: 400,
            style: 'normal'
          },
          {
            name: 'Tajawal',
            data: boldData,
            weight: 700,
            style: 'normal'
          }
        ]
      }
    );
  } catch (e: any) {
    return new Response(`Failed: ${e.message}`, { status: 500 });
  }
}
