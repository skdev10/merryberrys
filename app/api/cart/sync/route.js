import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

/** Merge guest cart (from localStorage) into the authenticated user's server cart */
export async function POST(request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];

    for (const raw of items) {
      const productId = raw.productId || raw.id;
      if (!productId) continue;

      const quantity = Math.max(1, parseInt(String(raw.quantity || 1), 10) || 1);
      const size = raw.size === undefined || raw.size === '' ? null : String(raw.size);
      const color = raw.color === undefined || raw.color === '' ? null : String(raw.color);

      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) continue;

      const existing = await prisma.cart.findFirst({
        where: {
          userId: user.id,
          productId,
          size,
          color,
        },
      });

      if (existing) {
        await prisma.cart.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + quantity },
        });
      } else {
        await prisma.cart.create({
          data: {
            userId: user.id,
            productId,
            quantity,
            size,
            color,
          },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('cart sync', e);
    return NextResponse.json({ message: 'Sync failed' }, { status: 500 });
  }
}
