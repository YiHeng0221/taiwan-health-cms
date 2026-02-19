/**
 * @fileoverview Next.js Middleware for Auth Protection
 * 
 * Protects /admin routes (except /admin/login) by checking for auth cookie.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const authCookie = request.cookies.get('access_token');

    // If no auth cookie, redirect to login
    if (!authCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in and trying to access login page, redirect to admin
  if (pathname === '/admin/login') {
    const authCookie = request.cookies.get('access_token');
    if (authCookie) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
