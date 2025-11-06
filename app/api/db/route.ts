import db from "@/lib/db"
import { NextResponse } from "next/server"

export const GET = async () => {
    try {
        // Get all model names from the Prisma client that have a findMany method
        const models = Object.keys(db).filter(key => {
            const model = db[key as keyof typeof db]
            return typeof model === 'object' && model !== null && 'findMany' in model
        })

        const data: Record<string, unknown> = {}

        // Fetch data for each model
        for (const modelName of models) {
            try {
                const records = await ((db as unknown) as Record<string, { findMany: () => Promise<unknown[]> }>)[modelName].findMany()
                data[modelName] = {
                    _count: records.length,
                    [modelName]: records
                }
            } catch (modelError) {
                console.log(`Failed to fetch ${modelName}:`, modelError)
                // Optionally, you can skip or handle errors per model
            }
        }

        return NextResponse.json(
            {
                message: "Database fetched successfully",
                data
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed to fetch db:", error)
        return new NextResponse("Failed to fetch db", { status: 500 })
    }
}
