import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { requireAdmin } from '@/lib/auth';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string' || !file.name) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ message: 'File too large (max 5MB)' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    if (!ALLOWED.has(ext)) {
      return NextResponse.json({ message: 'Unsupported file type' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${ext}`;
    const dir = path.join(process.cwd(), 'public', 'uploads', 'products');
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

    const url = `/uploads/products/${filename}`;
    return NextResponse.json({ url });
  } catch (e) {
    console.error('upload', e);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}
