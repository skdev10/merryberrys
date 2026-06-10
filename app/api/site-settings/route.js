import { NextResponse } from 'next/server';
import { getSiteMedia } from '@/lib/siteSettingsServer';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = await getSiteMedia();
  return NextResponse.json({ settings });
}
