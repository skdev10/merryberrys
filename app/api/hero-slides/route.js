import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
