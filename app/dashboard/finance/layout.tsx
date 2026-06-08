"use client"

import { LayoutDashboard, Wallet, CreditCard, AlertCircle, TableProperties } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { DashboardShell, NavItem } from "@/components/dashboard/dashboard-shell"

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage()

    const navItems: NavItem[] = [
        { title: t("sidebar.overview"), url: "/dashboard/finance", icon: LayoutDashboard },
        { title: t("sidebar.finance.ledger"), url: "/dashboard/finance/ledger", icon: TableProperties },
        { title: t("sidebar.finance.payments"), url: "/dashboard/finance/payments", icon: CreditCard },
        { title: t("sidebar.finance.transactions"), url: "/dashboard/finance/transactions", icon: Wallet },
        { title: t("sidebar.finance.defaulters"), url: "/dashboard/finance/defaulters", icon: AlertCircle },
    ]

    return (
        <DashboardShell
            navItems={navItems}
            brandTitle={t("role.finance")}
            brandSubtitle="Accounting Portal"
            brandIcon={Wallet}
            roleLabel={t("role.finance").toUpperCase()}
        >
            {children}
        </DashboardShell>
    )
}
