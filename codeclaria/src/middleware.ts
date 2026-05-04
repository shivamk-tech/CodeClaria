import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

const PROTECTED_PAGES = ["/dashboard", "/analyze", "/profile"]
const PROTECTED_API = ["/api/repos", "/api/chat", "/api/github"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtectedPage = PROTECTED_PAGES.some((r) => pathname.startsWith(r))
  const isProtectedApi = PROTECTED_API.some((r) => pathname.startsWith(r))

  if (!isProtectedPage && !isProtectedApi) return NextResponse.next()

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analyze/:path*",
    "/profile/:path*",
    "/api/repos/:path*",
    "/api/chat/:path*",
    "/api/github/:path*",
  ],
}
