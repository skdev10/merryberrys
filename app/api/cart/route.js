import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

function normSizeColor(size, color) {
  const s = size === undefined || size === '' ? null : String(size);
  const c = color === undefined || color === '' ? null : String(color);
  return { size: s, color: c };
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const lines = await prisma.cart.findMany({
    where: { userId: user.id },
    include: { product: { include: { category: true } } },
    orderBy: { id: 'asc' },
  });

  return NextResponse.json({ items: lines });
}

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { productId, quantity = 1, size, color } = body;

    if (!productId) {
      return NextResponse.json({ message: 'productId is required' }, { status: 400 });
    }

    const { size: s, color: col } = normSizeColor(size, color);
    const qty = Math.max(1, parseInt(String(quantity), 10) || 1);

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const existing = await prisma.cart.findFirst({
      where: {
        userId: user.id,
        productId,
        size: s,
        color: col,
      },
    });

    if (existing) {
      const updated = await prisma.cart.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + qty },
        include: { product: { include: { category: true } } },
      });
      return NextResponse.json({ item: updated });
    }

    const created = await prisma.cart.create({
      data: {
        userId: user.id,
        productId,
        quantity: qty,
        size: s,
        color: col,
      },
      include: { product: { include: { category: true } } },
    });

    return NextResponse.json({ item: created }, { status: 201 });
  } catch (e) {
    console.error('cart POST', e);
    return NextResponse.json({ message: 'Failed to update cart' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { lineId, quantity } = body;

    if (!lineId) {
      return NextResponse.json({ message: 'lineId is required' }, { status: 400 });
    }

    const qty = Math.max(1, parseInt(String(quantity), 10) || 1);

    const line = await prisma.cart.findFirst({
      where: { id: lineId, userId: user.id },
    });

    if (!line) {
      return NextResponse.json({ message: 'Cart line not found' }, { status: 404 });
    }

    const updated = await prisma.cart.update({
      where: { id: lineId },
      data: { quantity: qty },
      include: { product: { include: { category: true } } },
    });

    return NextResponse.json({ item: updated });
  } catch (e) {
    console.error('cart PATCH', e);
    return NextResponse.json({ message: 'Failed to update cart' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const lineId = searchParams.get('lineId');

    if (lineId) {
      const line = await prisma.cart.findFirst({
        where: { id: lineId, userId: user.id },
      });
      if (!line) {
        return NextResponse.json({ message: 'Not found' }, { status: 404 });
      }
      await prisma.cart.delete({ where: { id: lineId } });
      return NextResponse.json({ ok: true });
    }

    await prisma.cart.deleteMany({ where: { userId: user.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('cart DELETE', e);
    return NextResponse.json({ message: 'Failed to update cart' }, { status: 500 });
  }
}
