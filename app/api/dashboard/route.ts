import db from "@/lib/db";
import { NextResponse } from "next/server";
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

        // Fetch user
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Active Lists
        const activeLists = await db.list.findMany({
            where: { createdUserId: userId, status: "active" },
            select: {
                id: true,
                name: true,
                contributors: {
                    include: {
                        user: { select: { id: true, name: true } }
                    }
                },
                updatedAt: true,
                items: {
                    include: { category: true }
                }
            },
            take: 5
        });

        // Recent Activities (from comments and items)
        const recentActivities = await db.comment.findMany({
            where: {
                userId: userId
            },
            include: {
                item: { include: { category: true } },
                user: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" },
            take: 10
        });

        // Family Members
        const familyGroups = await db.familyGroupMember.findMany({
            where: { userId: userId },
            include: {
                group: {
                    include: {
                        members: {
                            include: { user: { select: { id: true, name: true, email: true } } }
                        }
                    }
                }
            }
        });

        const familyMembers = familyGroups.flatMap(fg => fg.group.members.map(m => m.user)).filter(u => u.id !== userId);

        // This Week Spendings (mock calculation from items)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const thisWeekItems = await db.item.findMany({
            where: {
                addedUserId: userId,
                createdAt: { gte: weekAgo },
                completed: true
            }
        });
        const thisWeekSpendings = thisWeekItems.reduce((sum, item) => sum + item.estimatedPrice, 0);

        // Avg Time for Trip (mock, as not in schema)
        const avgTripTime = 15; // minutes

        // Smart Suggestions (based on recent items)
        const recentItems = await db.item.findMany({
            where: { addedUserId: userId },
            orderBy: { createdAt: "desc" },
            take: 10,
            include: { category: true }
        });
        const suggestions = recentItems.slice(0, 4).map(item => ({
            id: item.id,
            item: item.name,
            reason: "Based on recent purchases",
            confidence: 85,
            category: item.category.name,
            lastBought: item.createdAt.toISOString(),
            avgPrice: item.estimatedPrice
        }));

        // Insights (mock)
        const insights = {
            savings: { value: 23.45, change: "+15.8%" },
            spendingTrend: { value: 487.2, change: "-15%" },
            tip: "Shop on Tuesdays for better deals"
        };

        const dashboardData = {
            user: user,
            stats: {
                thisWeekSpendings,
                avgTripTime,
                activeListsCount: activeLists.length
            },
            activeLists: activeLists.map(list => {
                const category = list.items.length > 0 ? list.items[0].category.name : "groceries";
                const priorityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3 } as const;
                const priority = list.items.reduce((max: string, item) => {
                    const currentOrder = priorityOrder[item.priority as keyof typeof priorityOrder];
                    const maxOrder = priorityOrder[max as keyof typeof priorityOrder];
                    return currentOrder > maxOrder ? item.priority : max;
                }, "LOW").toLowerCase();
                const sharedWith = list.contributors.map(c => c.user.name);
                return {
                    id: list.id,
                    category,
                    name: list.name,
                    items: list.items.length,
                    priority,
                    completed: list.items.filter(i => i.completed).length,
                    lastUpdated: list.updatedAt.toISOString().split('T')[0], // format as date
                    sharedWith
                };
            }),
            recentActivities: recentActivities.map(activity => ({
                id: activity.id,
                type: "comment",
                title: `Commented on ${activity.item.name}`,
                description: activity.content,
                timestamp: activity.createdAt.toISOString(),
                user: activity.user.name
            })),
            familyMembers: familyMembers.map(member => ({
                id: member.id,
                name: member.name,
                email: member.email,
                status: "online" // mock
            })),
            smartSuggestions: suggestions,
            insights
        };

        return NextResponse.json(dashboardData, { status: 200 });
    } catch (error) {
        console.error("Dashboard API error:", error);
        return new NextResponse("Failed to fetch dashboard data", { status: 500 });
    }
};
