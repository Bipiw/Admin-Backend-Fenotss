import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role } from "@/lib/constants"

export async function GET(req: NextRequest) {
    const { error } = await requireAuth([Role.MEMBER, Role.SUPER_ADMIN, Role.EDUCATION])
    if (error) return error

    try {
        const notifications = await prisma.notification.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10
        })

        const materials = await prisma.studyMaterial.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20
        })

        return NextResponse.json({ notifications, materials })
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
    }
}

// Admin/Education can POST (Simplified for now, just to have the endpoint ready)
export async function POST(req: NextRequest) {
    const { error } = await requireAuth([Role.SUPER_ADMIN, Role.EDUCATION])
    if (error) return error

    try {
        const body = await req.json()
        if (body.type === 'NOTIFICATION') {
            await prisma.notification.create({
                data: {
                    title: body.title,
                    content: body.content,
                    type: body.category || 'INFO'
                }
            })
        } else {
            await prisma.studyMaterial.create({
                data: {
                    title: body.title,
                    url: body.url,
                    type: body.format || 'LINK', // PDF, VIDEO, LINK
                    description: body.description
                }
            })
        }
        return NextResponse.json({ success: true })
    } catch (err) {
        return NextResponse.json({ error: "Failed to create resource" }, { status: 500 })
    }
}
