import { cookies } from "next/headers";
import db from "@/lib/db";
import { verifyRefreshToken } from "@/lib/server/jwt";

export async function GET() {
    const token = (await cookies()).get("refreshToken")?.value;
    if (!token) return new Response("Unauthorized", { status: 401 });

    const payload = verifyRefreshToken(token);
    if (!payload?.sub) return new Response("Unauthorized", { status: 401 });

    const sessions = await db.session.findMany({
        where: { userId: payload.sub, revoked: false },
        select: {
            id: true,
            deviceId: true,
            userAgent: true,
            platform: true,
            browser: true,
            ipAddress: true,
            createdAt: true,
            lastUsed: true,
        },
        orderBy: { lastUsed: "desc" }
    });

    return Response.json(sessions);
}
