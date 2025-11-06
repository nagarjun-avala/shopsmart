// returns user if access token provided via authorization header OR refresh cookie (optional)
import { NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/server/jwt";
import db from "@/lib/db";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (token) {
    const pl = verifyAccessToken(token);
    if (pl?.sub) {
      const user = await db.user.findUnique({ where: { id: pl.sub }, select: { id: true, username: true, name: true, email: true } });
      if (!user)
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: 404 }
        );
      return NextResponse.json({ user });
    }
  }

  // fallback to refresh cookie (if access missing)
  const cookie = req.headers.get("cookie") ?? "";
  const raw = cookie.split("; ").find(c => c.startsWith("refreshToken="))?.split("=")[1];
  if (raw) {
    const pl = verifyRefreshToken(raw);
    if (pl?.sub) {
      const user = await db.user.findUnique({ where: { id: pl.sub }, select: { id: true, username: true, name: true, email: true } });
      if (!user)
        return NextResponse.json(
          { message: "Unauthorized" },
          { status: 404 }
        );
      return NextResponse.json({ user, msg: "hello" });
    }
  }

  return NextResponse.json({ user: null }, { status: 404 });
}
