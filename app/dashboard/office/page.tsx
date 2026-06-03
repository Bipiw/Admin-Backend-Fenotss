import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Music, GraduationCap, UserCircle, Building2 } from "lucide-react"
import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const dynamic = 'force-dynamic'

export default async function OfficeDashboard() {
    const [totalMembers, totalUsers] = await Promise.all([
        prisma.user.count({ where: { role: "MEMBER" } }),
        prisma.user.count(),
    ])

    const byDepartment = await prisma.memberProfile.groupBy({
        by: ["department"],
        _count: { _all: true },
        where: { user: { role: "MEMBER" } },
    })

    const recentMembers = await prisma.memberProfile.findMany({
        where: { user: { role: "MEMBER" } },
        include: { user: { select: { createdAt: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
    })

    const recentClearances = await prisma.clearanceRecord.count()

    const deptIcon: Record<string, any> = {
        CHOIR: Music,
        SUNDAY_SCHOOL: GraduationCap,
        DEACONS: UserCircle,
        OTHER: Users,
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">ጽ/ቤት — Office Overview</h2>
                    <p className="text-muted-foreground text-sm">Global member metrics and administration.</p>
                </div>
                <EthiopianDateDisplay />
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMembers}</div>
                        <p className="text-xs text-muted-foreground">{totalUsers} total system users</p>
                    </CardContent>
                </Card>
                {byDepartment.map(dept => {
                    const Icon = deptIcon[dept.department] || Users
                    return (
                        <Card key={dept.department}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{dept.department}</CardTitle>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dept._count._all}</div>
                                <p className="text-xs text-muted-foreground">Members</p>
                            </CardContent>
                        </Card>
                    )
                })}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Clearances Issued</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recentClearances}</div>
                        <p className="text-xs text-muted-foreground">Total leaving certificates</p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 flex-wrap">
                <Link href="/dashboard/office/members">
                    <Button variant="outline" className="gap-2"><Users className="h-4 w-4" /> Search Members</Button>
                </Link>
                <Link href="/dashboard/office/clearance">
                    <Button variant="outline" className="gap-2"><Building2 className="h-4 w-4" /> Issue Clearance</Button>
                </Link>
            </div>

            {/* Recent Members */}
            <Card>
                <CardHeader>
                    <CardTitle>Recently Registered Members</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {recentMembers.map(m => (
                            <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                <div>
                                    <p className="text-sm font-medium">{m.firstName} {m.lastName}</p>
                                    <p className="text-xs text-muted-foreground">{m.user.email} · {m.department}</p>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(m.user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                        {recentMembers.length === 0 && (
                            <p className="text-muted-foreground text-sm">No members yet.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
