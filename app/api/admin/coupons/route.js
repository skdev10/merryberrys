import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardAdmin } from '@/lib/requireAdminApi';

function normalizeCode(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}

export async function GET(request) {
  const auth = await guardAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: [{ createdAt: 'desc' }],
    });
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('admin coupons GET', error);
    return NextResponse.json({ message: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await guardAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const code = normalizeCode(body.code);
    const description = String(body.description || '').trim();
    const discount = Number(body.discount);
    const forNewUser = Boolean(body.forNewUser);
    const forMember = Boolean(body.forMember);
    const isPublic = body.isPublic !== undefined ? Boolean(body.isPublic) : true;
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

    if (!code || !description) {
      return NextResponse.json({ message: 'Code and description are required' }, { status: 400 });
    }

    if (!Number.isFinite(discount) || discount < 1 || discount > 100) {
      return NextResponse.json({ message: 'Discount must be between 1 and 100' }, { status: 400 });
    }

    if (!expiresAt || Number.isNaN(expiresAt.getTime())) {
      return NextResponse.json({ message: 'Valid expiry date is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        description,
        discount: Math.round(discount),
        forNewUser,
        forMember,
        isPublic,
        expiresAt,
      },
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    if (error?.code === 'P2002') {
      return NextResponse.json({ message: 'Coupon code already exists' }, { status: 409 });
    }
    console.error('admin coupons POST', error);
    return NextResponse.json({ message: 'Failed to create coupon' }, { status: 500 });
  }
}
