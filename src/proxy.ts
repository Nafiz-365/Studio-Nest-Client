import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const hasSessionCookie =
    request.cookies.has('better-auth.session_token') ||
    request.cookies.has('__Secure-better-auth.session_token') ||
    request.cookies.has('better-auth-session_token') ||
    request.cookies.has('__Secure-better-auth-session_token')

  if (!hasSessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set(
      'from',
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    )
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/add-studio/:path*',
    '/my-bookings/:path*',
    '/my-listings/:path*',
    '/wishlist/:path*',
    '/studios/edit/:path*',
  ],
}
