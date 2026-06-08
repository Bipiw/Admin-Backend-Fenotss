import prisma from "@/lib/prisma"
import { Users, ClipboardCheck, UserPlus } from "lucide-react"
import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display"
import { MemberExportButtons } from "@/components/dashboard/member-export-buttons"
import { ChangePasswordCard } from "@/components/dashboard/change-password-card"
import { cookies } from "next/headers"
import { getTranslation } from "@/lib/translations"

export const dynamic = 'force-dynamic'

export default async function MembersAffairsDashboard() {
    const cookieStore = cookies()
    const lang = cookieStore.get("language")?.value || "en"
    const t = (key: string) => getTranslation(lang, key)

    const totalMembers = await prisma.user.count({ where: { role: 'MEMBER' } })
    const unassignedMembers = await prisma.memberProfile.count({
        where: {
            department: 'OTHER',
            user: { role: 'MEMBER' }
        }
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const attendanceToday = await prisma.attendance.count({
        where: { date: { gte: today }, status: 'PRESENT' }
    })

    const attendanceRate = totalMembers > 0 ? Math.round((attendanceToday / totalMembers) * 100) : 0

    return (
        <div>
            {/* Page Heading */}
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <Users size={22} />
                    </span>
                    <div>
                        <p className="eyebrow mb-1">{t("role.membersAffairs")}</p>
                        <h1 className="h3 mb-1">{lang === "am" ? "ኦፕሬሽን ማዕከል" : "Operation Hub"}</h1>
                        <p className="text-muted mb-0">{lang === "am" ? "አባላትን እና ዕለታዊ ሥራዎችን ያስተዳድሩ" : "Manage members and daily operations"}</p>
                    </div>
                </div>
                <div className="heading-actions">
                    <MemberExportButtons />
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
                        <span className="text-success">
                            {lang === "am" ? "ሁሉም ምዝገባ ያለቸው አባላት" : "All registered members"}
                        </span>
                    </div>
                </article>

                <article className="metric-card metric-success">
                    <div className="metric-top">
                        <span className="metric-label">{lang === "am" ? "ዛሬ ተገኝነት" : "Attendance Today"}</span>
                        <span className="metric-icon"><ClipboardCheck size={18} /></span>
                    </div>
                    <div className="metric-value">{attendanceToday.toLocaleString()}</div>
                    <div className="metric-meta">
                        <span className={attendanceRate >= 50 ? "text-success" : "text-danger"}>
                            {attendanceRate}%
                        </span>
                        <span>{lang === "am" ? "የዛሬ ምጣኔ" : "today's rate"}</span>
                    </div>
                </article>

                <article className={`metric-card ${unassignedMembers > 0 ? "metric-warning" : "metric-success"}`}>
                    <div className="metric-top">
                        <span className="metric-label">{lang === "am" ? "ያልተመደቡ" : "Unassigned"}</span>
                        <span className="metric-icon"><UserPlus size={18} /></span>
                    </div>
                    <div className="metric-value">{unassignedMembers}</div>
                    <div className="metric-meta">
                        <span className={unassignedMembers > 0 ? "text-danger" : "text-success"}>
                            {unassignedMembers > 0
                                ? (lang === "am" ? "የምደባ ያስፈልጋቸዋል" : "Need department assignment")
                                : (lang === "am" ? "ሁሉም ተመድበዋል" : "All assigned")
                            }
                        </span>
                    </div>
                </article>
            </div>

            <div style={{ maxWidth: 480 }}>
                <ChangePasswordCard />
            </div>
        </div>
    )
}
