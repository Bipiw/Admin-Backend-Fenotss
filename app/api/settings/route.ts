import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role } from "@/lib/constants"

export async function GET(req: NextRequest) {
    const { error } = await requireAuth([])
    if (error) return error

    try {
        const settings = await prisma.systemSetting.findMany()
        const settingsMap = settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value
            return acc
        }, {} as Record<string, string>)

        return NextResponse.json(settingsMap)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const { error } = await requireAuth([Role.SUPER_ADMIN])
    if (error) return error

    try {
        const body = await req.json()
        const updates = []

        for (const [key, value] of Object.entries(body)) {
            updates.push(prisma.systemSetting.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) }
            }))
        }

        await prisma.$transaction(updates)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 })
    }
}
