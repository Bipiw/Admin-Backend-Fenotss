"use client"

import { LayoutDashboard, Music, ClipboardCheck } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { DashboardShell, NavItem } from "@/components/dashboard/dashboard-shell"

export default function ChoirLayout({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage()

    const navItems: NavItem[] = [
        { title: t("sidebar.overview"), url: "/dashboard/choir", icon: LayoutDashboard },
        { title: t("sidebar.choir.attendance"), url: "/dashboard/choir/attendance", icon: ClipboardCheck },
    ]

    return (
        <DashboardShell
            navItems={navItems}
            brandTitle={t("role.choir")}
            brandSubtitle="Attendance Portal"
            brandIcon={Music}
            roleLabel={t("role.choir").toUpperCase()}
        >
            {children}
        </DashboardShell>
    )
}
