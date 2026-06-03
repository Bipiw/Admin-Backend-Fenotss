import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, CalendarCheck, Megaphone, ShieldCheck } from "lucide-react"
import { Overview } from "@/components/dashboard/overview"
import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display"
import { AnnouncementManager } from "@/components/dashboard/admin/announcement-manager"
import { StatCard } from "@/components/dashboard/stat-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions)

    // ====== Counts ======
    const totalMembers = await prisma.user.count({ where: { role: "MEMBER" } })
    const totalUsers = await prisma.user.count()
    const activeAnnouncements = await prisma.announcement.count({
        where: {
            isActive: true,
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
    })

    // ====== Revenue (current month + previous month for trend) ======
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [currentRev, prevRev] = await Promise.all([
        prisma.financialRecord.aggregate({
            _sum: { amount: true },
            where: {
                type: "MONTHLY_CONTRIBUTION",
                status: "PAID",
                date: { gte: startOfMonth },
            },
        }),
        prisma.financialRecord.aggregate({
            _sum: { amount: true },
            where: {
                type: "MONTHLY_CONTRIBUTION",
                status: "PAID",
                date: { gte: startOfPrevMonth, lt: startOfMonth },
            },
        }),
    ])

    const monthlyRevenue = currentRev._sum.amount ? Number(currentRev._sum.amount) : 0
    const prevMonthlyRevenue = prevRev._sum.amount ? Number(prevRev._sum.amount) : 0
    const revenueTrend =
        prevMonthlyRevenue > 0
            ? Math.round(((monthlyRevenue - prevMonthlyRevenue) / prevMonthlyRevenue) * 100)
            : monthlyRevenue > 0
                ? 100
                : 0

    // ====== Active members ======
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentAttendance = await prisma.attendance.groupBy({
        by: ["memberId"],
        where: { date: { gte: thirtyDaysAgo }, status: "PRESENT" },
    })
    const activeMembers = recentAttendance.length

    // ====== Chart data ======
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    const attendanceData = await prisma.attendance.findMany({
        where: { date: { gte: sixMonthsAgo }, status: "PRESENT" },
        select: { date: true },
    })

    const monthlyData = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (5 - i))
        const monthName = d.toLocaleString("default", { month: "short" })
        const count = attendanceData.filter(
            (a) => a.date.getMonth() === d.getMonth() && a.date.getFullYear() === d.getFullYear()
        ).length
        return { name: monthName, total: count }
    })

    const activeRate =
        totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Welcome back{session?.user?.email ? `, ${session.user.email.split("@")[0]}` : ""}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Here's a real-time snapshot of your organization.
                    </p>
                </div>
                <EthiopianDateDisplay />
            </div>

            {/* KPI Stat Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Members"
                    value={totalMembers}
                    description={`${totalUsers} total users in system`}
                    icon={Users}
                    accent="navy"
                />
                <StatCard
                    title="Monthly Revenue"
                    value={`${monthlyRevenue.toLocaleString()} ETB`}
                    description="Contributions this month"
                    icon={DollarSign}
                    accent="green"
                    trend={{ value: revenueTrend, label: "vs last month" }}
                />
                <StatCard
                    title="Active Members"
                    value={activeMembers}
                    description={`${activeRate}% engagement (30d)`}
                    icon={CalendarCheck}
                    accent="gold"
                />
                <StatCard
                    title="Announcements"
                    value={activeAnnouncements}
                    description="Currently visible to users"
                    icon={Megaphone}
                    accent="navy"
                />
            </div>

            {/* Main Grid: Chart + Sidebar */}
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-semibold">Attendance Trends</CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Present check-ins over the last 6 months
                        </p>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={monthlyData} />
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <QuickActions />
                    <Card className="border-emerald-500/30 bg-emerald-500/5">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-emerald-500/15 p-2">
                                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">System Healthy</p>
                                    <p className="text-xs text-muted-foreground">
                                        All services operational
                                    </p>
                                </div>
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Second Grid: Announcements + Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
                <AnnouncementManager />
                <RecentActivity />
            </div>
        </div>
    )
}
