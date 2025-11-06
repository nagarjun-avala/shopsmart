import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/server/jwt";

export const GET = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
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

        const { id } = await params;

        // Fetch specific item
        const item = await db.item.findFirst({
            where: {
                id,
                addedUserId: userId
            },
            include: {
                category: true,
                addedBy: { select: { id: true, name: true, email: true } },
                list: { select: { id: true, name: true } }
            }
        });

        if (!item) {
            return new NextResponse("Item not found", { status: 404 });
        }

        // Format item
        const formattedItem = {
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
        };

        return NextResponse.json({ item: formattedItem }, { status: 200 });
    } catch (error) {
        console.error("Error fetching item:", error);
        return new NextResponse("Failed to fetch item", { status: 500 });
    }
};

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
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

        const { id } = await params;
        const body = await req.json();

        // Check if item exists and belongs to user
        const existingItem = await db.item.findFirst({
            where: {
                id,
                addedUserId: userId
            }
        });

        if (!existingItem) {
            return new NextResponse(JSON.stringify({ message: "Item not found" }), { status: 404 });
        }

        const { name, quantity, unit, categoryId, brand, note, priority, estimatedPrice, completed, listId } = body;

        // Prepare update data
        const updateData: Partial<{
            name: string;
            quantity: number;
            unit: string;
            categoryId: string;
            brand: string;
            note: string;
            priority: "LOW" | "MEDIUM" | "HIGH";
            estimatedPrice: number;
            completed: boolean;
            completedAt: Date | null;
            listId: string | null;
        }> = {};

        if (name !== undefined) {
            if (!name.trim()) {
                return new NextResponse(JSON.stringify({ message: "Name cannot be empty" }), { status: 400 });
            }
            updateData.name = name;
        }

        if (quantity !== undefined) {
            const qty = parseInt(quantity);
            if (isNaN(qty) || qty < 1) {
                return new NextResponse(JSON.stringify({ message: "Quantity must be a positive integer" }), { status: 400 });
            }
            updateData.quantity = qty;
        }

        if (unit !== undefined) {
            updateData.unit = unit;
        }

        if (categoryId !== undefined) {
            // Validate category exists
            const category = await db.category.findUnique({ where: { id: categoryId } });
            if (!category) {
                return new NextResponse(JSON.stringify({ message: "Invalid category" }), { status: 400 });
            }
            updateData.categoryId = categoryId;
        }

        if (brand !== undefined) {
            updateData.brand = brand;
        }

        if (note !== undefined) {
            updateData.note = note;
        }

        if (priority !== undefined) {
            const priorityEnum = priority.toUpperCase();
            if (!["LOW", "MEDIUM", "HIGH"].includes(priorityEnum)) {
                return new NextResponse(JSON.stringify({ message: "Invalid priority" }), { status: 400 });
            }
            updateData.priority = priorityEnum as "LOW" | "MEDIUM" | "HIGH";
        }

        if (estimatedPrice !== undefined) {
            const price = parseFloat(estimatedPrice);
            if (isNaN(price) || price < 0) {
                return new NextResponse(JSON.stringify({ message: "Estimated price must be a non-negative number" }), { status: 400 });
            }
            updateData.estimatedPrice = price;
        }

        if (completed !== undefined) {
            updateData.completed = completed;
            if (completed) {
                updateData.completedAt = new Date();
            } else {
                updateData.completedAt = null;
            }
        }

        if (listId !== undefined) {
            if (listId) {
                // Validate list exists and user has access
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
                    return new NextResponse(JSON.stringify({ message: "Invalid list or no access" }), { status: 400 });
                }
            }
            updateData.listId = listId || null;
        }

        // Update the item
        const updatedItem = await db.item.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
                addedBy: { select: { id: true, name: true, email: true } },
                list: { select: { id: true, name: true } }
            }
        });

        // Format response
        const formattedItem = {
            id: updatedItem.id,
            name: updatedItem.name,
            quantity: updatedItem.quantity,
            unit: updatedItem.unit,
            category: updatedItem.category ? {
                id: updatedItem.category.id,
                name: updatedItem.category.name,
                slug: updatedItem.category.slug,
                color: updatedItem.category.color || "#999",
                icon: updatedItem.category.icon || "Folder"
            } : null,
            categoryId: updatedItem.categoryId,
            brand: updatedItem.brand,
            note: updatedItem.note,
            priority: updatedItem.priority.toLowerCase() as "low" | "medium" | "high",
            estimatedPrice: updatedItem.estimatedPrice,
            completed: updatedItem.completed,
            completedAt: updatedItem.completedAt?.toISOString() || null,
            addedBy: updatedItem.addedBy.name,
            addedAt: updatedItem.createdAt.toISOString(),
            createdAt: updatedItem.createdAt.toISOString(),
            updatedAt: updatedItem.updatedAt.toISOString(),
            listId: updatedItem.listId,
            list: updatedItem.list
        };

        return NextResponse.json(formattedItem, { status: 200 });
    } catch (error: unknown) {
        console.error("Error updating item:", error);
        return new NextResponse("Failed to update item", { status: 500 });
    }
};

export const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
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

        const { id } = await params;

        // Check if item exists and belongs to user
        const item = await db.item.findFirst({
            where: {
                id,
                addedUserId: userId
            }
        });

        if (!item) {
            return new NextResponse(JSON.stringify({ message: "Item not found" }), { status: 404 });
        }

        // Delete the item
        await db.item.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
    } catch (error: unknown) {
        console.error("Error deleting item:", error);
        return new NextResponse("Failed to delete item", { status: 500 });
    }
};
