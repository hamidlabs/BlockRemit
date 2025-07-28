import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// Check if it's an auth route
	if (pathname.startsWith('/api/auth/')) {
		return NextResponse.next()
	}

	// Public routes that don't require authentication
	const publicRoutes = ['/login', '/register']
	if (publicRoutes.includes(pathname)) {
		return NextResponse.next()
	}

	try {
		// Get session from Better Auth
		const session = await auth.api.getSession({
			headers: request.headers,
		})

		// If no session and trying to access protected route, redirect to login
		if (!session && !publicRoutes.includes(pathname)) {
			return NextResponse.redirect(new URL('/login', request.url))
		}

		// If session exists and trying to access auth routes, redirect to dashboard
		if (session && publicRoutes.includes(pathname)) {
			return NextResponse.redirect(new URL('/transactions', request.url))
		}

		return NextResponse.next()
	} catch (error) {
		console.error('Middleware error:', error)

		// If there's an error getting session and it's not a public route, redirect to login
		if (!publicRoutes.includes(pathname)) {
			return NextResponse.redirect(new URL('/login', request.url))
		}

		return NextResponse.next()
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}
