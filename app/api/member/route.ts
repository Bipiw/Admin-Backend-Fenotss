import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const memberProfile = await prisma.memberProfile.findUnique({
            where: { userId: session.user.id },
            include: {
                attendance: {
                    orderBy: { date: 'desc' },
                    take: 5
                },
                financials: {
                    orderBy: { date: 'desc' },
                    take: 5
                },
                academics: {
                    orderBy: { year: 'desc' },
                    take: 1
                }
            }
        })

        if (!memberProfile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 })
        }

        return NextResponse.json(memberProfile)
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }
}
