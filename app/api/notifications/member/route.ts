import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role } from "@/lib/constants"
import { logAction } from "@/lib/audit"

// GET: Fetch notifications for current member
export async function GET(req: NextRequest) {
    const { session, error } = await requireAuth([Role.MEMBER, Role.MEMBERS_AFFAIRS, Role.SUPER_ADMIN])
    if (error) return error

    try {
        if (session?.user.role === Role.MEMBER) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                include: { profile: true },
            })
            if (!user?.profile) return NextResponse.json([])

            const notifications = await prisma.memberNotification.findMany({
                where: { memberId: user.profile.id },
                include: { sentBy: { select: { email: true } } },
                orderBy: { createdAt: "desc" },
            })

            // Mark as read
            await prisma.memberNotification.updateMany({
                where: { memberId: user.profile.id, isRead: false },
                data: { isRead: true },
            })

            return NextResponse.json(notifications)
        }

        // HR/Admin: view all
        const { searchParams } = new URL(req.url)
        const memberId = searchParams.get("memberId")
        const where: any = memberId ? { memberId } : {}

        const notifications = await prisma.memberNotification.findMany({
            where,
            include: {
                member: { select: { firstName: true, lastName: true } },
                sentBy: { select: { email: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        })
        return NextResponse.json(notifications)
    } catch {
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }
}

// POST: Send notification to member(s)
export async function POST(req: NextRequest) {
    const { session, error } = await requireAuth([Role.MEMBERS_AFFAIRS, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const { memberIds, title, content, type } = await req.json()

        if (!memberIds?.length || !title || !content)
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

        const notifications = await prisma.$transaction(
            memberIds.map((memberId: string) =>
                prisma.memberNotification.create({
                    data: { memberId, title, content, type: type || "INFO", sentById: session!.user.id },
                })
            )
        )

        await logAction(session!.user.id, "NOTIFICATION_SENT", `Sent "${title}" to ${memberIds.length} member(s)`)
        return NextResponse.json({ count: notifications.length, message: "Notifications sent" })
    } catch {
        return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 })
    }
}
