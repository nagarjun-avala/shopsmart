import { NextResponse } from "next/server";
import { verifyRefreshToken } from "@/lib/server/jwt";
import db from "@/lib/db";
import { cookies } from "next/headers";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const token = (await cookies()).get("refreshToken")?.value;
    if (!token) return new Response("Unauthorized", { status: 401 });

    const payload = verifyRefreshToken(token);
    if (!payload?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const session = await db.session.findUnique({ where: { id } });
    if (!session || session.userId !== payload.sub) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.session.update({ where: { id: session.id }, data: { revoked: true } });

    await db.securityEvent.create({
        data: { userId: payload.sub, type: "revoke_device", deviceId: session.deviceId, userAgent: session.userAgent }
    });

    return NextResponse.json({ ok: true });
}
