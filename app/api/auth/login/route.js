import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/password';
import { createSessionToken } from '@/lib/authServer';
import { isDatabaseConnectionError, databaseErrorResponse } from '@/lib/dbErrors';
import { analyzeDatabaseUrl } from '@/lib/validateDatabaseUrl';

export async function POST(request) {
  const urlCheck = analyzeDatabaseUrl();
  if (!urlCheck.ok) {
    return NextResponse.json(databaseErrorResponse(urlCheck.message), { status: 503 });
  }

  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role === 'admin') {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const ok = verifyPassword(password, user.password);
    if (!ok) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const token = createSessionToken(user.id);
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('auth login', error);
    if (isDatabaseConnectionError(error)) {
      return NextResponse.json(databaseErrorResponse(), { status: 503 });
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
