import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ slides });
  } catch (error) {
    console.error('hero-slides GET', error);
    return NextResponse.json({ slides: [] }, { status: 200 });
  }
}
