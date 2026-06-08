"use client"

import { BarChart3, Users, Settings, FileText, Bell, DollarSign, GraduationCap, User, Shield } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { DashboardShell, NavItem } from "@/components/dashboard/dashboard-shell"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage()

    const navItems: NavItem[] = [
        { title: t("sidebar.overview"), url: "/dashboard/admin", icon: BarChart3 },
        { title: t("sidebar.admin.users"), url: "/dashboard/admin/users", icon: Users },
        { title: t("sidebar.admin.settings"), url: "/dashboard/admin/settings", icon: Settings },
        { title: t("sidebar.admin.logs"), url: "/dashboard/admin/logs", icon: FileText },
        { title: t("sidebar.admin.notifications"), url: "/dashboard/admin/notifications", icon: Bell },
    ]

    const secondaryNavItems = {
        label: t("sidebar.otherDashboards"),
        items: [
            { title: t("role.finance"), url: "/dashboard/finance", icon: DollarSign },
            { title: t("role.education"), url: "/dashboard/education", icon: GraduationCap },
            { title: t("role.membersAffairs"), url: "/dashboard/members-affairs", icon: Users },
            { title: t("role.member"), url: "/dashboard/member", icon: User },
        ] as NavItem[],
    }

    return (
        <DashboardShell
            navItems={navItems}
            secondaryNavItems={secondaryNavItems}
            brandTitle={t("role.superAdmin")}
            brandSubtitle="Control Center"
            brandIcon={Shield}
            roleLabel={t("role.superAdmin").toUpperCase()}
        >
            {children}
        </DashboardShell>
    )
}
