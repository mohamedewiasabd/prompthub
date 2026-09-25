import { NextRequest, NextResponse } from 'next/server';
import { getAdSenseSettings, updateAdSenseSettings, getPixelSettings, updatePixelSettings } from '@/lib/db';
import { verifyAuthToken } from '@/lib/auth';

// Public GET to fetch current AdSense & public Pixel settings
export async function GET() {
  try {
    const adSense = getAdSenseSettings();
    const pixel = getPixelSettings();

    return NextResponse.json({
      success: true,
      adSense,
      pixel
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// Protected POST/PUT to update AdSense & Pixel settings (Admin only)
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const cookieToken = req.cookies.get('ph_admin_token')?.value;
    const token = (authHeader && authHeader.startsWith('Bearer '))
      ? authHeader.substring(7)
      : cookieToken;

    if (!token || !verifyAuthToken(token)) {
      return NextResponse.json({ success: false, error: 'غير مصرح لك بتعديل الإعدادات' }, { status: 401 });
    }

    const body = await req.json();
    const { adSense, pixel } = body;

    let updatedAdSense = null;
    let updatedPixel = null;

    if (adSense) {
      updatedAdSense = updateAdSenseSettings(adSense);
    }

    if (pixel) {
      updatedPixel = updatePixelSettings(pixel);
    }

    return NextResponse.json({
      success: true,
      message: 'تم حفظ إعدادات أدسنس والبكسل بنجاح',
      adSense: updatedAdSense || getAdSenseSettings(),
      pixel: updatedPixel || getPixelSettings()
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
