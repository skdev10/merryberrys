import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardAdmin } from '@/lib/requireAdminApi';

// GET all orders
export async function GET(request) {
    const auth = await guardAdmin(request);
    if (!auth.ok) return auth.response;
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: true,
                orderItems: {
                    include: {
                        product: true
                    }
                },
                transactions: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { message: 'Failed to fetch orders' },
            { status: 500 }
        );
    }
}
