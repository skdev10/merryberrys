import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function PATCH(request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const current = await prisma.user.findUnique({
      where: { id: session.id },
      select: { preferences: true },
    });
    let merged = {};
    try {
      merged = JSON.parse(current?.preferences || '{}');
    } catch {
      merged = {};
    }
    merged = { ...merged, ...body };

    await prisma.user.update({
      where: { id: session.id },
      data: { preferences: JSON.stringify(merged) },
    });

    return NextResponse.json({ preferences: merged });
  } catch (e) {
    console.error('preferences', e);
    return NextResponse.json({ message: 'Failed to save preferences' }, { status: 500 });
  }
}
