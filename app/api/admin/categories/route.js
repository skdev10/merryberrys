import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: [{ parent: 'asc' }, { name: 'asc' }],
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('admin categories GET', error);
    return NextResponse.json({ message: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const parent = String(body.parent || '').trim() || null;
    const slug = slugify(body.slug || name);

    if (!name || !slug) {
      return NextResponse.json({ message: 'Name and slug are required' }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: { name, slug, parent },
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error('admin categories POST', error);
    return NextResponse.json({ message: 'Failed to create category' }, { status: 500 });
  }
}

