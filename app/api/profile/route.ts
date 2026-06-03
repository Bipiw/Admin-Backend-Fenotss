import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { z } from "zod"

const updateProfileSchema = z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
})

export async function GET(req: NextRequest) {
    const { session, error } = await requireAuth([]) // Empty array allows any authenticated user
    if (error) return error

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { profile: true }
        })

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        return NextResponse.json({
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.profile?.firstName || "",
            lastName: user.profile?.lastName || "",
            phone: user.profile?.phone || "",
            address: user.profile?.address || "",
            department: user.profile?.department || "OTHER"
        })
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest) {
    const { session, error } = await requireAuth([])
    if (error) return error

    try {
        const body = await req.json()
        const validated = updateProfileSchema.parse(body)

        // Ensure profile exists, or create it if missing (though it should exist from seed/registration)
        const updated = await prisma.memberProfile.upsert({
            where: { userId: session.user.id },
            create: {
                userId: session.user.id,
                firstName: validated.firstName,
                lastName: validated.lastName,
                phone: validated.phone,
                address: validated.address,
                department: "OTHER" // Default if creating new
            },
            update: {
                firstName: validated.firstName,
                lastName: validated.lastName,
                phone: validated.phone,
                address: validated.address
            }
        })

        return NextResponse.json(updated)
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: err.errors }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
