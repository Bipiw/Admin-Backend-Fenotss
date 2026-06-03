import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role } from "@/lib/constants"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== Role.SUPER_ADMIN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const users = await prisma.user.findMany({ include: { profile: true } })
        const financials = await prisma.financialRecord.findMany()
        const attendance = await prisma.attendance.findMany()
        const members = await prisma.memberProfile.findMany()

        const backup = {
            timestamp: new Date().toISOString(),
            data: {
                users,
                members,
                financials,
                attendance,
            }
        }

        return new NextResponse(JSON.stringify(backup, null, 2), {
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="backup-${new Date().toISOString().split('T')[0]}.json"`
            }
        })
    } catch (error) {
        return NextResponse.json({ error: "Failed to create backup" }, { status: 500 })
    }
}
