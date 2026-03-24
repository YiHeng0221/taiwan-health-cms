/**
 * @fileoverview Next.js Middleware for Admin Path Rewrite & Auth Protection
 *
 * Rewrites /{ADMIN_PREFIX}/* → /admin/* so the actual admin path is not guessable.
 * Direct access to /admin/* is blocked with a 404.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PREFIX = process.env.NEXT_PUBLIC_ADMIN_PREFIX || 'admin';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block direct /admin access when a custom prefix is configured
  if (ADMIN_PREFIX !== 'admin' && pathname.startsWith('/admin')) {
    return new NextResponse(null, { status: 404 });
  }

  // Only handle requests that start with our admin prefix
  if (!pathname.startsWith(`/${ADMIN_PREFIX}`)) {
    return NextResponse.next();
  }

  const adminSubPath = pathname.slice(`/${ADMIN_PREFIX}`.length) || '';
  const loginPath = `/${ADMIN_PREFIX}/login`;

  // Protect admin routes (except login)
  if (pathname !== loginPath) {
    const authCookie = request.cookies.get('access_token');
    if (!authCookie) {
      const loginUrl = new URL(loginPath, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If logged in and accessing login page, redirect to admin dashboard
  if (pathname === loginPath) {
    const authCookie = request.cookies.get('access_token');
    if (authCookie) {
      return NextResponse.redirect(new URL(`/${ADMIN_PREFIX}`, request.url));
    }
  }

  // Rewrite to internal /admin route when using custom prefix
  if (ADMIN_PREFIX !== 'admin') {
    const internalPath = `/admin${adminSubPath}`;
    return NextResponse.rewrite(new URL(internalPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
