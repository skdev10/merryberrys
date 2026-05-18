import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ALLOWED_STATUS = new Set([
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
]);

export async function GET(request, context) {
  try {
    const { id } = await context.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        orderItems: { include: { product: true } },
        transactions: true,
      },
    });
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (error) {
    console.error('admin orders GET [id]', error);
    return NextResponse.json({ message: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request, context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const status = body?.status;

    if (!status || !ALLOWED_STATUS.has(String(status))) {
      return NextResponse.json({ message: 'Invalid or missing status' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: String(status) },
      include: {
        user: true,
        orderItems: { include: { product: true } },
        transactions: true,
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error('admin orders PUT [id]', error);
    return NextResponse.json({ message: 'Failed to update order' }, { status: 500 });
  }
}
