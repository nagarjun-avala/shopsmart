import { NextResponse } from "next/server"

export const GET = async () => {
    try {
        return NextResponse.json(
            {
                message: "Welcome to Shopsmart Api",
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("API Error", error)
        return new NextResponse("API Error", { status: 500 })
    }
}
