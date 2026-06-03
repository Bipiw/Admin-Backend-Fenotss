import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Role } from "@/lib/constants"
import { requireAuth } from "@/lib/api-auth"
import { z } from "zod"
import { logAction } from "@/lib/audit"

const announcementSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().min(1, "Content is required"),
    expiresAt: z.string().datetime().optional().nullable()
})

export async function GET(req: NextRequest) {
    const { error } = await requireAuth([])
    if (error) return error

    try {
        const announcements = await prisma.announcement.findMany({
            where: {
                isActive: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            },
            orderBy: { createdAt: 'desc' },
            include: { author: { select: { profile: { select: { firstName: true, lastName: true } } } } }
        })
        return NextResponse.json(announcements)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const { session, error } = await requireAuth([Role.SUPER_ADMIN])
    if (error) return error

    try {
        const body = await req.json()
        const validated = announcementSchema.parse(body)
        const announcement = await prisma.announcement.create({
            data: {
                title: validated.title,
                content: validated.content,
                expiresAt: validated.expiresAt ? new Date(validated.expiresAt) : null,
                authorId: session.user.id
            }
        })
        await logAction(session.user.id, "ANNOUNCEMENT_CREATE", `Created announcement: "${validated.title}"`, announcement.id)

        return NextResponse.json(announcement)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 })
    }
}
