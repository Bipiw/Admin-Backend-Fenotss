import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role } from "@/lib/constants"

export async function GET(req: NextRequest) {
    const { error } = await requireAuth([Role.FINANCE, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const members = await prisma.memberProfile.findMany({
            include: {
                user: { select: { email: true } },
                financials: {
                    where: { type: 'MONTHLY_CONTRIBUTION', status: 'PAID' },
                    orderBy: { date: 'desc' },
                    take: 1
                }
            }
        })

        const twoMonthsAgo = new Date()
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2)

        const defaulters = members.filter(m => {
            const lastPayment = m.financials[0]
            if (!lastPayment) return true // Never paid
            return new Date(lastPayment.date) < twoMonthsAgo
        }).map(m => ({
            id: m.id,
            firstName: m.firstName,
            lastName: m.lastName,
            email: m.user.email,
            phone: m.phone,
            lastPaymentDate: m.financials[0]?.date || null,
            monthsOverdue: m.financials[0]
                ? Math.floor((new Date().getTime() - new Date(m.financials[0].date).getTime()) / (1000 * 60 * 60 * 24 * 30))
                : "Never"
        }))

        return NextResponse.json(defaulters)
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch defaulters" }, { status: 500 })
    }
}
