import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role, FinancialType, FinancialStatus } from "@/lib/constants"
import { z } from "zod"
import { logAction } from "@/lib/audit"

const transactionSchema = z.object({
    memberId: z.string(),
    amount: z.number().positive(),
    type: z.nativeEnum(FinancialType),
    status: z.nativeEnum(FinancialStatus).optional(),
    description: z.string().optional(),
    receiptRef: z.string().optional(),
    verified: z.boolean().optional()
})

// GET/REPORT TRANSACTIONS
export async function GET(req: NextRequest) {
    const { session, error } = await requireAuth([Role.FINANCE, Role.MEMBER, Role.OFFICE, Role.MEMBERS_AFFAIRS, Role.SUPER_ADMIN])
    if (error) return error

    try {
        const { searchParams } = new URL(req.url)
        const status = searchParams.get("status")
        const memberIdParam = searchParams.get("memberId")

        const where: any = status ? { status } : {}

        // Allow Member to only see their own
        if (session?.user.role === Role.MEMBER) {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                include: { profile: true }
            })
            if (!user?.profile) return NextResponse.json([])
            where.memberId = user.profile.id
        } else if (memberIdParam) {
            where.memberId = memberIdParam
        }

        const records = await prisma.financialRecord.findMany({
            where,
            include: {
                member: { select: { firstName: true, lastName: true } },
                recordedBy: { select: { email: true } }
            },
            orderBy: { date: 'desc' },
            take: 100
        })

        return NextResponse.json(records)
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
    }
}

// RECORD TRANSACTION
export async function POST(req: NextRequest) {
    const { error, session } = await requireAuth([Role.FINANCE])
    if (error) return error

    try {
        const formData = await req.formData()

        const memberId = formData.get('memberId') as string
        const amount = parseFloat(formData.get('amount') as string)
        const type = formData.get('type') as any
        const description = formData.get('description') as string
        const receiptRef = formData.get('receiptRef') as string
        const file = formData.get('receipt') as File | null

        if (!memberId || !amount || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        let receiptUrl = null
        if (file) {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Ensure directory exists
            const uploadDir = path.join(process.cwd(), "public", "uploads")
            await mkdir(uploadDir, { recursive: true })

            const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`
            await writeFile(path.join(uploadDir, filename), buffer)
            receiptUrl = `/uploads/${filename}`
        }

        const record = await prisma.financialRecord.create({
            data: {
                memberId,
                amount,
                type,
                description,
                receiptRef,
                receiptUrl,
                status: "PAID",
                verified: true,
                recordedById: session!.user.id
            }
        })

        await logAction(session!.user.id, "FINANCE_RECORD", `Recorded ${type} of ${amount} for member ${memberId}`, record.id)

        return NextResponse.json(record)
    } catch (err) {
        console.error("Payment error:", err)
        return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 })
    }
}
