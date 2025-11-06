import { cookies } from "next/headers";
import db from "@/lib/db";
import { verifyRefreshToken } from "@/lib/server/jwt";

export async function POST() {
    const token = (await cookies()).get("refreshToken")?.value;
    if (!token) return new Response("Unauthorized", { status: 401 });

    const payload = verifyRefreshToken(token);
    if (!payload?.sub || !payload.deviceId) return new Response("Unauthorized", { status: 401 });

    await db.session.updateMany({
        where: {
            userId: payload.sub,
            NOT: { deviceId: payload.deviceId },
        },
        data: { revoked: true },
    });

    await db.securityEvent.create({
        data: {
            userId: payload.sub,
            type: "logout_other",
            deviceId: payload.deviceId,
        }
    });


    return new Response("OK");
}
