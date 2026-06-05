import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/authServer';

export async function guardAdmin(request) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return { ok: false, response: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }
  return { ok: true, admin };
}
