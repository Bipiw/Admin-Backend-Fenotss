import prisma from "@/lib/prisma"
import { Music, Users, ClipboardCheck, TrendingUp } from "lucide-react"
import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display"
import { cookies } from "next/headers"
import { getTranslation } from "@/lib/translations"

export const dynamic = 'force-dynamic'

export default async function ChoirDashboard() {
    const cookieStore = cookies()
    const lang = cookieStore.get("language")?.value || "en"
    const t = (key: string) => getTranslation(lang, key)

    const totalChoirMembers = await prisma.memberProfile.count({ where: { department: "CHOIR" } })

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [presentThisMonth, totalThisMonth] = await Promise.all([
        prisma.attendance.count({ where: { type: "CHOIR_PRACTICE", status: "PRESENT", date: { gte: startOfMonth } } }),
        prisma.attendance.count({ where: { type: "CHOIR_PRACTICE", date: { gte: startOfMonth } } }),
    ])

    const attendanceRate = totalThisMonth > 0 ? Math.round((presentThisMonth / totalThisMonth) * 100) : 0

    const recentSessions = await prisma.attendance.groupBy({
        by: ["date"],
        where: { type: "CHOIR_PRACTICE" },
        _count: { _all: true },
        orderBy: { date: "desc" },
        take: 5,
    })

    return (
        <div>
            {/* Page Heading */}
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <Music size={22} />
                    </span>
                    <div>
                        <p className="eyebrow mb-1">{t("role.choir")}</p>
                        <h1 className="h3 mb-1">{lang === "am" ? "መዝሙር ክፍል" : "Choir Department"}</h1>
                        <p className="text-muted mb-0"><EthiopianDateDisplay /></p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="metrics-row">
                <article className="metric-card metric-primary">
                    <div className="metric-top">
                        <span className="metric-label">{lang === "am" ? "ጠቅላላ የመዘምራን አባላት" : "Total Choir Members"}</span>
                        <span className="metric-icon"><Users size={18} /></span>
                    </div>
                    <div className="metric-value">{totalChoirMembers.toLocaleString()}</div>
                    <div className="metric-meta">
                        <span>{lang === "am" ? "ንቁ አባላት" : "Active choir members"}</span>
                    </div>
                </article>

                <article className="metric-card metric-success">
                    <div className="metric-top">
                        <span className="metric-label">{lang === "am" ? "የዚህ ወር ተገኝነት" : "This Month's Attendance"}</span>
                        <span className="metric-icon"><ClipboardCheck size={18} /></span>
                    </div>
                    <div className="metric-value">{presentThisMonth.toLocaleString()}</div>
                    <div className="metric-meta">
                        <span>{lang === "am" ? "ከ" : "out of"} {totalThisMonth} {lang === "am" ? "ሪኮርዶች" : "records"}</span>
                    </div>
                </article>

                <article className={`metric-card ${attendanceRate >= 70 ? "metric-success" : attendanceRate >= 50 ? "metric-warning" : "metric-danger"}`}>
                    <div className="metric-top">
                        <span className="metric-label">{lang === "am" ? "የተገኝነት ምጣኔ" : "Attendance Rate"}</span>
                        <span className="metric-icon"><TrendingUp size={18} /></span>
                    </div>
                    <div className="metric-value">{attendanceRate}%</div>
                    <div className="metric-meta">
                        <span className={attendanceRate >= 70 ? "text-success" : "text-danger"}>
                            {lang === "am" ? "የዚህ ወር" : "This month"}
                        </span>
                    </div>
                </article>
            </div>

            {/* Recent Sessions */}
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h2 className="section-title">
                            <span className="title-icon"><Music size={16} /></span>
                            {lang === "am" ? "የቅርብ ጊዜ ልምምዶች" : "Recent Choir Sessions"}
                        </h2>
                        <p className="text-muted mb-0">{lang === "am" ? "ያለፉ ስብሰባዎች" : "Past practice sessions"}</p>
                    </div>
                </div>
                {recentSessions.length === 0 ? (
                    <p style={{ color: "var(--admin-muted)", fontSize: "0.9rem", textAlign: "center", padding: "2rem" }}>
                        {lang === "am" ? "ምንም ሪኮርድ አልተገኘም" : "No sessions recorded yet."}
                    </p>
                ) : (
                    <div className="activity-list">
                        {recentSessions.map((session, i) => (
                            <div key={i} className="activity-item">
                                <span className="activity-dot bg-primary" />
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                    <p className="mb-1 fw-semibold">
                                        {new Date(session.date).toLocaleDateString(lang === "am" ? 'am-ET' : 'en-US', {
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </p>
                                    <span className="badge badge-primary">
                                        {session._count._all} {lang === "am" ? "ሪኮርዶች" : "records"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
