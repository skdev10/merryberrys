import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

function secretKey() {
  const s = process.env.JWT_SECRET;
  if (s) return new TextEncoder().encode(s);
  if (process.env.NODE_ENV === 'development') {
    return new TextEncoder().encode('dev-only-gocart-jwt-secret-change-me');
  }
  return new TextEncoder().encode('');
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('gocart_session')?.value;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    try {
      const { payload } = await jwtVerify(token, secretKey());
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  if (pathname === '/cart' || pathname === '/checkout' || pathname.startsWith('/account')) {
    if (!token) {
      const login = new URL('/login', request.url);
      login.searchParams.set('redirect', pathname);
      return NextResponse.redirect(login);
    }
    try {
      await jwtVerify(token, secretKey());
      return NextResponse.next();
    } catch {
      const login = new URL('/login', request.url);
      login.searchParams.set('redirect', pathname);
      return NextResponse.redirect(login);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/cart', '/checkout', '/account/:path*'],
};
