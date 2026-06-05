import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardAdmin } from '@/lib/requireAdminApi';

export async function GET(request) {
  const auth = await guardAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const slides = await prisma.heroSlide.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json({ slides });
  } catch (error) {
    console.error('admin hero-slides GET', error);
    return NextResponse.json({ message: 'Failed to load slides' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await guardAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const body = await request.json();
    const slide = await prisma.heroSlide.create({
      data: {
        imageUrl: body.imageUrl || '',
        videoUrl: body.videoUrl || null,
        title: body.title || 'New slide',
        subtitle: body.subtitle || null,
        ctaLabel: body.ctaLabel || 'Shop',
        ctaHref: body.ctaHref || '/shop',
        sortOrder: Number(body.sortOrder) || 0,
        active: body.active !== false,
      },
    });
    return NextResponse.json({ slide }, { status: 201 });
  } catch (error) {
    console.error('admin hero-slides POST', error);
    return NextResponse.json({ message: 'Failed to create slide' }, { status: 500 });
  }
}
