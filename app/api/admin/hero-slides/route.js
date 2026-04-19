import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
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
