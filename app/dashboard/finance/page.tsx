import prisma from "@/lib/prisma"
import { DollarSign, TrendingUp, AlertTriangle, BarChart2, PieChart } from "lucide-react"
import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display"
import { RevenueTrendChart, PaymentStatusDistribution } from "@/components/dashboard/finance-charts"
import { ChangePasswordCard } from "@/components/dashboard/change-password-card"
import { cookies } from "next/headers"
import { getTranslation } from "@/lib/translations"

export const dynamic = 'force-dynamic'

export default async function FinanceDashboard() {
    const cookieStore = cookies()
    const lang = cookieStore.get("language")?.value || "en"
    const t = (key: string) => getTranslation(lang, key)

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    const [revenueResult, prevRevenueResult, memberCount] = await Promise.all([
        prisma.financialRecord.aggregate({
            _sum: { amount: true },
            where: { type: 'MONTHLY_CONTRIBUTION', date: { gte: startOfMonth }, status: 'PAID' }
        }),
        prisma.financialRecord.aggregate({
            _sum: { amount: true },
            where: { type: 'MONTHLY_CONTRIBUTION', date: { gte: startOfPrevMonth, lt: startOfMonth }, status: 'PAID' }
        }),
        prisma.user.count({ where: { role: 'MEMBER' } })
    ])

    const monthlyRevenue = revenueResult._sum.amount ? Number(revenueResult._sum.amount) : 0
    const prevRevenue = prevRevenueResult._sum.amount ? Number(prevRevenueResult._sum.amount) : 0
    const revTrend = prevRevenue > 0 ? Math.round(((monthlyRevenue - prevRevenue) / prevRevenue) * 100) : monthlyRevenue > 0 ? 100 : 0
    const expectedRevenue = memberCount * 200

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)

    const financialRecords = await prisma.financialRecord.findMany({
        where: { date: { gte: sixMonthsAgo }, status: 'PAID' },
        select: { amount: true, date: true, type: true }
    })

    const trendData = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (5 - i))
        const monthName = d.toLocaleString('default', { month: 'short' })
        const income = financialRecords
            .filter(r => r.date.getMonth() === d.getMonth() && r.date.getFullYear() === d.getFullYear())
            .reduce((sum, r) => sum + Number(r.amount), 0)
        return { name: monthName, income, expenses: income * 0.2 }
    })

    const statusCounts = await prisma.financialRecord.groupBy({
        by: ['status'],
        _count: { _all: true },
        where: { date: { gte: startOfMonth } }
    })

    const distributionData = statusCounts.map(s => ({
        status: s.status,
        count: s._count._all,
        color: s.status === 'PAID' ? '#0f766e' : s.status === 'PENDING' ? '#d97706' : '#dc2626'
    }))

    const complianceRate = expectedRevenue > 0 ? Math.round((monthlyRevenue / expectedRevenue) * 100) : 0

    return (
        <div>
            {/* Page Heading */}
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <DollarSign size={22} />
                    </span>
                    <div>
                        <p className="eyebrow mb-1">{lang === "am" ? "ፋይናንስ" : "Finance"}</p>
                        <h1 className="h3 mb-1">{t("finance.dash.title")}</h1>
                        <p className="text-muted mb-0"><EthiopianDateDisplay /></p>
                    </div>
                </div>
            </div>

            {/* KPI Metric Cards */}
            <div className="metrics-row">
                <article className="metric-card metric-success">
                    <div className="metric-top">
                        <span className="metric-label">{t("finance.dash.monthlyIncome")}</span>
                        <span className="metric-icon"><DollarSign size={18} /></span>
                    </div>
                    <div className="metric-value">{monthlyRevenue.toLocaleString()}</div>
                    <div className="metric-meta">
                        <span className={revTrend >= 0 ? "text-success" : "text-danger"}>
                            {revTrend >= 0 ? "+" : ""}{revTrend}%
                        </span>
                        <span>{t("finance.dash.monthlyDetail")}</span>
                    </div>
                </article>

                <article className="metric-card metric-primary">
                    <div className="metric-top">
                        <span className="metric-label">{t("finance.dash.expectedIncome")}</span>
                        <span className="metric-icon"><TrendingUp size={18} /></span>
                    </div>
                    <div className="metric-value">{expectedRevenue.toLocaleString()}</div>
                    <div className="metric-meta">
                        <span>{t("finance.dash.expectedDetail")}</span>
                    </div>
                </article>

                <article className={`metric-card ${complianceRate >= 80 ? "metric-success" : complianceRate >= 50 ? "metric-warning" : "metric-danger"}`}>
                    <div className="metric-top">
                        <span className="metric-label">{t("finance.dash.complianceRate")}</span>
                        <span className="metric-icon"><AlertTriangle size={18} /></span>
                    </div>
                    <div className="metric-value">{complianceRate}%</div>
                    <div className="metric-meta">
                        <span className={complianceRate >= 80 ? "text-success" : "text-danger"}>
                            {complianceRate >= 80 ? "✓ " : "⚠ "}{t("finance.dash.complianceDetail")}
                        </span>
                    </div>
                </article>
            </div>

            {/* Charts Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "1rem", marginBottom: "1rem" }}>
                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h2 className="section-title">
                                <span className="title-icon"><BarChart2 size={16} /></span>
                                {t("finance.dash.revenueTrend")}
                            </h2>
                            <p className="text-muted mb-0">{lang === "am" ? "ባለፉት 6 ወሮች" : "Last 6 months"}</p>
                        </div>
                    </div>
                    <RevenueTrendChart data={trendData} />
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <div>
                            <h2 className="section-title">
                                <span className="title-icon"><PieChart size={16} /></span>
                                {t("finance.dash.paymentStatus")}
                            </h2>
                            <p className="text-muted mb-0">{lang === "am" ? "የዚህ ወር ሁኔታ" : "This month's status"}</p>
                        </div>
                    </div>
                    <PaymentStatusDistribution data={distributionData} />
                </div>
            </div>

            {/* Change Password */}
            <div style={{ maxWidth: 480 }}>
                <ChangePasswordCard />
            </div>
        </div>
    )
}
