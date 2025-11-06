import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/server/jwt";

export const POST = async (req: Request) => {
    try {
        const auth = req.headers.get("authorization") ?? "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

        let userId: string | null = null;

        if (token) {
            const pl = verifyAccessToken(token);
            userId = pl?.sub || null;
        }

        // fallback to refresh cookie
        if (!userId) {
            const cookie = req.headers.get("cookie") ?? "";
            const raw = cookie.split("; ").find(c => c.startsWith("refreshToken="))?.split("=")[1];
            if (raw) {
                const pl = verifyRefreshToken(raw);
                userId = pl?.sub || null;
            }
        }

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { email, role } = await req.json();

        if (!email || !role) {
            return NextResponse.json(
                { message: "Email and role are required" },
                { status: 400 }
            );
        }

        // Check if user is admin
        const user = await db.user.findUnique({
            where: { id: userId },
            include: { createdGroups: true }
        });

        if (!user || user.role !== "ADMIN") {
            return NextResponse.json(
                { message: "Only admins can send invites" },
                { status: 403 }
            );
        }

        // Check if email is already registered
        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        // Check if invite already exists for this email
        const existingInvite = await db.invite.findFirst({
            where: { email, used: false }
        });

        if (existingInvite) {
            return NextResponse.json(
                { message: "Invite already sent to this email" },
                { status: 409 }
            );
        }

        // Generate unique invite code
        const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Set expiration to 7 days from now
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Get user's family group
        const familyGroup = user.createdGroups[0];

        if (!familyGroup) {
            return NextResponse.json(
                { message: "Admin must have a family group" },
                { status: 400 }
            );
        }

        // Create invite
        const invite = await db.invite.create({
            data: {
                code,
                invitedBy: user.id,
                email,
                role: role === "Member" ? "USER" : "ADMIN",
                expiresAt,
                familyGroupId: familyGroup.id,
                used: false
            }
        });

        // Here you would send email with the invite code
        // Since no mailer is configured, we'll just return the code
        // In production, integrate with email service

        return NextResponse.json(
            {
                message: "Invite created successfully",
                invite: {
                    id: invite.id,
                    code: invite.code,
                    email: invite.email,
                    expiresAt: invite.expiresAt
                }
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Invite creation error:", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
