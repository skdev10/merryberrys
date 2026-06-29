import { NextResponse } from 'next/server';
import {
  buildMobileBlockHtml,
  isBlockMobileEnabled,
  isMobileUserAgent,
  isSkippablePath,
} from './lib/mobileAccess';

export function middleware(request) {
  if (!isBlockMobileEnabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (isSkippablePath(pathname)) {
    return NextResponse.next();
  }

  const userAgent = request.headers.get('user-agent') || '';
  if (!isMobileUserAgent(userAgent)) {
    return NextResponse.next();
  }

  return new NextResponse(buildMobileBlockHtml(), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
