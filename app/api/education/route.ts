import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role, AcademicStatus } from "@/lib/constants"
import { z } from "zod"
import { logAction } from "@/lib/audit"

const academicSchema = z.object({
    memberId: z.string(),
    year: z.number(),
    status: z.nativeEnum(AcademicStatus).optional(),
    remarks: z.string().optional()
})

// GET ACADEMIC RECORDS
export async function GET(req: NextRequest) {
    const { session, error } = await requireAuth([Role.EDUCATION, Role.SUPER_ADMIN, Role.MEMBER])
    if (error) return error

    try {
        const { searchParams } = new URL(req.url)
        const year = searchParams.get("year")

        const where: any = year ? { year: parseInt(year) } : {}

        // Allow Member to only see their own records
        if (session?.user.role === Role.MEMBER) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                include: { profile: true }
            })
            if (!user?.profile) return NextResponse.json([])
            where.memberId = user.profile.id
        }

        const records = await prisma.academicRecord.findMany({
            where,
            include: {
                member: { select: { firstName: true, lastName: true } }
            },
            orderBy: { year: 'asc' }
        })
        return NextResponse.json(records)
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 })
    }
}

// UPDATE/CREATE ENROLLMENT
export async function POST(req: NextRequest) {
    const { error, session } = await requireAuth([Role.EDUCATION])
    if (error) return error

    try {
        const body = await req.json()
        const validated = academicSchema.parse(body)

        const existing = await prisma.academicRecord.findFirst({
            where: { memberId: validated.memberId, year: validated.year }
        })

        let result;
        if (existing) {
            result = await prisma.academicRecord.update({
                where: { id: existing.id },
                data: validated
            })
        } else {
            result = await prisma.academicRecord.create({
                data: validated
            })
        }

        const action = existing ? "EDUCATION_UPDATE" : "EDUCATION_CREATE"
        await logAction(session!.user.id, action, `${existing ? 'Updated' : 'Created'} academic record for member ${validated.memberId} (Year: ${validated.year}, Status: ${validated.status || 'ENROLLED'})`, result.id)

        return NextResponse.json(result)
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: err.errors }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 })
    }
}
