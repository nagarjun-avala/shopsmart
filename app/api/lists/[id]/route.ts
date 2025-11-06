import db from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/server/jwt";

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        // Verify user
        const auth = req.headers.get("authorization") ?? "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
        let userId: string | null = null;

        if (token) {
            const pl = verifyAccessToken(token);
            userId = pl?.sub || null;
        } else {
            const raw = req.headers.get("cookie")?.split("; ").find(c => c.startsWith("refreshToken="))?.split("=")[1];
            if (raw) {
                const pl = verifyRefreshToken(raw);
                userId = pl?.sub || null;
            }
        }

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id: listId } = await params;

        // Fetch specific list with items
        const list = await db.list.findFirst({
            where: {
                id: listId,
                OR: [
                    { createdUserId: userId },
                    { contributors: { some: { userId } } }
                ]
            },
            include: {
                contributors: {
                    include: {
                        user: { select: { id: true, name: true, email: true } }
                    }
                },
                items: {
                    include: {
                        category: true,
                        addedBy: { select: { id: true, name: true, email: true } }
                    },
                    orderBy: { createdAt: "desc" }
                }
            }
        });

        if (!list) {
            return new NextResponse("List not found", { status: 404 });
        }

        // Format items to match frontend expectations
        const formattedItems = list.items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            category: null, // category relation is included separately
            categoryId: item.categoryId,
            brand: item.brand,
            note: item.note,
            priority: item.priority.toLowerCase() as "low" | "medium" | "high",
            estimatedPrice: item.estimatedPrice,
            completed: item.completed,
            completedAt: item.completedAt?.toISOString() || null,
            addedBy: item.addedBy.name,
            addedAt: item.createdAt.toISOString(),
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString()
        }));

        // Format response
        const formattedList = {
            id: list.id,
            name: list.name,
            description: list.description,
            status: list.status,
            createdAt: list.createdAt.toISOString(),
            updatedAt: list.updatedAt.toISOString(),
            createdUserId: list.createdUserId,
            contributors: list.contributors.map(c => c.user.id),
            items: formattedItems
        };

        return NextResponse.json({ list: formattedList }, { status: 200 });
    } catch (error) {
        console.error("List API error:", error);
        return new NextResponse("Failed to fetch list", { status: 500 });
    }
};
