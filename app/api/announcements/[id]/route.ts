import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role } from "@/lib/constants"
import { logAction } from "@/lib/audit"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== Role.SUPER_ADMIN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        await prisma.announcement.delete({ where: { id: params.id } })
        await logAction(session.user.id, "ANNOUNCEMENT_DELETE", `Deleted announcement ${params.id}`, params.id)
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 })
    }
}
