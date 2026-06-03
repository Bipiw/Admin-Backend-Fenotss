import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role, AttendanceType, AttendanceStatus } from "@/lib/constants"
import { z } from "zod"
import { logAction } from "@/lib/audit"

const attendanceSchema = z.object({
    date: z.string().datetime(),
    type: z.nativeEnum(AttendanceType),
    records: z.array(z.object({
        memberId: z.string(),
        status: z.nativeEnum(AttendanceStatus)
    }))
})

// VIEW ATTENDANCE
export async function GET(req: NextRequest) {
    const { session, error } = await requireAuth([Role.MEMBERS_AFFAIRS, Role.SUPER_ADMIN, Role.MEMBER])
    if (error) return error

    try {
        const { searchParams } = new URL(req.url)
        const date = searchParams.get("date")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200)
        const skip = (page - 1) * limit

        // Build query
        const where: any = {}
        if (date) {
            const start = new Date(date)
            start.setHours(0, 0, 0, 0)
            const end = new Date(date)
            end.setHours(23, 59, 59, 999)
            where.date = { gte: start, lte: end }
        }

        // Allow Member to only see their own
        if (session?.user.role === Role.MEMBER) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                include: { profile: true }
            })
            if (!user?.profile) return NextResponse.json([])
            where.memberId = user.profile.id
        }

        const [records, total] = await prisma.$transaction([
            prisma.attendance.findMany({
                where,
                include: {
                    member: {
                        select: { firstName: true, lastName: true }
                    }
                },
                orderBy: { date: 'desc' },
                skip,
                take: limit
            }),
            prisma.attendance.count({ where })
        ])
        return NextResponse.json({ data: records, total, page, limit, totalPages: Math.ceil(total / limit) })
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 })
    }
}

// LOG BULK ATTENDANCE
export async function POST(req: NextRequest) {
    const { error, session } = await requireAuth([Role.MEMBERS_AFFAIRS])
    if (error) return error

    try {
        const body = await req.json()
        const validated = attendanceSchema.parse(body)

        // Using transaction for bulk insert
        const result = await prisma.$transaction(
            validated.records.map(record =>
                prisma.attendance.create({
                    data: {
                        date: new Date(validated.date),
                        type: validated.type,
                        memberId: record.memberId,
                        status: record.status
                    }
                })
            )
        )

        await logAction(session!.user.id, "ATTENDANCE_LOG", `Logged ${result.length} attendance records for ${validated.type} on ${validated.date}`)

        return NextResponse.json({ count: result.length, message: "Attendance logged successfully" })
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: err.errors }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to log attendance" }, { status: 500 })
    }
}
