import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Role } from "@/lib/constants"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
    }

    const role = session.user.role

    switch (role) {
        case Role.SUPER_ADMIN:
            redirect("/dashboard/admin")
        case Role.MEMBERS_AFFAIRS:
            redirect("/dashboard/members-affairs")
        case Role.FINANCE:
            redirect("/dashboard/finance")
        case Role.EDUCATION:
            redirect("/dashboard/education")
        case Role.CHOIR:
            redirect("/dashboard/choir")
        case Role.OFFICE:
            redirect("/dashboard/office")
        case Role.MEMBER:
            redirect("/dashboard/member")
        default:
            return <div className="p-8">Unknown Role: {role}. Please contact support.</div>
    }
}
