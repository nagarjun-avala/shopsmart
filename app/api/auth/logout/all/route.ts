import db from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken } from "@/lib/server/jwt";

export async function POST() {
  try {
    const token = (await cookies()).get("refreshToken")?.value;
    if (!token) return new Response("OK");

    const payload = verifyRefreshToken(token);
    if (!payload?.sub) return new Response("OK");

    await db.session.updateMany({
      where: { userId: payload.sub },
      data: { revoked: true },
    });
    await db.securityEvent.create({
      data: {
        userId: payload.sub,
        type: "logout_all",
        deviceId: payload.deviceId,
      }
    });


    (await cookies()).delete("refreshToken");

    return new Response("OK");
  } catch (err) {
    console.log("[LOGOUT_ALL]", err)
    return NextResponse.json({ message: "Error clearing sessions" }, { status: 500 });
  }
}
