import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSessionToken, SESSION_COOKIE } from '@/lib/session';

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 30,
  path: '/',
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    let ok = await bcrypt.compare(password, user.password);
    if (!ok && !user.password.startsWith('$2')) {
      if (user.password === password) {
        ok = true;
        const hashed = await bcrypt.hash(password, 12);
        await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
        user.password = hashed;
      }
    }
    if (!ok) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const token = await createSessionToken(user);
    const res = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
    res.cookies.set(SESSION_COOKIE, token, cookieOpts);
    return res;
  } catch (e) {
    console.error('login', e);
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}
