import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { currentPassword, newPassword } = await req.json()

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password)
        if (!isValid) {
            return NextResponse.json({ error: "Current password is incorrect" }, { status: 403 })
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Password change error:", error)
        return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
    }
}
