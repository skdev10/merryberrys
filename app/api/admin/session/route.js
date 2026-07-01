import { NextResponse } from 'next/server';
import { guardAdmin } from '@/lib/requireAdminApi';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const auth = await guardAdmin(request);
  if (!auth.ok) return auth.response;

  return NextResponse.json({
    ok: true,
    user: {
      id: auth.admin.id,
      name: auth.admin.name,
      email: auth.admin.email,
      role: auth.admin.role,
    },
  });
}
