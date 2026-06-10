import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeDatabaseUrl } from '@/lib/validateDatabaseUrl';

export const dynamic = 'force-dynamic';

/** Public health check — shows if production DB has products. */
export async function GET() {
  const urlCheck = analyzeDatabaseUrl();
  if (!urlCheck.ok) {
    return NextResponse.json(
      {
        ok: false,
        database: 'misconfigured',
        reason: urlCheck.reason,
        message: urlCheck.message,
        fix: [
          '1. Open https://console.neon.tech → your project (restore if paused)',
          '2. Connection details → Pooled connection → copy full URL',
          '3. Vercel → merryberrys → Settings → Environment Variables → DATABASE_URL',
          '4. Redeploy → check this URL again',
        ],
      },
      { status: 503 }
    );
  }

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
