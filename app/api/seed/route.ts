import { NextResponse } from "next/server";
import db from "@/lib/db";
import { hashPassword } from "@/lib/server/bcrypt";
import { UserRole, CategoryType, PriorityType } from "@/generated/prisma";
import { slugifyKebab } from "@/lib/slugify";

export const GET = async () => {
    try {
        // Clear existing data
        await db.comment.deleteMany({})
        await db.item.deleteMany({})
        await db.categorySharedWith.deleteMany({})
        await db.listContributor.deleteMany({})
        await db.familyGroupMember.deleteMany({})
        await db.familyGroup.deleteMany({})
        await db.userSettings.deleteMany({})
        await db.securityEvent.deleteMany({})
        await db.session.deleteMany({})
        await db.otp.deleteMany({})
        await db.user.deleteMany({})
        await db.category.deleteMany({})
        await db.list.deleteMany({})
        console.log("🧹 Cleared all existing data");

        const users = [
            {
                username: "nagarjun",
                name: "Nagarjun A",
                email: "nagarjun@gmail.com",
                password: "Nagarjun@12345",
                role: UserRole.ADMIN,
                mobile: "9988776655",
                countryCode: "+91",
                isVerified: true,
                isActive: true,
                householdSize: 4,
            },
            {
                username: "admin_user",
                name: "Admin User",
                email: "admin@example.com",
                password: "Admin@1234",
                role: UserRole.ADMIN,
                mobile: "9876543210",
                countryCode: "+91",
                isVerified: true,
                isActive: true,
                householdSize: 4,
            },
            {
                username: "regular_user",
                name: "Regular User",
                email: "user@example.com",
                password: "User@1234",
                role: UserRole.USER,
                mobile: "9123456789",
                countryCode: "+91",
                isVerified: true,
                isActive: true,
                householdSize: 4,
            },
        ];

        // Create users one by one to get IDs
        const createdUsers = [];
        for (const user of users) {
            const hashedPassword = await hashPassword(user.password);
            const created = await db.user.create({ data: { ...user, password: hashedPassword } });
            createdUsers.push(created);
        }

        console.log("🌱 Seeded users successfully");

        // Seed family groups
        const familyGroups = [
            {
                name: "Smith Family",
                createdBy: createdUsers[0].id,
            },
        ];
        const createdFamilyGroups = [];
        for (const group of familyGroups) {
            const created = await db.familyGroup.create({ data: group });
            createdFamilyGroups.push(created);
        }
        console.log("🌱 Seeded family groups successfully");

        // Seed family group members
        const familyGroupMembers = [
            {
                groupId: createdFamilyGroups[0].id,
                userId: createdUsers[1].id,
            },
            {
                groupId: createdFamilyGroups[0].id,
                userId: createdUsers[2].id,
            },
        ];
        await db.familyGroupMember.createMany({ data: familyGroupMembers });
        console.log("🌱 Seeded family group members successfully");

        // Seed categories
        const categories = [
            {
                name: "Fruits",
                slug: "fruits",
                icon: "Apple",
                color: "#A3E635",
                type: CategoryType.SYSTEM,
                createdBy: createdUsers[0].id,
            },
            {
                name: "Vegetables",
                slug: "vegetables",
                icon: "Carrot",
                color: "#F97316",
                type: CategoryType.SYSTEM,
                createdBy: createdUsers[0].id,
            },
            {
                name: "Dairy",
                slug: "dairy",
                icon: "Milk",
                color: "#45B7D1",
                type: CategoryType.SYSTEM,
                createdBy: createdUsers[0].id,
            },
            {
                name: "Bakery",
                slug: "bakery",
                icon: "Cake",
                color: "#F59E0B",
                type: CategoryType.SYSTEM,
                createdBy: createdUsers[0].id,
            },
            {
                name: "Spices",
                slug: "spices",
                icon: "MortarPestle",
                color: "#65A30D",
                type: CategoryType.SYSTEM,
                createdBy: createdUsers[0].id,
            },
        ];

        const createdCategories = [];
        for (const category of categories) {
            const created = await db.category.create({ data: category });
            createdCategories.push(created);
        }
        console.log("🌱 Seeded categories successfully");

        // Seed lists
        const lists = [
            {
                name: "Weekly Groceries",
                description: "Regular weekly shopping list",
                createdUserId: createdUsers[0].id,
            },
            {
                name: "Party Supplies",
                description: "Items needed for the birthday party",
                createdUserId: createdUsers[0].id,
            },
            {
                name: "Monthly Essentials",
                description: "Essential items for the month",
                createdUserId: createdUsers[0].id,
            },
        ];

        const createdLists = [];
        for (const list of lists) {
            const slug = slugifyKebab(list.name)
            const created = await db.list.create({ data: { ...list, slug } });
            createdLists.push(created);
        }
        console.log("🌱 Seeded lists successfully");


        // Seed user settings
        const userSettings = [
            {
                userId: createdUsers[0].id,
                notifications: {
                    email: true,
                    sms: false,
                    push: true,
                    marketing: false,
                    productUpdates: true,
                    securityAlerts: true,
                },
                privacy: {
                    profileVisibility: "private",
                    searchVisibility: false,
                    dataSharing: false,
                    adPersonalization: false,
                    twoFactorAuth: true,
                },
                appearance: {
                    theme: "system",
                    fontSize: "medium",
                    compactMode: false,
                    animations: true,
                    highContrastMode: false,
                    colorBlindFriendly: false,
                    language: "en",
                    currency: "INR",
                    measuringUnits: "metric",
                    dateFormat: "DD/MM/YYYY",
                },
                accessibility: {
                    screenReader: false,
                    textToSpeech: false,
                    motionReduction: false,
                },
                timezone: "UTC",
            },
            {
                userId: createdUsers[1].id,
                notifications: {
                    email: true,
                    sms: true,
                    push: false,
                    marketing: true,
                    productUpdates: false,
                    securityAlerts: true,
                },
                privacy: {
                    profileVisibility: "friends",
                    searchVisibility: true,
                    dataSharing: true,
                    adPersonalization: true,
                    twoFactorAuth: false,
                },
                appearance: {
                    theme: "dark",
                    fontSize: "large",
                    compactMode: true,
                    animations: false,
                    highContrastMode: true,
                    colorBlindFriendly: true,
                    language: "en",
                    currency: "USD",
                    measuringUnits: "imperial",
                    dateFormat: "MM/DD/YYYY",
                },
                accessibility: {
                    screenReader: true,
                    textToSpeech: true,
                    motionReduction: true,
                },
                timezone: "America/New_York",
            },
        ];
        await db.userSettings.createMany({ data: userSettings });
        console.log("🌱 Seeded user settings successfully");


        // Seed list contributors
        const listContributors = [
            {
                listId: createdLists[0].id,
                userId: createdUsers[1].id,
            },
            {
                listId: createdLists[1].id,
                userId: createdUsers[2].id,
            },
        ];
        await db.listContributor.createMany({ data: listContributors });
        console.log("🌱 Seeded list contributors successfully");

        // Seed category shared with
        const categorySharedWith = [
            {
                categoryId: createdCategories[0].id,
                userId: createdUsers[1].id,
            },
            {
                categoryId: createdCategories[1].id,
                userId: createdUsers[2].id,
            },
        ];
        await db.categorySharedWith.createMany({ data: categorySharedWith });
        console.log("🌱 Seeded category shared with successfully");

        // Seed items
        const items = [
            {
                name: "Apples",
                description: "Red delicious apples",
                quantity: 5,
                unit: "kg",
                priority: PriorityType.MEDIUM,
                completed: false,
                note: "Organic preferred",
                listId: createdLists[0].id,
                categoryId: createdCategories[0].id,
                brand: "Generic",
                estimatedPrice: 10.0,
                addedUserId: createdUsers[0].id,
            },
            {
                name: "Milk",
                description: "Whole milk",
                quantity: 2,
                unit: "liters",
                priority: PriorityType.HIGH,
                completed: true,
                note: "Lactose free",
                listId: createdLists[0].id,
                categoryId: createdCategories[2].id,
                brand: "Brand A",
                estimatedPrice: 5.0,
                addedUserId: createdUsers[0].id,
            },
            {
                name: "Bread",
                description: "Whole wheat bread",
                quantity: 1,
                unit: "loaf",
                priority: PriorityType.LOW,
                completed: false,
                note: "Gluten free",
                listId: createdLists[1].id,
                categoryId: createdCategories[3].id,
                brand: "Brand B",
                estimatedPrice: 3.0,
                addedUserId: createdUsers[0].id,
            },
        ];
        const createdItems = [];
        for (const item of items) {
            const created = await db.item.create({ data: item });
            createdItems.push(created);
        }
        console.log("🌱 Seeded items successfully");

        // Seed comments
        const comments = [
            {
                content: "Great quality apples!",
                itemId: createdItems[0].id,
                userId: createdUsers[1].id,
            },
            {
                content: "Milk was fresh.",
                itemId: createdItems[1].id,
                userId: createdUsers[2].id,
            },
        ];
        await db.comment.createMany({ data: comments });
        console.log("🌱 Seeded comments successfully");

        return NextResponse.json(
            {
                message: "Data seeded successfully",
                users: createdUsers.length,
                categories: createdCategories.length,
                lists: createdLists.length,
                userSettings: userSettings.length,
                familyGroups: createdFamilyGroups.length,
                familyGroupMembers: familyGroupMembers.length,
                listContributors: listContributors.length,
                categorySharedWith: categorySharedWith.length,
                items: createdItems.length,
                comments: comments.length,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("Error seeding data:", error);
        return new NextResponse("Failed to seed data", { status: 500 });
    }
};
