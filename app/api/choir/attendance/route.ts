import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role, AttendanceStatus } from "@/lib/constants"
import { logAction } from "@/lib/audit"
import { z } from "zod"

const choirAttendanceSchema = z.object({
    date: z.string(),
    records: z.array(z.object({
        memberId: z.string(),
        status: z.nativeEnum(AttendanceStatus),
    })),
})

// GET: Fetch choir attendance
export async function GET(req: NextRequest) {
    const { session, error } = await requireAuth([Role.CHOIR, Role.SUPER_ADMIN, Role.MEMBERS_AFFAIRS, Role.OFFICE, Role.MEMBER])
    if (error) return error

    try {
        const { searchParams } = new URL(req.url)
        const date = searchParams.get("date")
        const memberId = searchParams.get("memberId")

        const where: any = { type: "CHOIR_PRACTICE" }
        if (date) {
            const start = new Date(date); start.setHours(0, 0, 0, 0)
            const end = new Date(date); end.setHours(23, 59, 59, 999)
            where.date = { gte: start, lte: end }
        }

        if (session?.user.role === Role.MEMBER) {
            const user = await prisma.user.findUnique({ where: { id: session.user.id }, include: { profile: true } })
            if (!user?.profile) return NextResponse.json([])
            where.memberId = user.profile.id
        } else if (memberId) {
            where.memberId = memberId
        }

        const records = await prisma.attendance.findMany({
            where,
            include: { member: { select: { firstName: true, lastName: true, department: true } } },
            orderBy: { date: "desc" },
        })
        return NextResponse.json(records)
    } catch {
        return NextResponse.json({ error: "Failed to fetch choir attendance" }, { status: 500 })
    }
}

// POST: Log choir attendance
export async function POST(req: NextRequest) {
    const { session, error } = await requireAuth([Role.CHOIR, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const body = await req.json()
        const validated = choirAttendanceSchema.parse(body)

        const result = await prisma.$transaction(
            validated.records.map(r =>
                prisma.attendance.create({
                    data: {
                        date: new Date(validated.date),
                        type: "CHOIR_PRACTICE",
                        memberId: r.memberId,
                        status: r.status,
                    },
                })
            )
        )

        await logAction(session!.user.id, "CHOIR_ATTENDANCE", `Logged ${result.length} choir attendance records for ${validated.date}`)
        return NextResponse.json({ count: result.length, message: "Choir attendance logged" })
    } catch (err) {
        if (err instanceof z.ZodError)
            return NextResponse.json({ error: "Invalid data", details: err.errors }, { status: 400 })
        return NextResponse.json({ error: "Failed to log choir attendance" }, { status: 500 })
    }
}
