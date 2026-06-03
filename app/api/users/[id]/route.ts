import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role } from "@/lib/constants"
import { logAction } from "@/lib/audit"
import bcrypt from "bcryptjs"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== Role.SUPER_ADMIN && session.user.role !== Role.MEMBERS_AFFAIRS)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const body = await req.json()
        // Check permissions vs target user
        const targetUser = await prisma.user.findUnique({ where: { id: params.id }, include: { profile: true } })
        if (!targetUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

        if (session.user.role === Role.MEMBERS_AFFAIRS && targetUser.role !== Role.MEMBER) {
            return NextResponse.json({ error: "Forbidden: Can only edit Members" }, { status: 403 })
        }

        const updateData: any = {}
        if (body.role && session.user.role === Role.SUPER_ADMIN) updateData.role = body.role
        if (body.password) updateData.password = await bcrypt.hash(body.password, 10)

        const profileUpdates: any = {}
        if (body.firstName) profileUpdates.firstName = body.firstName
        if (body.lastName) profileUpdates.lastName = body.lastName
        if (body.phone) profileUpdates.phone = body.phone
        if (body.department) profileUpdates.department = body.department

        const user = await prisma.user.update({
            where: { id: params.id },
            data: {
                ...updateData,
                profile: {
                    upsert: {
                        create: {
                            firstName: body.firstName || targetUser.profile?.firstName || "",
                            lastName: body.lastName || targetUser.profile?.lastName || "",
                            department: body.department || "OTHER",
                            phone: body.phone || ""
                        },
                        update: profileUpdates
                    }
                }
            }
        })

        await logAction(session.user.id, "USER_UPDATE", `Updated user ${user.email} (Role: ${body.role || 'Unchanged'}, Pwd: ${body.password ? 'Changed' : 'Unchanged'})`, user.id)

        return NextResponse.json({ success: true, user })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== Role.SUPER_ADMIN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    try {
        const user = await prisma.user.delete({ where: { id: params.id } })

        await logAction(session.user.id, "USER_DELETE", `Deleted user ${user.email}`, user.id)

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }
}
