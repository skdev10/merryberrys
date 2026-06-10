import { NextResponse } from 'next/server';
import { guardAdmin } from '@/lib/requireAdminApi';
import { getSiteMedia, upsertSiteMedia } from '@/lib/siteSettingsServer';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const auth = await guardAdmin(request);
  if (!auth.ok) return auth.response;
  const settings = await getSiteMedia();
  return NextResponse.json({ settings });
}

export async function PUT(request) {
  const auth = await guardAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json();
    const settings = await upsertSiteMedia(body?.settings || body);
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('admin site-settings PUT', error);
    return NextResponse.json({ message: 'Failed to save settings' }, { status: 500 });
  }
}
