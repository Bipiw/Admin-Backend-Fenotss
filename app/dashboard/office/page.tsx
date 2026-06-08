import React from "react"
import prisma from "@/lib/prisma"
import { Users, Music, GraduationCap, UserCircle, Building2 } from "lucide-react"
import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display"
import Link from "next/link"
import { cookies } from "next/headers"
import { getTranslation } from "@/lib/translations"

export const dynamic = 'force-dynamic'

export default async function OfficeDashboard() {
    const cookieStore = cookies()
    const lang = cookieStore.get("language")?.value || "en"
    const t = (key: string) => getTranslation(lang, key)

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

    const deptIcon: Record<string, React.ComponentType<{ size?: number | string }>> = {
        CHOIR: Music,
        SUNDAY_SCHOOL: GraduationCap,
        DEACONS: UserCircle,
        OTHER: Users,
    }

    return (
        <div>
            {/* Page Heading */}
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <Building2 size={22} />
                    </span>
                    <div>
                        <p className="eyebrow mb-1">{t("role.office")}</p>
                        <h1 className="h3 mb-1">{lang === "am" ? "ጽ/ቤት — የቢሮ አጠቃላይ እይታ" : "Office Overview"}</h1>
                        <p className="text-muted mb-0">{lang === "am" ? "አጠቃላይ አባላትን እና አስተዳደርን ያስተዳድሩ" : "Global member metrics and administration"}</p>
                    </div>
                </div>
                <div className="heading-actions">
                    <EthiopianDateDisplay />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="metrics-row">
                <article className="metric-card metric-primary">
                    <div className="metric-top">
                        <span className="metric-label">{lang === "am" ? "ጠቅላላ አባላት" : "Total Members"}</span>
                        <span className="metric-icon"><Users size={18} /></span>
                    </div>
                    <div className="metric-value">{totalMembers.toLocaleString()}</div>
                    <div className="metric-meta">
                        <span>{totalUsers} {lang === "am" ? "ጠቅላላ ተጠቃሚዎች" : "total system users"}</span>
                    </div>
                </article>

                {byDepartment.map(dept => {
                    const Icon = deptIcon[dept.department] || Users
                    return (
                        <article key={dept.department} className="metric-card metric-indigo">
                            <div className="metric-top">
                                <span className="metric-label">{dept.department.replace('_', ' ')}</span>
                                <span className="metric-icon"><Icon size={18} /></span>
                            </div>
                            <div className="metric-value">{dept._count._all}</div>
                            <div className="metric-meta">
                                <span>{lang === "am" ? "አባላት" : "Members"}</span>
                            </div>
                        </article>
                    )
                })}

                <article className="metric-card metric-warning">
                    <div className="metric-top">
                        <span className="metric-label">{lang === "am" ? "የተሰጡ ፍቃዶች" : "Clearances Issued"}</span>
                        <span className="metric-icon"><Building2 size={18} /></span>
                    </div>
                    <div className="metric-value">{recentClearances}</div>
                    <div className="metric-meta">
                        <span>{lang === "am" ? "ጠቅላላ ሰርቲፊኬቶች" : "Total leaving certificates"}</span>
                    </div>
                </article>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                <Link href="/dashboard/office/members" className="btn btn-outline">
                    <Users size={16} /> {lang === "am" ? "አባላትን ፈልግ" : "Search Members"}
                </Link>
                <Link href="/dashboard/office/clearance" className="btn btn-primary">
                    <Building2 size={16} /> {lang === "am" ? "ፍቃድ አስተላልፍ" : "Issue Clearance"}
                </Link>
            </div>

            {/* Recent Members Table */}
            <div className="panel">
                <div className="panel-header">
                    <div>
                        <h2 className="section-title">
                            <span className="title-icon"><Users size={16} /></span>
                            {lang === "am" ? "የቅርብ ጊዜ ተመዝጋቢ አባላት" : "Recently Registered Members"}
                        </h2>
                        <p className="text-muted mb-0">{lang === "am" ? "ዘግይቶ ያካፈሉ 5 አባላት" : "Last 5 registered members"}</p>
                    </div>
                </div>
                {recentMembers.length === 0 ? (
                    <p style={{ color: "var(--admin-muted)", fontSize: "0.9rem" }}>{lang === "am" ? "ምንም አባላት አልተገኙም" : "No members yet."}</p>
                ) : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>{lang === "am" ? "ስም" : "Name"}</th>
                                    <th>{lang === "am" ? "ኢሜይል" : "Email"}</th>
                                    <th>{lang === "am" ? "ክፍል" : "Department"}</th>
                                    <th>{lang === "am" ? "ቀን" : "Registered"}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentMembers.map(m => (
                                    <tr key={m.id}>
                                        <td style={{ fontWeight: 700 }}>{m.firstName} {m.lastName}</td>
                                        <td className="text-muted">{m.user.email}</td>
                                        <td>
                                            <span className="badge badge-primary">{m.department}</span>
                                        </td>
                                        <td className="text-muted">
                                            {new Date(m.user.createdAt).toLocaleDateString(lang === "am" ? 'am-ET' : 'en-US')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
