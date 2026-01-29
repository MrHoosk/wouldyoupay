import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // Extract subdomain
  // Handles: subdomain.wouldyoupay.io, subdomain.localhost:3000
  const hostParts = hostname.split('.')
  
  // Determine if we're on localhost or production
  const isLocalhost = hostname.includes('localhost')
  const rootDomain = isLocalhost ? 'localhost:3000' : 'wouldyoupay.io'
  
  // Get subdomain (if any)
  let subdomain: string | null = null
  
  if (isLocalhost && hostParts.length > 1) {
    // e.g., landlord.localhost:3000
    subdomain = hostParts[0]
  } else if (!isLocalhost && hostParts.length > 2) {
    // e.g., landlord.wouldyoupay.io
    subdomain = hostParts[0]
  }

  // Skip middleware for static files and API routes
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('.') // static files
  ) {
    return NextResponse.next()
  }

  // If we have a subdomain, rewrite to the dynamic idea page
  if (subdomain && subdomain !== 'www') {
    url.pathname = `/idea/${subdomain}${url.pathname === '/' ? '' : url.pathname}`
    return NextResponse.rewrite(url)
  }

  // Root domain - show the main landing page
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
}
