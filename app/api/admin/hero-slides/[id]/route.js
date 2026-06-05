import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { guardAdmin } from '@/lib/requireAdminApi';

export async function PUT(request, context) {
  const auth = await guardAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const { id } = await context.params;
    const body = await request.json();
    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        imageUrl: body.imageUrl,
        videoUrl: body.videoUrl && String(body.videoUrl).trim() ? String(body.videoUrl).trim() : null,
        title: body.title,
        subtitle: body.subtitle || null,
        ctaLabel: body.ctaLabel,
        ctaHref: body.ctaHref,
        sortOrder: Number(body.sortOrder) ?? 0,
        active: Boolean(body.active),
      },
    });
    return NextResponse.json({ slide });
  } catch (error) {
    console.error('admin hero-slides PUT', error);
    return NextResponse.json({ message: 'Failed to update slide' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const auth = await guardAdmin(request);
  if (!auth.ok) return auth.response;
  try {
    const { id } = await context.params;
    await prisma.heroSlide.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('admin hero-slides DELETE', error);
    return NextResponse.json({ message: 'Failed to delete slide' }, { status: 500 });
  }
}
