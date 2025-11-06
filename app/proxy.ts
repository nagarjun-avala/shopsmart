import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/server/jwt";

export const runtime = "edge";

// Define public routes (no authentication required)
const publicRoutes = ["/login", "/register", "/forgot-password", "/verify"];

export function proxy(request: NextRequest) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Skip authentication if the route is public
    if (publicRoutes.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    // Get token from Authorization header
    const auth = request.headers.get("authorization") ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    // If token is missing or invalid → redirect to login
    if (!token) {
        return NextResponse.redirect(new URL("/login", url));
    }

    const payload = verifyAccessToken(token);
    if (!payload?.sub) {
        return NextResponse.redirect(new URL("/login", url));
    }

    // Attach user info in headers for downstream usage
    const res = NextResponse.next();
    res.headers.set("x-user-id", String(payload.sub));
    return res;
}

// Configure which routes the proxy applies to
// Here it applies globally except for Next.js internals
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api/public).*)",
    ],
};
