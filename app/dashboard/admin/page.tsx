import prisma from "@/lib/prisma"
import { Users, DollarSign, CalendarCheck, Megaphone, BarChart3, Activity } from "lucide-react"
import { Overview } from "@/components/dashboard/overview"
import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display"
import { AnnouncementManager } from "@/components/dashboard/admin/announcement-manager"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { cookies } from "next/headers"
import { getTranslation } from "@/lib/translations"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions)
    const cookieStore = cookies()
    const lang = cookieStore.get("language")?.value || "en"
    const t = (key: string) => getTranslation(lang, key)

    const totalMembers = await prisma.user.count({ where: { role: "MEMBER" } })
    const totalUsers = await prisma.user.count()
    const activeAnnouncements = await prisma.announcement.count({
        where: { isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
    })

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [currentRev, prevRev] = await Promise.all([
        prisma.financialRecord.aggregate({ _sum: { amount: true }, where: { type: "MONTHLY_CONTRIBUTION", status: "PAID", date: { gte: startOfMonth } } }),
        prisma.financialRecord.aggregate({ _sum: { amount: true }, where: { type: "MONTHLY_CONTRIBUTION", status: "PAID", date: { gte: startOfPrevMonth, lt: startOfMonth } } }),
    ])

    const monthlyRevenue = currentRev._sum.amount ? Number(currentRev._sum.amount) : 0
    const prevMonthlyRevenue = prevRev._sum.amount ? Number(prevRev._sum.amount) : 0
    const revenueTrend = prevMonthlyRevenue > 0 ? Math.round(((monthlyRevenue - prevMonthlyRevenue) / prevMonthlyRevenue) * 100) : monthlyRevenue > 0 ? 100 : 0

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentAttendance = await prisma.attendance.groupBy({ by: ["memberId"], where: { date: { gte: thirtyDaysAgo }, status: "PRESENT" } })
    const activeMembers = recentAttendance.length
    const activeRate = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)

    const attendanceData = await prisma.attendance.findMany({ where: { date: { gte: sixMonthsAgo }, status: "PRESENT" }, select: { date: true } })
    const monthlyData = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(); d.setMonth(d.getMonth() - (5 - i))
        const monthName = d.toLocaleString("default", { month: "short" })
        const count = attendanceData.filter(a => a.date.getMonth() === d.getMonth() && a.date.getFullYear() === d.getFullYear()).length
        return { name: monthName, total: count }
    })

    return (
        <div>
            {/* Page Heading */}
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon"><BarChart3 size={22} /></span>
                    <div>
                        <p className="eyebrow mb-1">{t("sidebar.overview")}</p>
                        <h1 className="h3 mb-1">
                            {t("admin.dash.welcome")}{session?.user?.email ? `, ${session.user.email.split("@")[0]}` : ""}
                        </h1>
                        <p className="text-muted mb-0"><EthiopianDateDisplay /></p>
                    </div>
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="metrics-row">
                <article className="metric-card metric-primary">
                    <div className="metric-top">
                        <span className="metric-label">{t("admin.dash.totalMembers")}</span>
                        <span className="metric-icon"><Users size={18} /></span>
                    </div>
                    <div className="metric-value">{totalMembers.toLocaleString()}</div>
                    <div className="metric-meta">
                        <span>{totalUsers} {t("admin.dash.totalUsersDetail")}</span>
                    </div>
                </article>

                <article className="metric-card metric-success">
                    <div className="metric-top">
                        <span className="metric-label">{t("admin.dash.monthlyRevenue")}</span>
                        <span className="metric-icon"><DollarSign size={18} /></span>
                    </div>
                    <div className="metric-value">{monthlyRevenue.toLocaleString()}</div>
                    <div className="metric-meta">
                        <span className={revenueTrend >= 0 ? "text-success" : "text-danger"}>
                            {revenueTrend >= 0 ? "+" : ""}{revenueTrend}%
                        </span>
                        <span>{lang === "am" ? "ካለፈው ወር" : "vs last month"}</span>
                    </div>
                </article>

                <article className="metric-card metric-warning">
                    <div className="metric-top">
                        <span className="metric-label">{t("admin.dash.activeMembers")}</span>
                        <span className="metric-icon"><CalendarCheck size={18} /></span>
                    </div>
                    <div className="metric-value">{activeMembers.toLocaleString()}</div>
                    <div className="metric-meta">
                        <span className="text-success">{activeRate}%</span>
                        <span>{t("admin.dash.activeRateDetail")}</span>
                    </div>
                </article>

                <article className="metric-card metric-danger">
                    <div className="metric-top">
                        <span className="metric-label">{t("admin.dash.announcements")}</span>
                        <span className="metric-icon"><Megaphone size={18} /></span>
                    </div>
                    <div className="metric-value">{activeAnnouncements}</div>
                    <div className="metric-meta">
                        <span>{t("admin.dash.announcementsDetail")}</span>
                    </div>
                </article>
            </div>

            {/* Charts row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1rem", marginBottom: "1rem" }}>
                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h2 className="section-title">
                                <span className="title-icon"><BarChart3 size={16} /></span>
                                {t("admin.dash.attendanceTrends")}
                            </h2>
                            <p className="text-muted mb-0">{t("admin.dash.attendanceDetail")}</p>
                        </div>
                    </div>
                    <Overview data={monthlyData} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className="panel">
                        <div className="panel-header" style={{ marginBottom: "0.75rem" }}>
                            <h2 className="section-title">
                                <span className="title-icon"><Activity size={16} /></span>
                                {t("admin.dash.systemHealthy")}
                            </h2>
                        </div>
                        <div className="activity-list">
                            <div className="activity-item">
                                <span className="activity-dot bg-success" />
                                <div>
                                    <p className="mb-1 fw-semibold">{t("admin.dash.allOperational")}</p>
                                    <p className="text-muted small mb-0">
                                        {lang === "am" ? "ሁሉም አገልግሎቶች ንቁ ናቸው" : "All services active"}
                                    </p>
                                </div>
                            </div>
                            <div className="activity-item">
                                <span className="activity-dot bg-primary" />
                                <div>
                                    <p className="mb-1 fw-semibold">{lang === "am" ? "ዳታቤዝ" : "Database"}</p>
                                    <p className="text-muted small mb-0">{lang === "am" ? "ተያይዟል" : "Connected"}</p>
                                </div>
                            </div>
                            <div className="activity-item">
                                <span className="activity-dot bg-success" />
                                <div>
                                    <p className="mb-1 fw-semibold">{lang === "am" ? "ማረጋገጫ" : "Authentication"}</p>
                                    <p className="text-muted small mb-0">{lang === "am" ? "ደህንነቱ የተጠበቀ" : "Secured"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="panel" style={{ padding: "0.85rem 1rem" }}>
                        <QuickActions />
                    </div>
                </div>
            </div>

            {/* Announcements + Activity */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="panel"><AnnouncementManager /></div>
                <div className="panel"><RecentActivity /></div>
            </div>
        </div>
    )
}
