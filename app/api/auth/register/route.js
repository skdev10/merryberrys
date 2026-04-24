import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Name, email and password required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: 'user',
      },
    });

    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    return NextResponse.json(
      {
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('auth register', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
