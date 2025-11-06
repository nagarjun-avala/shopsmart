import db from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/server/jwt";
import { slugifyKebab } from "@/lib/slugify";

export const GET = async (req: Request) => {
    try {
        // Verify user
        const auth = req.headers.get("authorization") ?? "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
        let userId: string | null = null;

        if (token) {
            const pl = verifyAccessToken(token);
            userId = pl?.sub || null;
        } else {
            const cookie = req.headers.get("cookie") ?? "";
            const raw = cookie.split("; ").find(c => c.startsWith("refreshToken="))?.split("=")[1];
            if (raw) {
                const pl = verifyRefreshToken(raw);
                userId = pl?.sub || null;
            }
        }

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch user's active lists
        const lists = await db.list.findMany({
            where: {
                OR: [
                    { createdUserId: userId },
                    { contributors: { some: { userId } } }
                ],
                status: "active"
            },
            select: {
                items: true,
                id: true,
                name: true,
                description: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                createdUserId: true,
                contributors: {
                    select: {
                        user: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                },
                _count: {
                    select: { items: true }
                }
            },
            orderBy: { updatedAt: "desc" }
        });

        // Format response
        const formattedLists = lists.map(list => ({
            id: list.id,
            name: list.name,
            description: list.description,
            status: list.status,
            createdAt: list.createdAt.toISOString(),
            updatedAt: list.updatedAt.toISOString(),
            createdUserId: list.createdUserId,
            contributors: list.contributors.map(c => c.user.id),
            contributorUsers: list.contributors.map(c => c.user),
            totalItems: list._count.items,
            items: list.items || []
        }));

        return NextResponse.json({ lists: formattedLists }, { status: 200 });
    } catch (error) {
        console.error("Lists API error:", error);
        return new NextResponse("Failed to fetch lists", { status: 500 });
    }
};

export const POST = async (req: Request) => {
    try {

        // Verify user
        const auth = req.headers.get("authorization") ?? "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
        let userId: string | null = null;

        if (token) {
            const pl = verifyAccessToken(token);
            userId = pl?.sub || null;
        } else {
            const cookie = req.headers.get("cookie") ?? "";
            const raw = cookie.split("; ").find(c => c.startsWith("refreshToken="))?.split("=")[1];
            if (raw) {
                const pl = verifyRefreshToken(raw);
                userId = pl?.sub || null;
            }
        }

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();

        const { name, description } = body;

        if (!name) {
            return new NextResponse(JSON.stringify({ message: "Name is required" }), {
                status: 400,
            });
        }

        const slug = slugifyKebab(name);

        // Check if slug already exists
        const existingList = await db.list.findUnique({ where: { slug } });
        if (existingList) {
            return new NextResponse(JSON.stringify({ message: "List with this name already exists" }), {
                status: 409,
            });
        }

        const newList = await db.list.create({
            data: {
                name,
                slug,
                description,
                createdUserId: userId
            },
        });

        return new NextResponse(JSON.stringify(newList), { status: 201 });
    } catch (error: unknown) {
        console.error("Error creating list:", error);
        return new NextResponse("Failed to create list", { status: 500 });
    }
};