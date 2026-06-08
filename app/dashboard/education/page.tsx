import prisma from "@/lib/prisma"
import { Users, BookOpen, GraduationCap } from "lucide-react"
import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display"
import { ChangePasswordCard } from "@/components/dashboard/change-password-card"
import { cookies } from "next/headers"
import { getTranslation } from "@/lib/translations"

export const dynamic = 'force-dynamic'

export default async function EducationDashboard() {
    const cookieStore = cookies()
    const lang = cookieStore.get("language")?.value || "en"
    const t = (key: string) => getTranslation(lang, key)

    const totalStudents = await prisma.user.count({ where: { role: 'MEMBER' } })

    const studentsByLevel = await prisma.academicRecord.groupBy({
        by: ['year'],
        where: { status: 'ENROLLED' },
        _count: { memberId: true }
    })

    return (
        <div>
            {/* Page Heading */}
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <GraduationCap size={22} />
                    </span>
                    <div>
                        <p className="eyebrow mb-1">{t("role.education")}</p>
                        <h1 className="h3 mb-1">{lang === "am" ? "የትምህርት አጠቃላይ እይታ" : "Academic Overview"}</h1>
                        <p className="text-muted mb-0"><EthiopianDateDisplay /></p>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="metrics-row">
                <article className="metric-card metric-primary">
                    <div className="metric-top">
                        <span className="metric-label">{lang === "am" ? "ጠቅላላ ተማሪዎች" : "Total Students"}</span>
                        <span className="metric-icon"><Users size={18} /></span>
                    </div>
                    <div className="metric-value">{totalStudents.toLocaleString()}</div>
                    <div className="metric-meta">
                        <span className="text-success">{lang === "am" ? "ምዝገባ ላይ ያሉ አባላት" : "Active enrolled members"}</span>
                    </div>
                </article>

                <article className="metric-card metric-success">
                    <div className="metric-top">
                        <span className="metric-label">{lang === "am" ? "የደረጃ ብዛት" : "Active Levels"}</span>
                        <span className="metric-icon"><BookOpen size={18} /></span>
                    </div>
                    <div className="metric-value">{studentsByLevel.length}</div>
                    <div className="metric-meta">
                        <span>{lang === "am" ? "ንቁ የትምህርት ደረጃዎች" : "Active curriculum levels"}</span>
                    </div>
                </article>
            </div>

            {/* Enrollment by Level */}
            {studentsByLevel.length > 0 && (
                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h2 className="section-title">
                                <span className="title-icon"><BookOpen size={16} /></span>
                                {lang === "am" ? "ምዝገባ በደረጃ" : "Enrollment by Level"}
                            </h2>
                            <p className="text-muted mb-0">{lang === "am" ? "ንቁ ምዝገባ ላላቸው ሁሉም ደረጃዎች" : "All levels with active enrollment"}</p>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.75rem" }}>
                        {studentsByLevel.map(level => (
                            <div
                                key={level.year}
                                style={{
                                    padding: "1rem",
                                    borderRadius: 8,
                                    background: "var(--admin-surface-soft)",
                                    border: "1px solid var(--admin-border)",
                                    textAlign: "center",
                                }}
                            >
                                <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", color: "var(--admin-muted)", marginBottom: "0.5rem" }}>
                                    {lang === "am" ? "ዓመት" : "Year"} {level.year}
                                </div>
                                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--admin-primary)", lineHeight: 1 }}>
                                    {level._count.memberId}
                                </div>
                                <div style={{ fontSize: "0.85rem", color: "var(--admin-muted)", marginTop: "0.25rem" }}>
                                    {lang === "am" ? "ተማሪዎች" : "students"}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {studentsByLevel.length === 0 && (
                <div className="panel" style={{ textAlign: "center", padding: "2.5rem", color: "var(--admin-muted)" }}>
                    {lang === "am" ? "ምንም ሳይቀዳ ሁኔታ አልተገኘም" : "No enrollment data available yet."}
                </div>
            )}

            <div style={{ maxWidth: 480, marginTop: "1rem" }}>
                <ChangePasswordCard />
            </div>
        </div>
    )
}
