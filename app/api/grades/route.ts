import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role } from "@/lib/constants"
import { logAction } from "@/lib/audit"
import { z } from "zod"

const gradeSchema = z.object({
    memberId: z.string(),
    year: z.number().int().min(2000).max(2100),
    semester: z.string().optional(),
    subjectName: z.string().min(1),
    examScore: z.number().min(0),
    totalScore: z.number().min(1),
    gradeLabel: z.string().optional(),
    status: z.string().optional(),
    remarks: z.string().optional(),
})

// GET: Fetch grades
export async function GET(req: NextRequest) {
    const { session, error } = await requireAuth([Role.EDUCATION, Role.SUPER_ADMIN, Role.MEMBER, Role.MEMBERS_AFFAIRS, Role.OFFICE])
    if (error) return error

    try {
        const { searchParams } = new URL(req.url)
        const memberId = searchParams.get("memberId")
        const year = searchParams.get("year")

        let where: any = {}

        if (session?.user.role === Role.MEMBER) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                include: { profile: true },
            })
            if (!user?.profile) return NextResponse.json([])
            where.memberId = user.profile.id
        } else {
            if (memberId) where.memberId = memberId
            if (year) where.year = parseInt(year)
        }

        const grades = await prisma.academicRecord.findMany({
            where,
            include: {
                member: { select: { firstName: true, lastName: true } },
                recordedBy: { select: { email: true } },
            },
            orderBy: [{ year: "desc" }, { createdAt: "desc" }],
        })
        return NextResponse.json(grades)
    } catch {
        return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 })
    }
}

// POST: Create grade entry
export async function POST(req: NextRequest) {
    const { session, error } = await requireAuth([Role.EDUCATION, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const body = await req.json()
        const validated = gradeSchema.parse(body)

        const grade = await prisma.academicRecord.create({
            data: {
                memberId: validated.memberId,
                year: validated.year,
                semester: validated.semester,
                subjectName: validated.subjectName,
                examScore: validated.examScore,
                totalScore: validated.totalScore,
                gradeLabel: validated.gradeLabel,
                status: validated.status || "ENROLLED",
                remarks: validated.remarks,
                recordedById: session!.user.id,
            },
        })

        await logAction(session!.user.id, "GRADE_RECORD", `Recorded grade for ${validated.subjectName} for member ${validated.memberId}`, grade.id)
        return NextResponse.json(grade)
    } catch (err) {
        if (err instanceof z.ZodError)
            return NextResponse.json({ error: "Invalid data", details: err.errors }, { status: 400 })
        return NextResponse.json({ error: "Failed to record grade" }, { status: 500 })
    }
}

// PATCH: Update grade
export async function PATCH(req: NextRequest) {
    const { session, error } = await requireAuth([Role.EDUCATION, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const { id, ...data } = await req.json()
        if (!id) return NextResponse.json({ error: "Missing grade id" }, { status: 400 })

        const grade = await prisma.academicRecord.update({
            where: { id },
            data: { ...data, recordedById: session!.user.id },
        })

        await logAction(session!.user.id, "GRADE_UPDATE", `Updated grade ${id}`, id)
        return NextResponse.json(grade)
    } catch {
        return NextResponse.json({ error: "Failed to update grade" }, { status: 500 })
    }
}

// DELETE: Delete grade
export async function DELETE(req: NextRequest) {
    const { session, error } = await requireAuth([Role.EDUCATION, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get("id")
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

        await prisma.academicRecord.delete({ where: { id } })
        await logAction(session!.user.id, "GRADE_DELETE", `Deleted grade ${id}`, id)
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: "Failed to delete grade" }, { status: 500 })
    }
}
