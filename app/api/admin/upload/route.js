import { NextResponse } from 'next/server';
import { guardAdmin } from '@/lib/requireAdminApi';
import { prisma } from '@/lib/prisma';
import { analyzeDatabaseUrl } from '@/lib/validateDatabaseUrl';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']);

export async function POST(request) {
  const auth = await guardAdmin(request);
  if (!auth.ok) return auth.response;

  const urlCheck = analyzeDatabaseUrl();
  if (!urlCheck.ok) {
    return NextResponse.json({ message: urlCheck.message }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'No image file received' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ message: 'Image must be under 5MB' }, { status: 400 });
    }

    const mimeType = file.type || 'image/jpeg';
    if (!ALLOWED.has(mimeType)) {
      return NextResponse.json({ message: 'Use JPG, PNG, WebP, or GIF' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const data = buffer.toString('base64');

    const asset = await prisma.mediaAsset.create({
      data: {
        mimeType,
        filename: file.name || 'upload',
        data,
        size: file.size,
      },
    });

    const url = `/api/media/${asset.id}`;
    return NextResponse.json({ url, id: asset.id });
  } catch (error) {
    console.error('admin upload', error);
    return NextResponse.json({ message: 'Upload failed — check database connection' }, { status: 500 });
  }
}
