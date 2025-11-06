import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/server/jwt";

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
            const raw = req.headers.get("cookie")?.split("; ").find(c => c.startsWith("refreshToken="))?.split("=")[1];
            if (raw) {
                const pl = verifyRefreshToken(raw);
                userId = pl?.sub || null;
            }
        }

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Fetch items added by the user
        const items = await db.item.findMany({
            where: { addedUserId: userId },
            include: {
                category: true,
                addedBy: { select: { id: true, name: true, email: true } },
                list: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        // Format items to match frontend expectations
        const formattedItems = items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            category: item.category ? {
                id: item.category.id,
                name: item.category.name,
                slug: item.category.slug,
                color: item.category.color || "#999",
                icon: item.category.icon || "Folder"
            } : null,
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
            updatedAt: item.updatedAt.toISOString(),
            listId: item.listId,
            list: item.list
        }));

        const summary = {
            totalItems: formattedItems.length,
            completedItems: formattedItems.filter(i => i.completed).length,
            pendingItems: formattedItems.filter(i => !i.completed).length,
            totalEstimatedPrice: formattedItems.reduce((sum, i) => sum + (i.estimatedPrice || 0), 0)
        };

        return NextResponse.json(
            { summary, items: formattedItems },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching items:", error);
        return new NextResponse("Failed to fetch items", { status: 500 });
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
            const raw = req.headers.get("cookie")?.split("; ").find(c => c.startsWith("refreshToken="))?.split("=")[1];
            if (raw) {
                const pl = verifyRefreshToken(raw);
                userId = pl?.sub || null;
            }
        }

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, quantity, unit, categoryId, brand, note, priority, estimatedPrice, listId } = body;

        if (!name || !quantity || !categoryId) {
            return new NextResponse(JSON.stringify({ message: "Name, quantity, and categoryId are required" }), {
                status: 400,
            });
        }

        // Validate category exists
        const category = await db.category.findUnique({ where: { id: categoryId } });
        if (!category) {
            return new NextResponse(JSON.stringify({ message: "Invalid category" }), {
                status: 400,
            });
        }

        // If listId provided, validate list exists and user has access
        if (listId) {
            const list = await db.list.findFirst({
                where: {
                    id: listId,
                    OR: [
                        { createdUserId: userId },
                        { contributors: { some: { userId } } }
                    ]
                }
            });
            if (!list) {
                return new NextResponse(JSON.stringify({ message: "Invalid list or no access" }), {
                    status: 400,
                });
            }
        }

        const priorityEnum = (priority?.toUpperCase() || "LOW") as "LOW" | "MEDIUM" | "HIGH";

        const newItem = await db.item.create({
            data: {
                name,
                quantity: parseInt(quantity),
                unit: unit || "",
                categoryId,
                brand,
                note,
                priority: priorityEnum,
                estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : 0,
                addedUserId: userId,
                listId: listId || null
            },
            include: {
                category: true,
                addedBy: { select: { id: true, name: true, email: true } },
                list: { select: { id: true, name: true } }
            }
        });

        // Format response
        const formattedItem = {
            id: newItem.id,
            name: newItem.name,
            quantity: newItem.quantity,
            unit: newItem.unit,
            category: newItem.category ? {
                id: newItem.category.id,
                name: newItem.category.name,
                slug: newItem.category.slug,
                color: newItem.category.color || "#999",
                icon: newItem.category.icon || "Folder"
            } : null,
            categoryId: newItem.categoryId,
            brand: newItem.brand,
            note: newItem.note,
            priority: newItem.priority.toLowerCase() as "low" | "medium" | "high",
            estimatedPrice: newItem.estimatedPrice,
            completed: newItem.completed,
            completedAt: newItem.completedAt?.toISOString() || null,
            addedBy: newItem.addedBy.name,
            addedAt: newItem.createdAt.toISOString(),
            createdAt: newItem.createdAt.toISOString(),
            updatedAt: newItem.updatedAt.toISOString(),
            listId: newItem.listId,
            list: newItem.list
        };

        return NextResponse.json(formattedItem, { status: 201 });
    } catch (error: unknown) {
        console.error("Error creating item:", error);
        return new NextResponse("Failed to create item", { status: 500 });
    }
};
