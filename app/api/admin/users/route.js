import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          select: { total: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const customers = users.map((user) => ({
      ...user,
      lifetimeValue: user.orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
      lastOrderAt: user.orders[0]?.createdAt || null,
      orders: undefined,
    }));

    return NextResponse.json({ users: customers });
  } catch (error) {
    console.error('admin users GET', error);
    return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 });
  }
}

