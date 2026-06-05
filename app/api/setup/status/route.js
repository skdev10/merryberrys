import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

/** Public health check — shows if production DB has products. */
export async function GET() {
  try {
    const [products, categories, users] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.user.count(),
    ]);
    return NextResponse.json({
      ok: true,
      database: 'connected',
      products,
      categories,
      users,
      needsSeed: products === 0,
    });
  } catch (error) {
    console.error('setup status', error);
    return NextResponse.json(
      { ok: false, database: 'error', message: error.message },
      { status: 500 }
    );
  }
}
