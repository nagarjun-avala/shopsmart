import { NextResponse } from "next/server";
import db from "@/lib/db";
import { slugifyKebab } from "@/lib/slugify";

export const GET = async () => {
  try {
    const categories = await db.category.findMany({
      include: {
        categoryItems: true,
        sharedWith: {
          include: {
            user: { select: { id: true } }
          }
        }
      },
    })

    // Transform the data for frontend consumption
    const formatted = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      color: cat.color || "#999", // fallback if missing
      icon: cat.icon || "Folder",
      totalItems: cat.categoryItems?.length || 0,
      recentItems: cat.categoryItems?.slice(0, 3).map((i) => i.name) || [],
      sharedWith: cat.sharedWith?.map(s => s.userId) || [],
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt,
    }));

    const summary = {
      totalCategories: formatted.length,
      totalItems: formatted.reduce((sum, cat) => sum + cat.totalItems, 0),
      mostUsedCategory:
        formatted.length > 0
          ? formatted.reduce((a, b) => (a.totalItems > b.totalItems ? a : b))
            ?.name
          : [],
      avgPerCategory:
        formatted.length > 0
          ? Math.round(
            formatted.reduce((sum, cat) => sum + cat.totalItems, 0) /
            formatted.length
          )
          : 0,
    };

    return NextResponse.json(
      { summary, categories: formatted },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return new NextResponse("Failed to fetch categories", { status: 500 });
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();

    const { name, color, icon, createdBy } = body;

    if (!name) {
      return new NextResponse(JSON.stringify({ message: "Name is required" }), {
        status: 400,
      });
    }

    const slug = slugifyKebab(name);

    // Check if slug already exists
    const existingCategory = await db.category.findUnique({ where: { slug } });
    if (existingCategory) {
      return new NextResponse(JSON.stringify({ message: "Category with this name already exists" }), {
        status: 409,
      });
    }

    const newCategory = await db.category.create({
      data: {
        name,
        slug,
        icon,
        color,
        createdBy,
      },
    });

    return new NextResponse(JSON.stringify(newCategory), { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating category:", error);
    return new NextResponse("Failed to create category", { status: 500 });
  }
};