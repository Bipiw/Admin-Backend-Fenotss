"use client"

import { Users, ClipboardCheck, UserPlus, LayoutDashboard, ShieldCheck } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { DashboardShell, NavItem } from "@/components/dashboard/dashboard-shell"

export default function MembersAffairsLayout({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage()

    const navItems: NavItem[] = [
        { title: t("sidebar.overview"), url: "/dashboard/members-affairs", icon: LayoutDashboard },
        { title: t("sidebar.membersAffairs.directory"), url: "/dashboard/members-affairs/members", icon: Users },
        { title: t("sidebar.membersAffairs.attendance"), url: "/dashboard/members-affairs/attendance", icon: ClipboardCheck },
        { title: t("sidebar.membersAffairs.assignments"), url: "/dashboard/members-affairs/assignments", icon: UserPlus },
        { title: t("sidebar.membersAffairs.eligibility"), url: "/dashboard/members-affairs/eligibility", icon: ShieldCheck },
    ]

    return (
        <DashboardShell
            navItems={navItems}
            brandTitle={t("role.membersAffairs")}
            brandSubtitle="Engagement Portal"
            brandIcon={Users}
            roleLabel={t("role.membersAffairs").toUpperCase()}
        >
            {children}
        </DashboardShell>
    )
}
