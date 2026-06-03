import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { requireAuth } from "@/lib/api-auth"
import { Role } from "@/lib/constants"
import { z } from "zod"
import bcrypt from "bcryptjs"

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.nativeEnum(Role),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().optional(),
    department: z.string().optional()
})

export async function GET(req: NextRequest) {
    const { error } = await requireAuth([Role.SUPER_ADMIN, Role.MEMBERS_AFFAIRS, Role.FINANCE, Role.EDUCATION])
    if (error) return error

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                profile: {
                    select: { id: true, firstName: true, lastName: true, department: true }
                }
            }
        })
        return NextResponse.json(users)
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const { error } = await requireAuth([Role.SUPER_ADMIN, Role.MEMBERS_AFFAIRS])
    if (error) return error

    try {
        const body = await req.json()

        // --- EMAIL STANDARDIZATION LOGIC ---
        let email = body.email.toLowerCase().trim()

        // 1. Remove existing @fenot.com if typed manually to clean up
        email = email.replace(/@fenot\.com$/, '')

        // 2. If student (MEMBER), append registration year if not already present
        if (body.role === Role.MEMBER) {
            const currentYear = new Date().getFullYear().toString()
            if (!email.endsWith(currentYear)) {
                email = `${email}${currentYear}`
            }
        }

        // 3. Force @fenot.com domain
        const finalEmail = `${email}@fenot.com`

        const validated = userSchema.parse({ ...body, email: finalEmail })
        // -----------------------------------

        const hashedPassword = await bcrypt.hash(validated.password, 10)

        const user = await prisma.user.create({
            data: {
                email: validated.email,
                password: hashedPassword,
                role: validated.role,
                profile: {
                    create: {
                        firstName: validated.firstName,
                        lastName: validated.lastName,
                        phone: validated.phone,
                        department: validated.department || "OTHER"
                    }
                }
            }
        })

        return NextResponse.json({ id: user.id, email: user.email, role: user.role })
    } catch (err: any) {
        console.error("User creation error:", err)

        // Handle unique constraint (P2002) for email
        if (err.code === 'P2002' && err.meta?.target?.includes('email')) {
            return NextResponse.json({ error: "Thie Email Address is already taken. Please try a different username." }, { status: 409 })
        }

        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid data", details: err.errors }, { status: 400 })
        }

        return NextResponse.json({ error: err.message || "Failed to create user" }, { status: 500 })
    }
}
