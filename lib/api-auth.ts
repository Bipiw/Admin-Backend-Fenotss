import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role } from "@/lib/constants"
import { NextResponse } from "next/server"

export async function requireAuth(allowedRoles: string[]) {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        console.log("Auth failed: No session")
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null }
    }

    console.log(`Auth check: User=${session.user.email}, Role=${session.user.role}, Allowed=${allowedRoles}`)

    // If allowedRoles is empty, allow all authenticated users
    if (allowedRoles.length > 0 && session.user.role !== Role.SUPER_ADMIN && !allowedRoles.includes(session.user.role)) {
        console.log("Auth failed: Forbidden")
        return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), session: null }
    }

    return { error: null, session }
}
