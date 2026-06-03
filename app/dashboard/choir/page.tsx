import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Users, ClipboardCheck, TrendingUp } from "lucide-react"
import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display"

export const dynamic = 'force-dynamic'

export default async function ChoirDashboard() {
    const totalChoirMembers = await prisma.memberProfile.count({
        where: { department: "CHOIR" }
    })

    // Attendance this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [presentThisMonth, totalThisMonth] = await Promise.all([
        prisma.attendance.count({
            where: { type: "CHOIR_PRACTICE", status: "PRESENT", date: { gte: startOfMonth } }
        }),
        prisma.attendance.count({
            where: { type: "CHOIR_PRACTICE", date: { gte: startOfMonth } }
        }),
    ])

    const attendanceRate = totalThisMonth > 0
        ? Math.round((presentThisMonth / totalThisMonth) * 100)
        : 0

    // Recent sessions
    const recentSessions = await prisma.attendance.groupBy({
        by: ["date"],
        where: { type: "CHOIR_PRACTICE" },
        _count: { _all: true },
        orderBy: { date: "desc" },
        take: 5,
    })

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">መዝሙር ክፍል</h2>
                    <p className="text-muted-foreground text-sm">Choir Department Overview</p>
                </div>
                <EthiopianDateDisplay />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Choir Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalChoirMembers}</div>
                        <p className="text-xs text-muted-foreground">Active choir members</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">This Month's Attendance</CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{presentThisMonth}</div>
                        <p className="text-xs text-muted-foreground">Present check-ins</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${attendanceRate >= 70 ? 'text-green-600' : attendanceRate >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {attendanceRate}%
                        </div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Music className="h-5 w-5" />
                        Recent Choir Sessions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {recentSessions.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No sessions recorded yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {recentSessions.map((session, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <span className="text-sm font-medium">
                                        {new Date(session.date).toLocaleDateString('en-ET', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {session._count._all} records
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
