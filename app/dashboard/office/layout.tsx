"use client"

import { LayoutDashboard, Search, FileText, Building2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { DashboardShell, NavItem } from "@/components/dashboard/dashboard-shell"

export default function OfficeLayout({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage()

    const navItems: NavItem[] = [
        { title: t("sidebar.overview"), url: "/dashboard/office", icon: LayoutDashboard },
        { title: t("sidebar.office.members"), url: "/dashboard/office/members", icon: Search },
        { title: t("sidebar.office.clearance"), url: "/dashboard/office/clearance", icon: FileText },
    ]

    return (
        <DashboardShell
            navItems={navItems}
            brandTitle={t("role.office")}
            brandSubtitle="Administration Portal"
            brandIcon={Building2}
            roleLabel={t("role.office").toUpperCase()}
        >
            {children}
        </DashboardShell>
    )
}
