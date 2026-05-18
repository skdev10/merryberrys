import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '@/lib/cart';
import { getAuthUser } from '@/lib/authServer';

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    const body = await request.json();
    const { cart, address, paymentMethod } = body;
    const userId = authUser.id;

    if (!Array.isArray(cart) || !cart.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const productIds = cart.map((item) => item.id).filter(Boolean);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, inStock: true, stockQuantity: true },
    });
    const productById = new Map(products.map((product) => [product.id, product]));

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'One or more cart items are invalid' }, { status: 400 });
    }

    for (const item of cart) {
      const product = productById.get(item.id);
      const quantity = Math.max(1, Number(item.quantity) || 1);
      if (!product?.inStock || product.stockQuantity < quantity) {
        return NextResponse.json(
          { error: `Insufficient inventory for product ${item.id}` },
          { status: 409 }
        );
      }
    }

    const subtotal = cart.reduce((sum, item) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      return sum + (Number(productById.get(item.id)?.price) || 0) * quantity;
    }, 0);
    const shipping = subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? STANDARD_SHIPPING_FEE : 0;
    const total = subtotal + shipping;
    const normalizedPaymentMethod = String(paymentMethod || 'bank_transfer');
    const requiresReview = ['bank_transfer', 'digital_wallet', 'cash_on_delivery'].includes(normalizedPaymentMethod);

    // Create the order and order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          total,
          address: JSON.stringify(address),
          paymentMethod: normalizedPaymentMethod,
          isPaid: false,
          paymentStatus: requiresReview ? 'REQUIRES_REVIEW' : 'PENDING',
          status: 'PENDING',
          orderItems: {
            create: cart.map(item => ({
              productId: item.id,
              quantity: Math.max(1, Number(item.quantity) || 1),
              price: Number(productById.get(item.id)?.price) || 0,
              size: item.size || null,
              color: item.color || null,
            }))
          },
          transactions: {
            create: {
              provider:
                normalizedPaymentMethod === 'digital_wallet'
                  ? 'manual_wallet'
                  : normalizedPaymentMethod === 'bank_transfer'
                    ? 'manual_bank'
                    : 'cash_on_delivery',
              method: normalizedPaymentMethod,
              amount: total,
              currency: 'PKR',
              status: requiresReview ? 'REQUIRES_REVIEW' : 'PENDING',
              reference: body.paymentReference || null,
              notes: body.paymentNotes || null,
            },
          },
        },
        include: {
          orderItems: true,
          transactions: true,
        },
      });

      await Promise.all(
        cart.map((item) =>
          tx.product.update({
            where: { id: item.id },
            data: {
              stockQuantity: {
                decrement: Math.max(1, Number(item.quantity) || 1),
              },
            },
          })
        )
      );

      return createdOrder;
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: authUser.id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        },
        transactions: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
