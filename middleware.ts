import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ALLOWED_API_PREFIXES,
  ALLOWED_PAGE_PREFIXES,
  ENDED_PATH_TO_KEY,
  NEW_SITE_URL,
} from './app/lib/migration';

const STATIC_FILE =
  /\.(?:png|jpe?g|gif|webp|svg|ico|html|txt|xml|json|js|css|map|woff2?|ttf|eot)$/i;

function isAllowedApi(pathname: string) {
  return ALLOWED_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isAllowedPage(pathname: string) {
  if (pathname === '/') return true;
  return ALLOWED_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    STATIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    if (isAllowedApi(pathname)) {
      return NextResponse.next();
    }

    return NextResponse.json(
      {
        error: 'AI-riska 베타 기간이 종료되었습니다.',
        message: '모두의 안전(modu-safe.com)에서 이용해 주세요.',
        redirect: NEW_SITE_URL,
      },
      { status: 410 }
    );
  }

  if (isAllowedPage(pathname)) {
    return NextResponse.next();
  }

  const endedKey = ENDED_PATH_TO_KEY[pathname];
  const url = request.nextUrl.clone();
  url.pathname = '/service-ended';
  url.search = endedKey ? `?feature=${endedKey}` : '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
