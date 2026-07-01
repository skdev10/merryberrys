import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardAdmin } from '@/lib/requireAdminApi';

function normalizeCode(value) {
  return decodeURIComponent(String(value || ''))
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}

export async function DELETE(request, context) {
  const auth = await guardAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { code: rawCode } = await context.params;
    const code = normalizeCode(rawCode);

    await prisma.coupon.delete({ where: { code } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
    }
    console.error('admin coupons DELETE', error);
    return NextResponse.json({ message: 'Failed to delete coupon' }, { status: 500 });
  }
}

export async function PUT(request, context) {
  const auth = await guardAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const { code: rawCode } = await context.params;
    const code = normalizeCode(rawCode);
    const body = await request.json();
    const description = String(body.description || '').trim();
    const discount = Number(body.discount);
    const forNewUser = Boolean(body.forNewUser);
    const forMember = Boolean(body.forMember);
    const isPublic = body.isPublic !== undefined ? Boolean(body.isPublic) : true;
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

    if (!description) {
      return NextResponse.json({ message: 'Description is required' }, { status: 400 });
    }

    if (!Number.isFinite(discount) || discount < 1 || discount > 100) {
      return NextResponse.json({ message: 'Discount must be between 1 and 100' }, { status: 400 });
    }

    if (!expiresAt || Number.isNaN(expiresAt.getTime())) {
      return NextResponse.json({ message: 'Valid expiry date is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.update({
      where: { code },
      data: {
        description,
        discount: Math.round(discount),
        forNewUser,
        forMember,
        isPublic,
        expiresAt,
      },
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ message: 'Coupon not found' }, { status: 404 });
    }
    console.error('admin coupons PUT', error);
    return NextResponse.json({ message: 'Failed to update coupon' }, { status: 500 });
  }
}
