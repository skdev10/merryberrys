import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function normalizeCode(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const code = normalizeCode(body.code);
    const isNewUser = Boolean(body.isNewUser);
    const isMember = Boolean(body.isMember);

    if (!code) {
      return NextResponse.json({ message: 'Coupon code is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({ where: { code } });

    if (!coupon || !coupon.active) {
      return NextResponse.json({ message: 'Invalid coupon code' }, { status: 404 });
    }

    if (coupon.expiresAt < new Date()) {
      return NextResponse.json({ message: 'This coupon has expired' }, { status: 400 });
    }

    if (coupon.forNewUser && !isNewUser) {
      return NextResponse.json({ message: 'This coupon is only for new users' }, { status: 400 });
    }

    if (coupon.forMember && !isMember) {
      return NextResponse.json({ message: 'This coupon is only for members' }, { status: 400 });
    }

    return NextResponse.json({
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discount: coupon.discount,
      },
    });
  } catch (error) {
    console.error('coupons validate POST', error);
    return NextResponse.json({ message: 'Failed to validate coupon' }, { status: 500 });
  }
}
