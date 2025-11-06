import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hashPassword } from "@/lib/server/bcrypt";

export const POST = async (req: Request) => {
    try {
        const { name, email, username, password, inviteCode } = await req.json();

        if (!name || !email || !username || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email or username already exists" },
                { status: 409 }
            );
        }

        let role: "ADMIN" | "USER" = "ADMIN";
        let familyGroupId: string | undefined;

        if (inviteCode) {
            // Validate invite code for user registration
            const invite = await db.invite.findUnique({
                where: { code: inviteCode },
                include: { familyGroup: true }
            });

            if (!invite) {
                return NextResponse.json(
                    { message: "Invalid invite code" },
                    { status: 400 }
                );
            }

            if (invite.used) {
                return NextResponse.json(
                    { message: "Invite code has already been used" },
                    { status: 400 }
                );
            }

            if (new Date() > invite.expiresAt) {
                return NextResponse.json(
                    { message: "Invite code has expired" },
                    { status: 400 }
                );
            }

            if (invite.email !== email) {
                return NextResponse.json(
                    { message: "Invite code is not valid for this email address" },
                    { status: 400 }
                );
            }

            familyGroupId = invite.familyGroupId || undefined;
            role = "USER";

            // Mark invite as used
            await db.invite.update({
                where: { id: invite.id },
                data: { used: true }
            });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = await db.user.create({
            data: {
                name,
                email,
                username,
                password: hashedPassword,
                role: role,
                isActive: true,
            }
        });

        // If admin, create family group
        if (role === "ADMIN") {
            const familyGroup = await db.familyGroup.create({
                data: {
                    name: `${name}'s Family`,
                    createdBy: newUser.id,
                }
            });
            familyGroupId = familyGroup.id;
        }

        // If user with valid invite, add to family group
        if (role === "USER" && familyGroupId) {
            await db.familyGroupMember.create({
                data: {
                    groupId: familyGroupId,
                    userId: newUser.id,
                }
            });
        }

        return NextResponse.json(
            {
                message: "Registration successful",
                user: { id: newUser.id, email: newUser.email, role: newUser.role }
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Registration error:", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
};
