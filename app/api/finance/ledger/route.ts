import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role } from "@/lib/constants"

// GET: Bulk ledger data — members × months payment status
export async function GET(req: NextRequest) {
    const { session, error } = await requireAuth([Role.FINANCE, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const { searchParams } = new URL(req.url)
        const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString())

        const members = await prisma.memberProfile.findMany({
            where: { user: { role: "MEMBER" } },
            select: { id: true, firstName: true, lastName: true, department: true },
            orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
        })

        const startOfYear = new Date(year, 0, 1)
        const endOfYear = new Date(year, 11, 31, 23, 59, 59)

        const payments = await prisma.financialRecord.findMany({
            where: {
                type: "MONTHLY_CONTRIBUTION",
                date: { gte: startOfYear, lte: endOfYear },
            },
            select: { memberId: true, status: true, date: true, id: true },
        })

        // Build ledger: member → month → payment status
        const ledger = members.map(m => {
            const months = Array.from({ length: 12 }, (_, i) => {
                const monthPayments = payments.filter(
                    p => p.memberId === m.id && new Date(p.date).getMonth() === i
                )
                const paid = monthPayments.find(p => p.status === "PAID")
                return {
                    month: i,
                    status: paid ? "PAID" : monthPayments.length > 0 ? monthPayments[0].status : "UNPAID",
                    recordId: paid?.id || monthPayments[0]?.id || null,
                }
            })
            return { member: m, months }
        })

        return NextResponse.json({ ledger, year })
    } catch {
        return NextResponse.json({ error: "Failed to fetch ledger" }, { status: 500 })
    }
}

// POST: Mark month payment for a member
export async function POST(req: NextRequest) {
    const { session, error } = await requireAuth([Role.FINANCE, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const { memberId, month, year, status } = await req.json()
        if (!memberId || month === undefined || !year || !status)
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

        const date = new Date(year, month, 15) // mid-month date

        // Check existing record for this member+month
        const existing = await prisma.financialRecord.findFirst({
            where: {
                memberId,
                type: "MONTHLY_CONTRIBUTION",
                date: { gte: new Date(year, month, 1), lte: new Date(year, month, 31) },
            },
        })

        let record
        if (existing) {
            record = await prisma.financialRecord.update({
                where: { id: existing.id },
                data: { status, verified: status === "PAID", recordedById: session!.user.id },
            })
        } else {
            record = await prisma.financialRecord.create({
                data: {
                    memberId,
                    amount: 200, // default contribution amount
                    type: "MONTHLY_CONTRIBUTION",
                    status,
                    date,
                    verified: status === "PAID",
                    recordedById: session!.user.id,
                },
            })
        }

        return NextResponse.json(record)
    } catch {
        return NextResponse.json({ error: "Failed to update ledger" }, { status: 500 })
    }
}
