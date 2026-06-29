import { NextResponse } from 'next/server';
import { guardAdmin } from '@/lib/requireAdminApi';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(request) {
  const auth = await guardAdmin(request);
  if (!auth.ok) return auth.response;

  const apiKey = process.env.IMGBB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        message:
          'Server upload not configured. Use ImgBB.com → upload → copy “Direct link”, ya Vercel par IMGBB_API_KEY add karein (free at api.imgbb.com).',
      },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'No image file received' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ message: 'Image must be under 8MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');

    const uploadRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ image: base64 }),
      }
    );

    const data = await uploadRes.json();
    const url = data?.data?.url || data?.data?.display_url;

    if (!uploadRes.ok || !url) {
      console.error('imgbb upload', data);
      return NextResponse.json({ message: 'Image host rejected upload' }, { status: 500 });
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('admin upload', error);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
