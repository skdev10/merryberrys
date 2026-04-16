import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { FREE_SHIPPING_MIN_PKR, STANDARD_SHIPPING_PKR } from '@/lib/currency';

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const shipping = body.shipping || {};
    const paymentMethod = body.paymentMethod || 'card';

    const cartLines = await prisma.cart.findMany({
      where: { userId: user.id },
      include: { product: true },
    });

    if (!cartLines.length) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    const subtotal = cartLines.reduce(
      (sum, line) => sum + line.product.price * line.quantity,
      0
    );
    const shippingCost = subtotal >= FREE_SHIPPING_MIN_PKR ? 0 : STANDARD_SHIPPING_PKR;
    const total = subtotal + shippingCost;

    const addressPayload = {
      ...shipping,
      email: shipping.email || user.email,
    };

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: user.id,
          total,
          status: 'PROCESSING',
          address: JSON.stringify(addressPayload),
          paymentMethod,
          isPaid: true,
        },
      });

      for (const line of cartLines) {
        await tx.orderItem.create({
          data: {
            orderId: created.id,
            productId: line.productId,
            quantity: line.quantity,
            price: line.product.price,
            size: line.size,
            color: line.color,
          },
        });
      }

      await tx.cart.deleteMany({ where: { userId: user.id } });

      return created;
    });

    return NextResponse.json({ orderId: order.id, total: order.total }, { status: 201 });
  } catch (e) {
    console.error('orders POST', e);
    return NextResponse.json({ message: 'Could not place order' }, { status: 500 });
  }
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      orderItems: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ orders });
}
