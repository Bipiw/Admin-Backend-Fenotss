import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role, Department } from "@/lib/constants"
import { z } from "zod"
import { logAction } from "@/lib/audit"

const assignSchema = z.object({
    userId: z.string(),
    department: z.nativeEnum(Department)
})

export async function POST(req: NextRequest) {
    const { error, session } = await requireAuth([Role.MEMBERS_AFFAIRS, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const body = await req.json()
        const validated = assignSchema.parse(body)

        const updated = await prisma.memberProfile.update({
            where: { userId: validated.userId },
            data: { department: validated.department }
        })

        await logAction(session!.user.id, "DEPT_ASSIGN", `Assigned user ${validated.userId} to department ${validated.department}`, validated.userId)

        return NextResponse.json(updated)
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: err.errors }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to assign department" }, { status: 500 })
    }
}
