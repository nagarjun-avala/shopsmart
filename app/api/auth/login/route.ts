import { NextResponse } from "next/server";
import db from "@/lib/db";
import { createAccessToken, createRefreshToken } from "@/lib/server/jwt";
import { comparePassword } from "@/lib/server/bcrypt";
import { hashToken } from "@/lib/hash";

export const POST = async (req: Request) => {
    try {
        const { identifier, password, deviceId, userAgent, platform, browser } = await req.json();
        const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("host") ?? "";
        if (!identifier || !password) {
            return NextResponse.json(
                { message: "Email/Username and password are required" },
                { status: 400 }
            );
        }

        // Find user by email or username and include password field
        const user = await db.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!user || !(await comparePassword(password, user.password))) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const refreshToken = createRefreshToken({ sub: user.id, deviceId });
        const refreshHash = hashToken(refreshToken);

        await db.session.create({
            data: {
                userId: user.id,
                deviceId,
                refreshTokenHash: refreshHash,
                userAgent,
                platform,
                browser,
                ipAddress: ip,
            }
        });

        await db.securityEvent.create({
            data: { userId: user.id, type: "login", deviceId, ip, userAgent }
        });


        const accessToken = createAccessToken({ sub: user.id });
        const res = NextResponse.json(
            {
                message: "Login successful",
                user: { id: user.id, email: user.email },
            },
            { status: 200 }
        );

        res.cookies.set({
            name: "refreshToken",
            value: refreshToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        // Optionally set access token in cookie or return in body
        res.headers.set("Authorization", `Bearer ${accessToken}`);

        return res;
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};