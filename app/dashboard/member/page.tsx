import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Calendar, CreditCard, ShieldCheck, Activity, User, GraduationCap, BookOpen, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cookies } from "next/headers"
import { getTranslation } from "@/lib/translations"

export const dynamic = 'force-dynamic'

export default async function MemberDashboard() {
    const session = await getServerSession(authOptions)
    if (!session) return null

    const cookieStore = cookies()
    const lang = cookieStore.get("language")?.value || "en"
    const t = (key: string) => getTranslation(lang, key)

    const userProfile = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            profile: {
                include: {
                    eligibility: true,
                    academics: true,
                }
            }
        }
    })

    if (!userProfile?.profile) {
        return (
            <div className="panel" style={{ textAlign: "center", padding: "3rem" }}>
                <h1 className="h3 mb-2">Welcome, {userProfile?.email}</h1>
                <p style={{ color: "var(--admin-danger)", marginTop: "0.5rem" }}>
                    Profile not found. Please contact administration to register your member profile.
                </p>
            </div>
        )
    }

    const profile = userProfile.profile

    const [recentPayments, recentAttendance] = await Promise.all([
        prisma.financialRecord.findMany({
            where: { memberId: profile.id },
            orderBy: { date: 'desc' },
            take: 4
        }),
        prisma.attendance.findMany({
            where: { memberId: profile.id },
            orderBy: { date: 'desc' },
            take: 6
        })
    ])

    const eligibility = profile.eligibility
    const isEligible = eligibility?.status === "ELIGIBLE"
    const initials = profile.firstName ? profile.firstName.substring(0, 2).toUpperCase() : "??"
    const presentCount = recentAttendance.filter(a => a.status === "PRESENT").length
    const totalCount = recentAttendance.length
    const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100

    return (
        <div>
            {/* Page Heading */}
            <div className="page-heading">
                <div className="page-heading-copy">
                    <div className="profile-avatar" style={{ width: 52, height: 52, fontSize: "1.1rem" }}>
                        {initials}
                    </div>
                    <div>
                        <p className="eyebrow mb-1">{t("member.dash.welcomeBack")}</p>
                        <h1 className="h3 mb-1">{profile.firstName} {profile.lastName}</h1>
                        <p className="text-muted mb-0">{t("member.dash.department")}: <strong>{profile.department || "General"}</strong></p>
                    </div>
                </div>
                <div className="text-muted font-semibold small">
                    {new Date().toLocaleDateString(lang === "am" ? 'am-ET' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="metrics-row">
                <article className={`metric-card ${isEligible ? "metric-success" : "metric-warning"}`}>
                    <div className="metric-top">
                        <span className="metric-label">{t("member.dash.serviceStatus")}</span>
                        <span className="metric-icon"><ShieldCheck size={18} /></span>
                    </div>
                    <div className="metric-value" style={{ fontSize: "1.6rem" }}>
                        {isEligible ? t("member.dash.eligible") : t("member.dash.pending")}
                    </div>
                    <div className="metric-meta">
                        <span className={isEligible ? "text-success" : "text-danger"}>
                            {t("member.dash.statusDetail")}
                        </span>
                    </div>
                </article>

                <article className="metric-card metric-primary">
                    <div className="metric-top">
                        <span className="metric-label">{t("member.dash.latestPayment")}</span>
                        <span className="metric-icon"><CreditCard size={18} /></span>
                    </div>
                    <div className="metric-value" style={{ fontSize: "1.6rem" }}>
                        {recentPayments[0] ? `${Number(recentPayments[0].amount).toLocaleString()} ETB` : "0 ETB"}
                    </div>
                    <div className="metric-meta">
                        {recentPayments[0]
                            ? <span>{t("member.dash.paidOn")} {new Date(recentPayments[0].date).toLocaleDateString(lang === "am" ? 'am-ET' : 'en-US')}</span>
                            : <span>{t("member.dash.noPayments")}</span>
                        }
                    </div>
                </article>

                <article className="metric-card metric-primary">
                    <div className="metric-top">
                        <span className="metric-label">{t("member.dash.attendanceRate")}</span>
                        <span className="metric-icon"><Calendar size={18} /></span>
                    </div>
                    <div className="metric-value">{attendanceRate}%</div>
                    <div className="metric-meta">
                        <span>{lang === "am" ? `${totalCount} መዝገቦች` : `${totalCount} records`}</span>
                    </div>
                </article>

                <article className="metric-card metric-success">
                    <div className="metric-top">
                        <span className="metric-label">{t("member.dash.engagement")}</span>
                        <span className="metric-icon"><Activity size={18} /></span>
                    </div>
                    <div className="metric-value" style={{ fontSize: "1.6rem" }}>
                        {t("member.dash.active")}
                    </div>
                    <div className="metric-meta">
                        <span className="text-success">{t("member.dash.operational")}</span>
                    </div>
                </article>
            </div>

            {/* Main 2-col Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1rem" }}>
                {/* Left column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Quick Actions Panel */}
                    <div className="panel">
                        <div className="panel-header" style={{ marginBottom: "0.75rem" }}>
                            <h2 className="section-title">{t("member.dash.quickActions")}</h2>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
                            {[
                                { href: "/dashboard/member/finance", icon: CreditCard, label: t("member.dash.payDues"), color: "#0f766e" },
                                { href: "/dashboard/member/attendance", icon: Calendar, label: t("member.dash.attendance"), color: "var(--admin-primary)" },
                                { href: "/dashboard/member/grades", icon: GraduationCap, label: t("member.dash.grades"), color: "#6366f1" },
                                { href: "/dashboard/member/profile", icon: User, label: t("member.dash.profileDetails"), color: "var(--admin-muted)" },
                            ].map(({ href, icon: Icon, label, color }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    style={{ textDecoration: "none" }}
                                >
                                    <div className="quick-action-card">
                                        <div style={{ width: 44, height: 44, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", color, marginBottom: "0.6rem" }}>
                                            <Icon size={20} />
                                        </div>
                                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--admin-text)" }}>{label}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Attendance Grid */}
                    <div className="panel">
                        <div className="panel-header">
                            <div>
                                <h2 className="section-title">
                                    <span className="title-icon"><Calendar size={16} /></span>
                                    {t("member.dash.recentAttendance")}
                                </h2>
                                <p className="text-muted mb-0">{lang === "am" ? "የቅርብ ጊዜ ተገኝነትዎ" : "Your recent check-in record"}</p>
                            </div>
                            <Link href="/dashboard/member/attendance" className="btn btn-sm btn-outline">
                                {t("member.dash.seeFullLog")} <ChevronRight size={14} />
                            </Link>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.5rem" }}>
                            {recentAttendance.length > 0 ? recentAttendance.map((record) => {
                                const d = new Date(record.date)
                                const isPresent = record.status === "PRESENT"
                                return (
                                    <div
                                        key={record.id}
                                        style={{
                                            padding: "0.75rem 0.5rem",
                                            borderRadius: 8,
                                            textAlign: "center",
                                            background: isPresent ? "var(--admin-primary)" : "var(--admin-surface-soft)",
                                            border: `1px solid ${isPresent ? "var(--admin-primary)" : "var(--admin-border)"}`,
                                            color: isPresent ? "#fff" : "var(--admin-text)",
                                        }}
                                    >
                                        <div style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", opacity: 0.7 }}>
                                            {d.toLocaleString(lang === "am" ? 'am-ET' : 'en-US', { weekday: 'short' })}
                                        </div>
                                        <div style={{ fontSize: "1.4rem", fontWeight: 950, lineHeight: 1.1 }}>{d.getDate()}</div>
                                        <div style={{ fontSize: "0.68rem", opacity: 0.7 }}>{d.toLocaleString(lang === "am" ? 'am-ET' : 'en-US', { month: 'short' })}</div>
                                        <div style={{ marginTop: "0.35rem", fontSize: "0.7rem", fontWeight: 700, color: isPresent ? "#86efac" : "var(--admin-danger)" }}>
                                            {isPresent ? t("member.dash.present") : t("member.dash.absent")}
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div style={{ gridColumn: "1/-1", padding: "2rem", textAlign: "center", color: "var(--admin-muted)", fontSize: "0.9rem" }}>
                                    {t("member.dash.noAttendance")}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Payments */}
                    <div className="panel">
                        <div className="panel-header">
                            <div>
                                <h2 className="section-title">
                                    <span className="title-icon"><CreditCard size={16} /></span>
                                    {t("member.dash.paymentsHistory")}
                                </h2>
                            </div>
                            <Link href="/dashboard/member/finance" className="btn btn-sm btn-outline">
                                {t("member.dash.viewAll")}
                            </Link>
                        </div>
                        <div className="activity-list">
                            {recentPayments.length > 0 ? recentPayments.map((payment) => (
                                <div key={payment.id} className="activity-item">
                                    <span className="activity-dot bg-success" />
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minWidth: 0, width: "100%" }}>
                                        <div style={{ minWidth: 0 }}>
                                            <p className="mb-1 fw-semibold" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.9rem" }}>
                                                {payment.type === "MONTHLY_CONTRIBUTION" ? t("member.dash.monthlyContribution") : payment.type.replace('_', ' ')}
                                            </p>
                                            <p className="text-muted small mb-0">{new Date(payment.date).toLocaleDateString(lang === "am" ? 'am-ET' : 'en-US')}</p>
                                        </div>
                                        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "0.5rem" }}>
                                            <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--admin-text)" }}>{Number(payment.amount).toLocaleString()} ETB</span>
                                            <span className="badge badge-success" style={{ display: "block", marginTop: "0.2rem", fontSize: "0.7rem" }}>
                                                {lang === "am" ? "የተከፈለ" : "Paid"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--admin-muted)", fontSize: "0.9rem" }}>
                                    {t("member.dash.noTransactions")}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="panel" style={{ background: "var(--admin-primary)", color: "#fff", border: "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                            <div style={{ width: 38, height: 38, borderRadius: 8, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <BookOpen size={18} />
                            </div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: "0.95rem", margin: 0 }}>{t("member.dash.resourcesHelp")}</p>
                                <p style={{ fontSize: "0.8rem", opacity: 0.7, margin: 0 }}>{t("member.dash.accessPortal")}</p>
                            </div>
                        </div>
                        <p style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: "0.85rem", lineHeight: 1.5 }}>
                            {t("member.dash.resourcesDesc")}
                        </p>
                        <Link
                            href="/dashboard/member/resources"
                            className="btn btn-sm"
                            style={{ background: "#fff", color: "var(--admin-primary)", border: "none", width: "100%", justifyContent: "center" }}
                        >
                            {t("member.dash.openLibrary")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
