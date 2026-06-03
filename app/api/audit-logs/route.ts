import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role } from "@/lib/constants"

export async function GET(req: NextRequest) {
    const { error } = await requireAuth([Role.SUPER_ADMIN])
    if (error) return error

    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200)
        const skip = (page - 1) * limit
        const action = searchParams.get("action") || undefined

        const where = action ? { action } : {}

        const [logs, total] = await prisma.$transaction([
            prisma.auditLog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    user: {
                        select: { email: true, role: true, profile: { select: { firstName: true, lastName: true } } }
                    }
                }
            }),
            prisma.auditLog.count({ where })
        ])
        return NextResponse.json({ data: logs, total, page, limit, totalPages: Math.ceil(total / limit) })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
    }
}
