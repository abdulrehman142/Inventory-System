import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const user = request.cookies.get("user")
  const role = request.cookies.get("role")

  // If no user is logged in, redirect to login
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If user is logged in but no role is set, redirect to login
  if (!role) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const roleId = parseInt(role.value)

  // Check access based on role
  if (request.nextUrl.pathname.startsWith("/inventory")) {
    // Only allow access to inventory for role_id > 10
    if (roleId <= 10) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  } else if (request.nextUrl.pathname === "/") {
    // Allow access to root for role_id 1-10
    if (roleId > 10) {
      return NextResponse.redirect(new URL("/inventory", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/inventory/:path*"],
} 