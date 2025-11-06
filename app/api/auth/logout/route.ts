import db from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { verifyRefreshToken } from "@/lib/server/jwt";

export async function POST() {
  try {
    const token = (await cookies()).get("refreshToken")?.value;
    if (!token) return new Response("OK");

    const payload = verifyRefreshToken(token);
    if (!payload?.sub || !payload.deviceId) return new Response("OK");

    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    await db.session.updateMany({
      where: {
        userId: payload.sub,
        deviceId: payload.deviceId,
        refreshTokenHash: hashed,
      },
      data: { revoked: true },
    });

    await db.securityEvent.create({
      data: {
        userId: payload.sub,
        type: "logout_current",
        deviceId: payload.deviceId,
      }
    });


    (await cookies()).delete("refreshToken");

    return new NextResponse("OK");
  } catch {
    return NextResponse.json({ message: "Error clearing sessions" }, { status: 500 });
  }
}
