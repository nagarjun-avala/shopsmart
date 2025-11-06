import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { slugifyKebab } from "@/lib/slugify";

export const PATCH = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;
        const body = await req.json();

        const { name, color, icon, isActive, sharedWith } = body;

        // Check if category exists
        const existingCategory = await db.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            return new NextResponse(
                JSON.stringify({ message: "Category not found" }),
                { status: 404 }
            );
        }

        // Prepare update data
        const updateData: Partial<{
            name: string;
            slug: string;
            color: string;
            icon: string;
            isActive: boolean;
        }> = {};

        if (name !== undefined) {
            if (!name.trim()) {
                return new NextResponse(
                    JSON.stringify({ message: "Name cannot be empty" }),
                    { status: 400 }
                );
            }
            const newSlug = slugifyKebab(name);
            // Check if new slug conflicts with another category
            const slugConflict = await db.category.findUnique({
                where: { slug: newSlug },
            });
            if (slugConflict && slugConflict.id !== id) {
                return new NextResponse(
                    JSON.stringify({ message: "Category with this name already exists" }),
                    { status: 409 }
                );
            }
            updateData.name = name;
            updateData.slug = newSlug;
        }

        if (color !== undefined) {
            updateData.color = color;
        }

        if (icon !== undefined) {
            updateData.icon = icon;
        }

        if (isActive !== undefined) {
            updateData.isActive = isActive;
        }

        if (sharedWith !== undefined) {
            // Handle sharedWith updates through junction table
            // This would require additional logic to add/remove CategorySharedWith records
            // For now, we'll skip this as it requires more complex logic
        }

        // Update the category
        const updatedCategory = await db.category.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error: unknown) {
        console.error("Error updating category:", error);
        return new NextResponse("Failed to update category", { status: 500 });
    }
};
