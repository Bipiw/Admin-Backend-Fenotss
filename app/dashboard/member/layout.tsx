"use client"

import { LayoutDashboard, Calendar, CreditCard, UserCircle, Book, GraduationCap, ShieldCheck } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { DashboardShell, NavItem } from "@/components/dashboard/dashboard-shell"

export default function MemberLayout({ children }: { children: React.ReactNode }) {
    const { t } = useLanguage()

    const navItems: NavItem[] = [
        { title: t("sidebar.member.dashboard"), url: "/dashboard/member", icon: LayoutDashboard },
        { title: t("sidebar.member.attendance"), url: "/dashboard/member/attendance", icon: Calendar },
        { title: t("sidebar.member.grades"), url: "/dashboard/member/grades", icon: GraduationCap },
        { title: t("sidebar.member.payments"), url: "/dashboard/member/finance", icon: CreditCard },
        { title: t("sidebar.member.status"), url: "/dashboard/member/service-status", icon: ShieldCheck },
        { title: t("sidebar.member.resources"), url: "/dashboard/member/resources", icon: Book },
        { title: t("sidebar.member.profile"), url: "/dashboard/member/profile", icon: UserCircle },
    ]

    return (
        <DashboardShell
            navItems={navItems}
            brandTitle={t("role.member")}
            brandSubtitle="My Account"
            brandIcon={UserCircle}
            roleLabel={t("role.member").toUpperCase()}
        >
            {children}
        </DashboardShell>
    )
}
