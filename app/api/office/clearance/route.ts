import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role } from "@/lib/constants"
import { logAction } from "@/lib/audit"

// POST: Issue clearance record (Office role)
export async function POST(req: NextRequest) {
    const { session, error } = await requireAuth([Role.OFFICE, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const { memberId, reason, notes } = await req.json()
        if (!memberId || !reason)
            return NextResponse.json({ error: "memberId and reason are required" }, { status: 400 })

        const record = await prisma.clearanceRecord.create({
            data: { memberId, reason, notes, issuedById: session!.user.id },
            include: {
                member: { 
                    include: { 
                        user: { select: { email: true } },
                        academics: { orderBy: { year: "desc" } },
                        financials: { orderBy: { date: "desc" } },
                        eligibility: true
                    } 
                },
                issuedBy: { select: { email: true } },
            },
        })

        await logAction(session!.user.id, "CLEARANCE_ISSUED", `Clearance issued for member ${memberId}`, record.id)
        return NextResponse.json(record)
    } catch (err) {
        console.error("Failed to issue clearance:", err)
        return NextResponse.json({ error: "Failed to issue clearance" }, { status: 500 })
    }
}

// GET: Fetch clearance records
export async function GET(req: NextRequest) {
    const { session, error } = await requireAuth([Role.OFFICE, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const { searchParams } = new URL(req.url)
        const memberId = searchParams.get("memberId")
        const where: any = memberId ? { memberId } : {}

        const records = await prisma.clearanceRecord.findMany({
            where,
            include: {
                member: { 
                    include: { 
                        user: { select: { email: true } },
                        academics: { orderBy: { year: "desc" } },
                        financials: { orderBy: { date: "desc" } },
                        eligibility: true
                    } 
                },
                issuedBy: { select: { email: true } },
            },
            orderBy: { issuedAt: "desc" },
        })
        return NextResponse.json(records)
    } catch (err) {
        console.error("Failed to fetch clearances:", err)
        return NextResponse.json({ error: "Failed to fetch clearances" }, { status: 500 })
    }
}

