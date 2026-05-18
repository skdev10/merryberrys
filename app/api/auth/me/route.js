import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/authServer';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error('auth me', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
