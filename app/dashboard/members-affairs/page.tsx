import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ClipboardCheck, UserPlus } from "lucide-react"

import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display"
import { MemberExportButtons } from "@/components/dashboard/member-export-buttons"
import { ChangePasswordCard } from "@/components/dashboard/change-password-card"

export const dynamic = 'force-dynamic'

export default async function MembersAffairsDashboard() {
    const totalMembers = await prisma.user.count({ where: { role: 'MEMBER' } })
    const unassignedMembers = await prisma.memberProfile.count({
        where: {
            department: 'OTHER',
            user: {
                role: 'MEMBER'
            }
        }
    })


    // Attendance today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const attendanceToday = await prisma.attendance.count({
        where: {
            date: { gte: today },
            status: 'PRESENT'
        }
    })

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Operation Hub</h2>
                    <p className="text-muted-foreground text-sm">Manage members and daily operations.</p>
                </div>
                <div className="flex items-center gap-4">
                    <MemberExportButtons />
                    <EthiopianDateDisplay />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMembers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance Today</CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{attendanceToday}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unassignedMembers}</div>
                        <p className="text-xs text-muted-foreground">Members needing department assignment</p>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-md">
                <ChangePasswordCard />
            </div>
        </div>
    )
}
