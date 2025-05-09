import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect' },
  { path: '/register', whenAuthenticated: 'redirect' },
  { path: 'products', whenAuthenticated: 'next' },
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login'

export async function middleware(request: NextRequest) {
  const cookie = await cookies()
  const path = request.nextUrl.pathname
  const publicRoute = publicRoutes.find((route) => route.path === path)
  const refresh_token = cookie.get('refresh_token')

  if (!refresh_token && publicRoute) {
    return NextResponse.next()
  }

  if (!refresh_token && !publicRoute) {
    const redirectUrl = request.nextUrl.clone()

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

    return NextResponse.redirect(redirectUrl)
  }

  if (refresh_token?.value.split('.').length !== 3) {
    cookie.delete('refresh_token')
    const redirectUrl = request.nextUrl.clone()

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

    return NextResponse.redirect(redirectUrl)
  }

  if (refresh_token) {
    const decodedToken = jwtDecode<{ exp?: number }>(refresh_token.value)

    if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
      cookie.delete('refresh_token')
      const redirectUrl = request.nextUrl.clone()

      redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

      return NextResponse.redirect(redirectUrl)
    }
  }

  if (
    refresh_token &&
    publicRoute &&
    publicRoute.whenAuthenticated === 'redirect'
  ) {
    const redirectUrl = request.nextUrl.clone()

    redirectUrl.pathname = '/'

    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
