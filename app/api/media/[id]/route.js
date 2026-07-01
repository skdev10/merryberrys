import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return new NextResponse('Not found', { status: 404 });
    }

    const buffer = Buffer.from(asset.data, 'base64');
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': asset.mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(buffer.length),
      },
    });
  } catch (error) {
    console.error('media GET', error);
    return new NextResponse('Error', { status: 500 });
  }
}
