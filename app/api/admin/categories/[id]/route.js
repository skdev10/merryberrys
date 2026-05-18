import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const name = String(body.name || '').trim();
    const parent = String(body.parent || '').trim() || null;
    const slug = slugify(body.slug || name);

    if (!name || !slug) {
      return NextResponse.json({ message: 'Name and slug are required' }, { status: 400 });
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, parent },
    });

    return NextResponse.json({ category });
  } catch (error) {
    console.error('admin categories PUT', error);
    return NextResponse.json({ message: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  try {
    const { id } = await context.params;
    const productCount = await prisma.product.count({ where: { categoryId: id } });

    if (productCount > 0) {
      return NextResponse.json(
        { message: 'Move or delete products before deleting this category' },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('admin categories DELETE', error);
    return NextResponse.json({ message: 'Failed to delete category' }, { status: 500 });
  }
}

