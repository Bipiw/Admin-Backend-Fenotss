import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, AlertTriangle } from "lucide-react"
import { EthiopianDateDisplay } from "@/components/dashboard/ethiopian-date-display"
import { RevenueTrendChart, PaymentStatusDistribution } from "@/components/dashboard/finance-charts"
import { ChangePasswordCard } from "@/components/dashboard/change-password-card"

export const dynamic = 'force-dynamic'

export default async function FinanceDashboard() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const revenueResult = await prisma.financialRecord.aggregate({
        _sum: { amount: true },
        where: {
            type: 'MONTHLY_CONTRIBUTION',
            date: { gte: startOfMonth },
            status: 'PAID'
        }
    })

    const monthlyRevenue = revenueResult._sum.amount ? Number(revenueResult._sum.amount) : 0
    const expectedRevenue = await prisma.user.count({ where: { role: 'MEMBER' } }) * 200 // Assuming 200 ETB fee

    // Fetch trend data for the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)

    const financialRecords = await prisma.financialRecord.findMany({
        where: {
            date: { gte: sixMonthsAgo },
            status: 'PAID'
        },
        select: {
            amount: true,
            date: true,
            type: true
        }
    })

    const trendData = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (5 - i))
        const monthName = d.toLocaleString('default', { month: 'short' })

        const income = financialRecords
            .filter(r => r.date.getMonth() === d.getMonth() && r.date.getFullYear() === d.getFullYear())
            .reduce((sum, r) => sum + Number(r.amount), 0)

        // Simulating expenses for now as there might not be an expense model yet
        // or we can just show revenue trend.
        const expenses = income * 0.2 // Mock 20% expenses

        return { name: monthName, income, expenses }
    })

    const statusCounts = await prisma.financialRecord.groupBy({
        by: ['status'],
        _count: { _all: true },
        where: {
            date: { gte: startOfMonth }
        }
    })

    const distributionData = statusCounts.map(s => ({
        status: s.status,
        count: s._count._all,
        color: s.status === 'PAID' ? '#10b981' : s.status === 'PENDING' ? '#f59e0b' : '#ef4444'
    }))

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Financial Overview</h2>
                <EthiopianDateDisplay />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{monthlyRevenue.toLocaleString()} ETB</div>
                        <p className="text-xs text-muted-foreground">Collected this month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expected Income</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expectedRevenue.toLocaleString()} ETB</div>
                        <p className="text-xs text-muted-foreground">Based on active members</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{expectedRevenue > 0 ? Math.round((monthlyRevenue / expectedRevenue) * 100) : 0}%</div>
                        <p className="text-xs text-muted-foreground">Members paid this month</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RevenueTrendChart data={trendData} />
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Payment Status (This Month)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PaymentStatusDistribution data={distributionData} />
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-md">
                <ChangePasswordCard />
            </div>
        </div>
    )
}
